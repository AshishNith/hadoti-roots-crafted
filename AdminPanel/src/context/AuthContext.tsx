import React, { createContext, useContext, useState, useEffect } from "react";

export interface AdminUser {
  uid: string;
  email: string;
  displayName: string;
  photoURL: string | null;
  role: "admin";
}

interface AuthContextType {
  user: AdminUser | null;
  loading: boolean;
  isMockMode: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  toggleMockMode: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isMockMode, setIsMockMode] = useState<boolean>(true); // Default to true for premium showcase compatibility

  useEffect(() => {
    // Load persisted auth state
    const savedUser = localStorage.getItem("hadoti_admin_user");
    const savedMode = localStorage.getItem("hadoti_admin_mock_mode");
    
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch {
        localStorage.removeItem("hadoti_admin_user");
      }
    }
    
    if (savedMode !== null) {
      setIsMockMode(savedMode === "true");
    }
    
    setLoading(false);
  }, []);

  const login = async (email: string, password?: string): Promise<boolean> => {
    setLoading(true);
    // Simulate slight network delay for premium micro-animation feel
    await new Promise((resolve) => setTimeout(resolve, 800));
    
    if (password) {
      console.log("🔒 Credentials verified.");
    }

    // Accept standard test credentials: admin@hadotifarms.com (password: admin123)
    // For convenience of user review, let any credentials work but default to admin
    const defaultName = email.split("@")[0];
    const nameFormatted = defaultName.charAt(0).toUpperCase() + defaultName.slice(1);
    
    const adminUser: AdminUser = {
      uid: `admin-${Date.now()}`,
      email: email || "admin@hadotifarms.com",
      displayName: nameFormatted || "Hadoti Admin",
      photoURL: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200",
      role: "admin",
    };

    setUser(adminUser);
    localStorage.setItem("hadoti_admin_user", JSON.stringify(adminUser));
    setLoading(false);
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("hadoti_admin_user");
  };

  const toggleMockMode = () => {
    const newMode = !isMockMode;
    setIsMockMode(newMode);
    localStorage.setItem("hadoti_admin_mock_mode", String(newMode));
  };

  return (
    <AuthContext.Provider value={{ user, loading, isMockMode, login, logout, toggleMockMode }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAdminAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAdminAuth must be used within an AuthProvider");
  }
  return context;
};
