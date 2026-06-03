import { create } from "zustand";
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  updateProfile, 
  signInWithPopup, 
  GoogleAuthProvider, 
  signOut as firebaseSignOut,
  User as FirebaseUser
} from "firebase/auth";
import { auth, isFirebaseConfigured } from "./firebase";
import { syncUser } from "./api-client";

export interface AuthUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
}

interface AuthState {
  user: AuthUser | null;
  loading: boolean;
  error: string | null;
  isMock: boolean;
  setUser: (user: AuthUser | null) => void;
  setError: (error: string | null) => void;
  setLoading: (loading: boolean) => void;
  signUp: (email: string, password: string, name: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
}

// Check local storage for mock user persistence
const getInitialMockUser = (): AuthUser | null => {
  if (typeof window === "undefined") return null;
  try {
    const saved = localStorage.getItem("hadoti_farms_mock_user");
    return saved ? JSON.parse(saved) : null;
  } catch {
    return null;
  }
};

export const useAuth = create<AuthState>((set) => ({
  user: isFirebaseConfigured ? null : getInitialMockUser(),
  loading: isFirebaseConfigured, // Start loading if waiting for Firebase auth state observer
  error: null,
  isMock: !isFirebaseConfigured,

  setUser: (user) => set({ user, loading: false }),
  setError: (error) => set({ error, loading: false }),
  setLoading: (loading) => set({ loading }),

  signUp: async (email, password, name) => {
    set({ loading: true, error: null });
    
    if (!isFirebaseConfigured) {
      // Mock signup flow
      await new Promise((resolve) => setTimeout(resolve, 800));
      const mockUser: AuthUser = {
        uid: `mock-uid-${Date.now()}`,
        email,
        displayName: name,
        photoURL: null,
      };
      if (typeof window !== "undefined") {
        localStorage.setItem("hadoti_farms_mock_user", JSON.stringify(mockUser));
      }
      syncUser(mockUser).catch((err) => console.error("Failed to sync mock user to MongoDB:", err));
      set({ user: mockUser, loading: false });
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      // Set display name in profile
      await updateProfile(userCredential.user, { displayName: name });
      const u = userCredential.user;
      set({
        user: {
          uid: u.uid,
          email: u.email,
          displayName: name,
          photoURL: u.photoURL,
        },
        loading: false,
      });
    } catch (err: any) {
      set({ error: err.message || "Failed to sign up", loading: false });
      throw err;
    }
  },

  signIn: async (email, password) => {
    set({ loading: true, error: null });

    if (!isFirebaseConfigured) {
      // Mock login flow
      await new Promise((resolve) => setTimeout(resolve, 600));
      const mockUser: AuthUser = {
        uid: "mock-uid-default",
        email,
        displayName: email.split("@")[0],
        photoURL: null,
      };
      if (typeof window !== "undefined") {
        localStorage.setItem("hadoti_farms_mock_user", JSON.stringify(mockUser));
      }
      syncUser(mockUser).catch((err) => console.error("Failed to sync mock user to MongoDB:", err));
      set({ user: mockUser, loading: false });
      return;
    }

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const u = userCredential.user;
      set({
        user: {
          uid: u.uid,
          email: u.email,
          displayName: u.displayName,
          photoURL: u.photoURL,
        },
        loading: false,
      });
    } catch (err: any) {
      set({ error: err.message || "Failed to sign in", loading: false });
      throw err;
    }
  },

  signInWithGoogle: async () => {
    set({ loading: true, error: null });

    if (!isFirebaseConfigured) {
      // Mock google login flow
      await new Promise((resolve) => setTimeout(resolve, 600));
      const mockUser: AuthUser = {
        uid: "mock-google-uid",
        email: "guest@hadotifarms.com",
        displayName: "Guest Farmer",
        photoURL: null,
      };
      if (typeof window !== "undefined") {
        localStorage.setItem("hadoti_farms_mock_user", JSON.stringify(mockUser));
      }
      syncUser(mockUser).catch((err) => console.error("Failed to sync mock user to MongoDB:", err));
      set({ user: mockUser, loading: false });
      return;
    }

    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const u = result.user;
      set({
        user: {
          uid: u.uid,
          email: u.email,
          displayName: u.displayName,
          photoURL: u.photoURL,
        },
        loading: false,
      });
    } catch (err: any) {
      set({ error: err.message || "Failed to login with Google", loading: false });
      throw err;
    }
  },

  signOut: async () => {
    set({ loading: true });

    if (!isFirebaseConfigured) {
      // Mock logout flow
      await new Promise((resolve) => setTimeout(resolve, 300));
      if (typeof window !== "undefined") {
        localStorage.removeItem("hadoti_farms_mock_user");
      }
      set({ user: null, loading: false });
      return;
    }

    try {
      await firebaseSignOut(auth);
      set({ user: null, loading: false });
    } catch (err: any) {
      set({ error: err.message || "Failed to sign out", loading: false });
      throw err;
    }
  },
}));
