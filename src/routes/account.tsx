import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth-store";
import { Button } from "@/components/ui/HFButton";
import { toast } from "sonner";
import { getUserOrders, getSavedBlends } from "@/lib/api-client";
import { 
  ArrowLeft, 
  Package, 
  Truck, 
  CheckCircle2, 
  Download, 
  HelpCircle, 
  AlertTriangle, 
  ShieldCheck 
} from "lucide-react";

export const Route = createFileRoute("/account")({
  head: () => ({ meta: [{ title: "Account — Hadoti Farms" }] }),
  component: AccountPage,
});

function AccountPage() {
  const { user, loading, error, signUp, signIn, signInWithGoogle, signOut, isMock } = useAuth();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  const [orders, setOrders] = useState<any[]>([]);
  const [blends, setBlends] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<"dashboard" | "orders" | "blends">("dashboard");
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      getUserOrders(user.uid)
        .then(setOrders)
        .catch((err) => console.error("Error fetching orders:", err));
      getSavedBlends(user.uid)
        .then(setBlends)
        .catch((err) => console.error("Error fetching blends:", err));
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Please fill in all credentials");
      return;
    }
    try {
      if (mode === "signup") {
        if (!name) {
          toast.error("Please enter your name");
          return;
        }
        await signUp(email, password, name);
        toast.success(`Welcome to Hadoti Farms, ${name}!`);
      } else {
        await signIn(email, password);
        toast.success("Welcome back!");
      }
    } catch (err: any) {
      toast.error(err.message || "Authentication failed");
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle();
      toast.success("Signed in successfully!");
    } catch (err: any) {
      toast.error(err.message || "Google authentication failed");
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      toast.success("Signed out successfully");
    } catch (err: any) {
      toast.error("Failed to sign out");
    }
  };

  if (loading) {
    return (
      <section className="pt-40 pb-32 flex min-h-screen items-center justify-center bg-[color:var(--bg)]">
        <div className="text-center font-mono text-xs uppercase tracking-[0.25em] text-[color:var(--muted-foreground)] animate-pulse">
          Calibrating session...
        </div>
      </section>
    );
  }

  if (user) {
    return (
      <section className="pt-40 pb-32 bg-[color:var(--bg)]">
        <div className="max-w-[1100px] mx-auto px-6 lg:px-10">
          <div className="flex flex-wrap items-center justify-between gap-6 border-b border-[color:var(--border)] pb-8 mb-12">
            <div>
              <div className="font-mono text-[10px] uppercase tracking-[0.24em] text-[color:var(--earth)] mb-2">
                User Dashboard {isMock && "· Preview Profile"}
              </div>
              <h1 className="font-display text-6xl md:text-7xl leading-[1]">
                Welcome, <span className="italic text-[color:var(--earth)]">{user.displayName || "friend"}.</span>
              </h1>
            </div>
            <button
              onClick={handleSignOut}
              className="font-mono text-[11px] uppercase tracking-[0.2em] border border-[color:var(--ink)] hover:bg-[color:var(--ink)] hover:text-white transition-all px-6 py-2.5 rounded-sm cursor-pointer"
            >
              Sign Out
            </button>
          </div>

          {/* Tabs Navigation */}
          <div className="flex gap-6 border-b border-[color:var(--border)] pb-4 mb-8">
            {["dashboard", "orders", "blends"].map((t) => (
              <button
                key={t}
                onClick={() => {
                  setActiveTab(t as any);
                  setSelectedOrderId(null);
                }}
                className={`font-mono text-xs uppercase tracking-[0.2em] pb-2 -mb-px border-b-2 capitalize transition-colors ${
                  activeTab === t
                    ? "border-[color:var(--earth)] text-[color:var(--ink)]"
                    : "border-transparent text-[color:var(--muted-foreground)]"
                }`}
              >
                {t === "dashboard" ? "Overview" : t === "orders" ? `Orders (${orders.length})` : `Saved Blends (${blends.length})`}
              </button>
            ))}
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Profile Panel */}
            <div className="bg-[color:var(--cream)] border border-[color:var(--border)] p-8 h-fit">
              <h2 className="font-display text-3xl mb-6">Profile Settings</h2>
              <div className="space-y-4 font-mono text-xs">
                <div>
                  <div className="text-[color:var(--muted-foreground)] uppercase tracking-[0.1em] mb-1">Display Name</div>
                  <div className="text-sm font-semibold text-[color:var(--ink)]">{user.displayName || "Not set"}</div>
                </div>
                <div className="pt-3 border-t border-[color:var(--border)]">
                  <div className="text-[color:var(--muted-foreground)] uppercase tracking-[0.1em] mb-1">Email Address</div>
                  <div className="text-sm font-semibold text-[color:var(--ink)]">{user.email}</div>
                </div>
                <div className="pt-3 border-t border-[color:var(--border)]">
                  <div className="text-[color:var(--muted-foreground)] uppercase tracking-[0.1em] mb-1">Account ID</div>
                  <div className="text-[10px] text-[color:var(--muted-foreground)] truncate">{user.uid}</div>
                </div>
              </div>
            </div>

            {/* Dashboard Cards & Lists */}
            <div className="lg:col-span-2 space-y-6">
              {activeTab === "dashboard" && (
                <div className="space-y-6 animate-fade-in">
                  <div className="grid sm:grid-cols-2 gap-6">
                    <button
                      onClick={() => setActiveTab("orders")}
                      className="block text-left border border-[color:var(--border)] bg-[color:var(--cream)]/40 p-8 hover:border-[color:var(--ink)] transition-colors group cursor-pointer"
                    >
                      <div className="flex justify-between items-start gap-4">
                        <h3 className="font-display text-3xl">Orders</h3>
                        <span className="font-mono text-[9px] uppercase tracking-[0.15em] bg-[color:var(--earth)]/10 text-[color:var(--earth)] px-2 py-0.5 rounded-full">
                          {orders.length} Active
                        </span>
                      </div>
                      <p className="mt-3 text-sm text-[color:var(--muted-foreground)] leading-relaxed">
                        Track recent orders and view tracing coordinates.
                      </p>
                      <span className="mt-6 inline-block story-link font-mono text-xs uppercase tracking-[0.2em] text-[color:var(--earth)]">
                        Open Panel →
                      </span>
                    </button>

                    <button
                      onClick={() => setActiveTab("blends")}
                      className="block text-left border border-[color:var(--border)] bg-[color:var(--cream)]/40 p-8 hover:border-[color:var(--ink)] transition-colors group cursor-pointer"
                    >
                      <div className="flex justify-between items-start gap-4">
                        <h3 className="font-display text-3xl">Saved Blends</h3>
                        <span className="font-mono text-[9px] uppercase tracking-[0.15em] bg-[color:var(--earth)]/10 text-[color:var(--earth)] px-2 py-0.5 rounded-full">
                          {blends.length} Saved
                        </span>
                      </div>
                      <p className="mt-3 text-sm text-[color:var(--muted-foreground)] leading-relaxed">
                        Your custom sun-dried mix specifications.
                      </p>
                      <span className="mt-6 inline-block story-link font-mono text-xs uppercase tracking-[0.2em] text-[color:var(--earth)]">
                        Open Panel →
                      </span>
                    </button>
                  </div>

                  {/* Subscriptions */}
                  <div className="border border-[color:var(--border)] bg-[color:var(--cream)]/40 p-8">
                    <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                      <h3 className="font-display text-3xl">Active Subscriptions</h3>
                      <span className="font-mono text-xs text-[color:var(--earth)] uppercase tracking-[0.15em]">
                        Hadoti Ration Box
                      </span>
                    </div>
                    <p className="text-sm text-[color:var(--muted-foreground)] max-w-xl leading-relaxed">
                      Your customized monthly supply (Medium Box - 5kg) of pesticide-free stone-ground grains, heritage dals, and sun-dried chillies is scheduled to ship on June 5, 2026.
                    </p>
                    <Link
                      to="/customize/ration-box"
                      className="mt-6 inline-block story-link font-mono text-xs uppercase tracking-[0.2em]"
                    >
                      Manage Subscription →
                    </Link>
                  </div>
                </div>
              )}

              {activeTab === "orders" && (
                selectedOrderId ? (
                  <OrderDetail order={orders.find((o) => o._id === selectedOrderId)} onBack={() => setSelectedOrderId(null)} />
                ) : (
                  <div className="space-y-6 animate-fade-in">
                    <div className="flex justify-between items-center mb-4">
                      <h2 className="font-display text-4xl">Order History</h2>
                      <span className="font-mono text-xs text-[color:var(--muted-foreground)] font-semibold uppercase tracking-wider">
                        Showing {orders.length} transaction{orders.length !== 1 && "s"}
                      </span>
                    </div>
                    {orders.length === 0 ? (
                      <div className="border border-[color:var(--border)] bg-[color:var(--cream)]/20 p-8 text-center">
                        <p className="font-display italic text-2xl text-[color:var(--muted-foreground)]">
                          You have no placed orders yet.
                        </p>
                        <Link to="/shop" className="mt-4 inline-block story-link font-mono text-xs uppercase tracking-[0.2em]">
                          Visit the Pantry →
                        </Link>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {orders.map((o) => (
                          <div
                            key={o._id}
                            onClick={() => setSelectedOrderId(o._id)}
                            className="border border-[color:var(--border)] bg-[color:var(--cream)]/40 p-6 hover:border-[color:var(--ink)] cursor-pointer transition-all duration-300 group flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6"
                          >
                            <div className="space-y-2">
                              <div className="flex items-center gap-3">
                                <span className="font-mono text-sm font-semibold text-[color:var(--earth)]">
                                  {o.orderNumber}
                                </span>
                                <span className={`font-mono text-[9px] uppercase tracking-[0.15em] px-2.5 py-0.5 rounded-full ${
                                  o.status === "cancelled"
                                    ? "bg-red-50 text-red-600 border border-red-100"
                                    : o.status === "delivered"
                                    ? "bg-emerald-50 text-emerald-600 border border-emerald-100"
                                    : "bg-[color:var(--gold)]/10 text-[color:var(--earth)]"
                                }`}>
                                  {o.status}
                                </span>
                              </div>
                              <p className="text-xs text-[color:var(--muted-foreground)] font-mono">
                                Placed on {new Date(o.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                              </p>
                              <p className="font-display text-lg text-[color:var(--ink)] leading-snug line-clamp-1">
                                {o.items.map((i: any) => `${i.name} (x${i.qty})`).join(", ")}
                              </p>
                            </div>
                            <div className="flex sm:flex-col items-end justify-between w-full sm:w-auto gap-4 pt-4 sm:pt-0 border-t border-[color:var(--border)]/40 sm:border-none">
                              <div className="text-right">
                                <div className="font-mono text-[9px] text-[color:var(--muted-foreground)] uppercase">Total Amount</div>
                                <div className="font-display text-2xl">₹{o.total}</div>
                              </div>
                              <span className="story-link font-mono text-[10px] uppercase tracking-[0.2em] text-[color:var(--earth)] group-hover:text-[color:var(--ink)] mt-2">
                                Details & Track →
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )
              )}

              {activeTab === "blends" && (
                <div className="space-y-6 animate-fade-in">
                  <h2 className="font-display text-4xl mb-4">Saved Recipes & Custom Blends</h2>
                  {blends.length === 0 ? (
                    <div className="border border-[color:var(--border)] bg-[color:var(--cream)]/20 p-8 text-center">
                      <p className="font-display italic text-2xl text-[color:var(--muted-foreground)]">
                        No saved blends found.
                      </p>
                      <Link to="/customize" className="mt-4 inline-block story-link font-mono text-xs uppercase tracking-[0.2em]">
                        Build Your First Blend →
                      </Link>
                    </div>
                  ) : (
                    <div className="grid sm:grid-cols-2 gap-6">
                      {blends.map((b) => (
                        <div key={b._id} className="border border-[color:var(--border)] bg-[color:var(--cream)]/40 p-6 flex flex-col justify-between min-h-[220px]">
                          <div>
                            <span className="font-mono text-[9px] uppercase tracking-[0.15em] bg-[color:var(--earth)]/10 text-[color:var(--earth)] px-2.5 py-1 rounded-full capitalize">
                              {b.blendType} mix
                            </span>
                            <h3 className="font-display text-3xl mt-4 leading-tight">{b.name}</h3>
                            <p className="font-mono text-xs text-[color:var(--muted-foreground)] mt-2 leading-relaxed">
                              {b.customizationSummary}
                            </p>
                          </div>
                          <div className="flex items-center justify-between border-t border-[color:var(--border)] pt-4 mt-6">
                            <span className="font-mono text-[10px] text-[color:var(--muted-foreground)] uppercase tracking-[0.1em]">
                              {b.weight} pouch
                            </span>
                            <span className="font-display text-2xl">₹{b.price}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="pt-40 pb-32 flex min-h-screen items-center justify-center bg-[color:var(--bg)]">
      <div className="w-full max-w-[480px] mx-auto px-6">
        <div className="border border-[color:var(--border)] bg-[color:var(--cream)] p-8 md:p-10 shadow-sm relative overflow-hidden">
          
          {/* Header */}
          <div className="text-center mb-8">
            <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-[color:var(--earth)] mb-3">
              Hadoti Farms
            </div>
            <h1 className="font-display text-5xl leading-tight">
              {mode === "signin" ? (
                <>Welcome, <span className="italic text-[color:var(--earth)]">friend.</span></>
              ) : (
                <>Join the <span className="italic text-[color:var(--earth)]">harvest.</span></>
              )}
            </h1>
            <p className="text-xs text-[color:var(--muted-foreground)] mt-2">
              {mode === "signin" 
                ? "Enter your credentials to access your pantry and custom blends." 
                : "Create an account to save custom stone-ground mixes and track orders."}
            </p>
          </div>

          {/* Social login */}
          <button
            onClick={handleGoogleSignIn}
            className="w-full border border-[color:var(--ink)] hover:bg-[color:var(--ink)] hover:text-white transition-all py-3 rounded-sm flex items-center justify-center gap-3 font-mono text-[10px] uppercase tracking-[0.2em] mb-6 cursor-pointer"
          >
            <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
            </svg>
            Continue with Google
          </button>

          <div className="flex items-center gap-3 mb-6">
            <div className="h-[1px] flex-1 bg-[color:var(--border)]" />
            <span className="font-mono text-[9px] text-[color:var(--muted-foreground)] uppercase tracking-[0.1em]">or</span>
            <div className="h-[1px] flex-1 bg-[color:var(--border)]" />
          </div>

          {/* Credentials form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {mode === "signup" && (
              <div>
                <input
                  type="text"
                  placeholder="Your Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-transparent border-b border-[color:var(--border)] py-3 font-mono text-xs uppercase tracking-[0.1em] outline-none focus:border-[color:var(--earth)] transition-colors"
                  required
                />
              </div>
            )}
            <div>
              <input
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-transparent border-b border-[color:var(--border)] py-3 font-mono text-xs uppercase tracking-[0.1em] outline-none focus:border-[color:var(--earth)] transition-colors"
                required
              />
            </div>
            <div>
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-transparent border-b border-[color:var(--border)] py-3 font-mono text-xs uppercase tracking-[0.1em] outline-none focus:border-[color:var(--earth)] transition-colors"
                required
              />
            </div>

            {error && (
              <div className="font-mono text-[10px] text-red-600 bg-red-50 border border-red-100 p-3 leading-relaxed">
                {error}
              </div>
            )}

            <Button type="submit" className="w-full mt-6 py-3.5 cursor-pointer">
              {mode === "signin" ? "Sign In →" : "Create Account →"}
            </Button>
          </form>

          {/* Footer toggle */}
          <div className="mt-8 text-center border-t border-[color:var(--border)] pt-6">
            <button
              onClick={() => {
                setMode(mode === "signin" ? "signup" : "signin");
                setName("");
                setEmail("");
                setPassword("");
              }}
              className="font-mono text-[10px] uppercase tracking-[0.2em] text-[color:var(--earth)] hover:underline cursor-pointer"
            >
              {mode === "signin" 
                ? "Don't have an account? Sign Up" 
                : "Already have an account? Sign In"}
            </button>
          </div>

        </div>
      </div>
    </section>
  );
}

// ============================================================================
// ORDER DETAIL & TRACKING PANEL VIEW
// ============================================================================
function OrderDetail({ order, onBack }: { order: any; onBack: () => void }) {
  if (!order) return null;

  const statuses = ["placed", "processing", "shipped", "delivered"];
  const currentStatusIndex = statuses.indexOf(order.status);
  const isCancelled = order.status === "cancelled";

  const trackingSteps = [
    {
      title: "Order Placed",
      desc: "Harvest order received & verified.",
      icon: ShieldCheck,
      location: "Digital Ledger",
    },
    {
      title: "Processing",
      desc: "Stone-ground slow way & custom-sorted.",
      icon: Package,
      location: "Jhalawar Artisanal Facility",
    },
    {
      title: "Shipped",
      desc: "Dispatched from Kota hub.",
      icon: Truck,
      location: "Hadoti Logistic Network",
    },
    {
      title: "Delivered",
      desc: "Arrived at your doorstep.",
      icon: CheckCircle2,
      location: "Your Pantry",
    },
  ];

  const handleDownloadInvoice = () => {
    toast.success(`Invoice receipt HF-${order.orderNumber}.pdf downloaded successfully!`);
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Back to Order History Link */}
      <button
        onClick={onBack}
        className="flex items-center gap-2 font-mono text-xs uppercase tracking-[0.2em] text-[color:var(--earth)] hover:text-[color:var(--ink)] transition-colors cursor-pointer border-none bg-transparent p-0"
      >
        <ArrowLeft className="w-3.5 h-3.5" /> Back to Order History
      </button>

      {/* Header Dashboard Summary */}
      <div className="border border-[color:var(--border)] bg-[color:var(--cream)]/40 p-8">
        <div className="flex flex-wrap items-start justify-between gap-6">
          <div>
            <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-[color:var(--earth)] mb-1">
              Receipt & Tracking Panel
            </div>
            <h3 className="font-display text-4xl md:text-5xl">
              Order <span className="italic text-[color:var(--earth)]">{order.orderNumber}</span>
            </h3>
            <p className="font-mono text-xs text-[color:var(--muted-foreground)] mt-2">
              Placed on {new Date(order.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" })}
            </p>
          </div>
          <div className="text-right">
            <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-[color:var(--muted-foreground)] mb-1">
              Grand Total
            </div>
            <div className="font-display text-4xl text-[color:var(--ink)] font-semibold">₹{order.total}</div>
            <span className={`inline-block font-mono text-[9px] uppercase tracking-[0.15em] px-3.5 py-1 rounded-full mt-3 ${
              isCancelled 
                ? "bg-red-50 text-red-600 border border-red-100"
                : order.status === "delivered"
                ? "bg-emerald-50 text-emerald-600 border border-emerald-100"
                : "bg-[color:var(--gold)]/10 text-[color:var(--earth)] border border-[color:var(--gold)]/20"
            }`}>
              {order.status}
            </span>
          </div>
        </div>

        {/* Cancellation Message */}
        {isCancelled && (
          <div className="mt-8 flex items-center gap-3 p-4 bg-red-50/50 border border-red-100/80 text-red-700 font-mono text-xs">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            This transaction was cancelled. If you believe this is an error, please reach out to our farm support team.
          </div>
        )}

        {/* Interactive Progress Tracking Steps */}
        {!isCancelled && (
          <div className="mt-12 pt-8 border-t border-[color:var(--border)]">
            <h4 className="font-mono text-[10px] uppercase tracking-[0.25em] text-[color:var(--muted-foreground)] mb-8">
              Pantry Delivery Pipeline
            </h4>
            
            {/* Desktop View: Horizontal Timeline */}
            <div className="hidden md:flex justify-between items-start relative mb-6">
              {/* Line backing */}
              <div className="absolute top-6 left-8 right-8 h-0.5 bg-[color:var(--border)] -z-10" />
              {/* Active colored overlay */}
              <div 
                className="absolute top-6 left-8 h-0.5 bg-[color:var(--gold)] -z-10 transition-all duration-500" 
                style={{ width: `${(Math.max(0, currentStatusIndex) / (trackingSteps.length - 1)) * 94}%` }}
              />

              {trackingSteps.map((step, idx) => {
                const IconComp = step.icon;
                const isCompleted = idx <= currentStatusIndex;
                const isActive = idx === currentStatusIndex;

                return (
                  <div key={idx} className="flex-1 flex flex-col items-center text-center px-2">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center border transition-all duration-300 ${
                      isCompleted 
                        ? "bg-[color:var(--gold)] border-[color:var(--gold)] text-white" 
                        : "bg-[color:var(--cream)] border-[color:var(--border)] text-[color:var(--muted-foreground)]"
                    } ${isActive ? "ring-4 ring-[color:var(--gold)]/20" : ""}`}>
                      <IconComp className="w-5 h-5" />
                    </div>
                    <div className="mt-4">
                      <div className={`font-display text-lg ${isCompleted ? "text-[color:var(--ink)] font-semibold" : "text-[color:var(--muted-foreground)]"}`}>
                        {step.title}
                      </div>
                      <p className="font-mono text-[9px] text-[color:var(--muted-foreground)] uppercase tracking-[0.1em] mt-1">
                        {isCompleted && isActive ? "Current Stage" : isCompleted ? "Completed" : "Pending"}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Mobile View: Vertical Timeline */}
            <div className="flex md:hidden flex-col space-y-8 relative pl-4">
              {/* Line backing */}
              <div className="absolute top-2 bottom-2 left-7 w-0.5 bg-[color:var(--border)] -z-10" />
              {/* Active colored overlay */}
              <div 
                className="absolute top-2 left-7 w-0.5 bg-[color:var(--gold)] -z-10 transition-all duration-500" 
                style={{ height: `${(Math.max(0, currentStatusIndex) / (trackingSteps.length - 1)) * 88}%` }}
              />

              {trackingSteps.map((step, idx) => {
                const IconComp = step.icon;
                const isCompleted = idx <= currentStatusIndex;
                const isActive = idx === currentStatusIndex;

                return (
                  <div key={idx} className="flex gap-6 items-start">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center border shrink-0 transition-all duration-300 ${
                      isCompleted 
                        ? "bg-[color:var(--gold)] border-[color:var(--gold)] text-white" 
                        : "bg-[color:var(--cream)] border-[color:var(--border)] text-[color:var(--muted-foreground)]"
                    } ${isActive ? "ring-4 ring-[color:var(--gold)]/20" : ""}`}>
                      <IconComp className="w-4.5 h-4.5" />
                    </div>
                    <div>
                      <div className={`font-display text-lg leading-tight ${isCompleted ? "text-[color:var(--ink)] font-semibold" : "text-[color:var(--muted-foreground)]"}`}>
                        {step.title}
                      </div>
                      <p className="text-xs text-[color:var(--muted-foreground)] mt-1">{step.desc}</p>
                      <span className="inline-block font-mono text-[9px] text-[color:var(--earth)] uppercase tracking-[0.1em] mt-2 bg-[color:var(--earth)]/5 px-2 py-0.5 rounded-sm">
                        📍 {step.location}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Logistics Breakdown Table */}
            <div className="bg-[color:var(--cream)]/60 border border-[color:var(--border)] p-6 mt-8 grid sm:grid-cols-2 md:grid-cols-4 gap-6 font-mono text-[11px]">
              <div>
                <div className="text-[color:var(--muted-foreground)] uppercase tracking-[0.1em] mb-1">Carrier Agency</div>
                <div className="text-sm font-semibold text-[color:var(--ink)]">Hadoti Rural Logistics</div>
              </div>
              <div>
                <div className="text-[color:var(--muted-foreground)] uppercase tracking-[0.1em] mb-1">Tracking ID</div>
                <div className="text-sm font-semibold text-[color:var(--earth)]">HDT-{order._id.substring(0, 8).toUpperCase()}</div>
              </div>
              <div>
                <div className="text-[color:var(--muted-foreground)] uppercase tracking-[0.1em] mb-1">Estimated Arrival</div>
                <div className="text-sm font-semibold text-[color:var(--ink)]">
                  {order.status === "delivered" ? "Delivered" : "3-5 Business Days"}
                </div>
              </div>
              <div>
                <div className="text-[color:var(--muted-foreground)] uppercase tracking-[0.1em] mb-1">Active Coordinates</div>
                <div className="text-sm font-semibold text-[color:var(--ink)]">
                  {order.status === "placed" && "25.18° N, 75.83° E (Order Logged)"}
                  {order.status === "processing" && "24.58° N, 76.15° E (Milling Site)"}
                  {order.status === "shipped" && "In Transit (En Route)"}
                  {order.status === "delivered" && "Arrived (Pantry Restock Completed)"}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {/* Purchased Items List */}
        <div className="md:col-span-2 space-y-6">
          <div className="border border-[color:var(--border)] bg-[color:var(--cream)]/40 p-6">
            <h4 className="font-display text-2xl border-b border-[color:var(--border)] pb-4 mb-4">
              Items Purchased
            </h4>
            <div className="divide-y divide-[color:var(--border)]">
              {order.items.map((item: any) => (
                <div key={item.id} className="py-4 flex gap-4 items-center justify-between">
                  <div className="flex gap-4 items-center">
                    {/* Image Thumbnail */}
                    <div className="w-16 h-16 bg-[color:var(--cream)] border border-[color:var(--border)] flex items-center justify-center shrink-0 overflow-hidden rounded-sm">
                      {item.image ? (
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-[color:var(--earth)]/10 to-[color:var(--gold)]/10 flex items-center justify-center">
                          <Package className="w-6 h-6 text-[color:var(--earth)]/40" />
                        </div>
                      )}
                    </div>
                    <div>
                      <h5 className="font-display text-xl leading-tight">{item.name}</h5>
                      <div className="font-mono text-xs text-[color:var(--muted-foreground)] mt-1 flex flex-wrap items-center gap-2">
                        <span>Pouch: {item.weight}</span>
                        <span>•</span>
                        <span>Qty: {item.qty}</span>
                        {item.customization && (
                          <>
                            <span>•</span>
                            <span className="text-[color:var(--earth)]">Custom Blend</span>
                          </>
                        )}
                      </div>
                      {item.customization && (
                        <div className="font-mono text-[10px] text-[color:var(--muted-foreground)] bg-[color:var(--cream)] p-2 border border-[color:var(--border)] mt-2 rounded-sm max-w-lg leading-relaxed">
                          {item.customization}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="font-mono text-sm font-semibold">₹{item.price * item.qty}</span>
                    <p className="font-mono text-[10px] text-[color:var(--muted-foreground)] mt-1">₹{item.price} each</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Traceability & Heritage Card */}
          <div className="border border-[color:var(--border)] bg-emerald-50/5 p-6 rounded-sm">
            <h4 className="font-display text-2xl text-[color:var(--sage)] mb-3">
              Hadoti Traceability Report
            </h4>
            <p className="text-sm text-[color:var(--muted-foreground)] leading-relaxed mb-4">
              Your ingredients in this order have been audited and tracked from the original regur (black) soil of the Hadoti plateau in southeast Rajasthan.
            </p>
            <div className="grid sm:grid-cols-2 gap-4 font-mono text-xs border-t border-[color:var(--border)]/60 pt-4">
              <div>
                <span className="text-[color:var(--muted-foreground)] block mb-1">AGRICULTURE HUB</span>
                <span className="font-semibold text-[color:var(--ink)]">Kota & Bundi Soil Cooperatives</span>
              </div>
              <div>
                <span className="text-[color:var(--muted-foreground)] block mb-1">MILLING REVOLUTIONS</span>
                <span className="font-semibold text-[color:var(--ink)]">Slow Stone-Ground (&lt;30 RPM)</span>
              </div>
              <div>
                <span className="text-[color:var(--muted-foreground)] block mb-1">CHEMICAL AUDIT</span>
                <span className="font-semibold text-[color:var(--sage)]">100% Pesticide-Free Certified</span>
              </div>
              <div>
                <span className="text-[color:var(--muted-foreground)] block mb-1">PACKAGING SPECS</span>
                <span className="font-semibold text-[color:var(--ink)]">Zero-Waste Eco-Kraft Pouches</span>
              </div>
            </div>
          </div>
        </div>

        {/* Shipping & Payment Summaries */}
        <div className="space-y-6">
          <div className="border border-[color:var(--border)] bg-[color:var(--cream)]/40 p-6 font-mono text-xs leading-relaxed">
            <h4 className="font-display text-2xl text-[color:var(--ink)] mb-4 border-b border-[color:var(--border)] pb-2">
              Shipping Address
            </h4>
            <div className="space-y-3">
              <div>
                <span className="text-[color:var(--muted-foreground)] uppercase block text-[10px] tracking-wider mb-0.5">Recipient Name</span>
                <span className="text-sm font-semibold text-[color:var(--ink)]">{order.shippingAddress.name}</span>
              </div>
              <div>
                <span className="text-[color:var(--muted-foreground)] uppercase block text-[10px] tracking-wider mb-0.5">Phone Number</span>
                <span className="text-sm font-semibold text-[color:var(--ink)]">{order.shippingAddress.phone}</span>
              </div>
              <div>
                <span className="text-[color:var(--muted-foreground)] uppercase block text-[10px] tracking-wider mb-0.5">Delivery Location</span>
                <span className="text-sm font-semibold text-[color:var(--ink)] block leading-snug">
                  {order.shippingAddress.address}, {order.shippingAddress.city}, {order.shippingAddress.state} — {order.shippingAddress.pin}
                </span>
              </div>
            </div>
          </div>

          {/* Pricing Breakdown */}
          <div className="border border-[color:var(--border)] bg-[color:var(--cream)]/40 p-6 font-mono text-xs">
            <h4 className="font-display text-2xl text-[color:var(--ink)] mb-4 border-b border-[color:var(--border)] pb-2">
              Payment Breakdown
            </h4>
            <div className="space-y-3 border-b border-[color:var(--border)] pb-4 mb-4">
              <div className="flex justify-between">
                <span className="text-[color:var(--muted-foreground)]">Subtotal</span>
                <span>₹{order.subtotal}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[color:var(--muted-foreground)]">Eco-Shipping</span>
                <span>{order.deliveryFee === 0 ? "FREE" : `₹${order.deliveryFee}`}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[color:var(--muted-foreground)]">GST (Included)</span>
                <span>₹0.00</span>
              </div>
            </div>
            <div className="flex justify-between text-base font-semibold text-[color:var(--ink)] mb-6">
              <span className="font-display text-lg">Grand Total</span>
              <span className="font-display text-xl">₹{order.total}</span>
            </div>

            <div className="space-y-3 border-t border-[color:var(--border)] pt-4 mb-6">
              <div className="flex justify-between">
                <span className="text-[color:var(--muted-foreground)]">Method</span>
                <span className="uppercase">{order.paymentMethod}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[color:var(--muted-foreground)]">Transaction</span>
                <span className="capitalize">{order.paymentStatus}</span>
              </div>
            </div>

            <div className="space-y-3">
              <button
                onClick={handleDownloadInvoice}
                className="w-full flex items-center justify-center gap-2 border border-[color:var(--ink)] hover:bg-[color:var(--ink)] hover:text-white transition-all py-3 font-mono text-[10px] uppercase tracking-[0.2em] cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" /> Download Receipt
              </button>
              <Link
                to="/contact"
                className="w-full flex items-center justify-center gap-2 border border-[color:var(--border)] bg-transparent hover:border-[color:var(--ink)] transition-all py-3 font-mono text-[10px] uppercase tracking-[0.2em] text-center"
              >
                <HelpCircle className="w-3.5 h-3.5" /> Need Support?
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
