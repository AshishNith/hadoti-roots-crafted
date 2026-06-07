import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { useCart } from "@/lib/store";
import { formatINR } from "@/lib/data";
import { Button } from "@/components/ui/HFButton";
import { toast } from "sonner";
import { useAuth } from "@/lib/auth-store";
import { placeOrder, saveBlend, getUserAddresses } from "@/lib/api-client";

export const Route = createFileRoute("/checkout")({
  head: () => ({ meta: [{ title: "Checkout — Hadoti Farms" }] }),
  component: CheckoutPage,
});

const steps = ["Delivery", "Payment", "Confirm"];

function CheckoutPage() {
  const items = useCart((s) => s.items);
  const subtotal = useCart((s) => s.subtotal());
  const clear = useCart((s) => s.clear);
  const [step, setStep] = useState(0);
  const [pay, setPay] = useState<"upi" | "card" | "cod">("upi");

  // Auth integrations
  const { user, loading, signUp, signIn, signInWithGoogle } = useAuth();
  const [authMode, setAuthMode] = useState<"signin" | "signup">("signin");
  const [authEmail, setAuthEmail] = useState("");
  const [authPassword, setAuthPassword] = useState("");
  const [authName, setAuthName] = useState("");
  const [authError, setAuthError] = useState<string | null>(null);
  const [authLoading, setAuthLoading] = useState(false);

  // Shipping details state
  const [shippingName, setShippingName] = useState("");
  const [shippingPhone, setShippingPhone] = useState("");
  const [shippingAddress, setShippingAddress] = useState("");
  const [shippingCity, setShippingCity] = useState("");
  const [shippingState, setShippingState] = useState("");
  const [shippingPin, setShippingPin] = useState("");

  const [savedAddresses, setSavedAddresses] = useState<any[]>([]);

  useEffect(() => {
    if (user) {
      if (!shippingName) {
        setShippingName(user.displayName || "");
      }
      getUserAddresses(user.uid)
        .then(setSavedAddresses)
        .catch((err) => console.error("Error loading checkout saved addresses:", err));
    } else {
      setSavedAddresses([]);
    }
  }, [user]);

  const total = subtotal + (subtotal > 999 ? 0 : 60);

  const place = async () => {
    try {
      const orderItems = items.map((i) => ({
        id: i.id,
        name: i.name,
        price: i.price,
        weight: i.weight,
        qty: i.qty,
        customization: i.customization || null,
        image: i.image || null,
      }));

      await placeOrder({
        userUid: user!.uid,
        items: orderItems,
        shippingAddress: {
          name: shippingName,
          phone: shippingPhone,
          address: shippingAddress,
          city: shippingCity,
          state: shippingState,
          pin: shippingPin,
        },
        subtotal,
        deliveryFee: subtotal > 999 ? 0 : 60,
        total,
        paymentMethod: pay,
      });

      // Save custom blends
      for (const i of items) {
        if (i.customization) {
          const blendType = i.id.includes("dal")
            ? "dal"
            : i.id.includes("masala")
            ? "masala"
            : i.id.includes("ration")
            ? "ration"
            : "grain";
          await saveBlend({
            userUid: user!.uid,
            name: i.name,
            blendType,
            customizationSummary: i.customization,
            weight: i.weight,
            price: i.price,
          }).catch((err) => console.error("Error saving blend:", err));
        }
      }

      clear();
      setStep(2);
      toast.success("Order placed. Your harvest is on its way.");
    } catch (err: any) {
      toast.error("Failed to place order: " + (err.message || "Unknown error"));
    }
  };

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!authEmail || !authPassword) {
      toast.error("Please fill in all credentials");
      return;
    }
    setAuthLoading(true);
    setAuthError(null);
    try {
      if (authMode === "signup") {
        if (!authName) {
          toast.error("Please enter your name");
          setAuthLoading(false);
          return;
        }
        await signUp(authEmail, authPassword, authName);
        toast.success(`Welcome to Hadoti Farms, ${authName}!`);
      } else {
        await signIn(authEmail, authPassword);
        toast.success("Welcome back!");
      }
    } catch (err: any) {
      setAuthError(err.message || "Authentication failed");
    } finally {
      setAuthLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setAuthLoading(true);
    setAuthError(null);
    try {
      await signInWithGoogle();
      toast.success("Signed in successfully!");
    } catch (err: any) {
      setAuthError(err.message || "Google authentication failed");
    } finally {
      setAuthLoading(false);
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

  if (!user) {
    return (
      <section className="pt-32 pb-32">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
          <h1 className="font-display text-5xl md:text-6xl mb-4">Checkout.</h1>
          
          <div className="mt-12 grid lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2">
              <div className="border border-[color:var(--border)] bg-[color:var(--cream)] p-8 md:p-10 shadow-sm relative overflow-hidden max-w-xl">
                {/* Header */}
                <div className="text-center mb-8">
                  <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-[color:var(--earth)] mb-3">
                    Authentication Required
                  </div>
                  <h2 className="font-display text-4xl leading-tight">
                    {authMode === "signin" ? (
                      <>Welcome, <span className="italic text-[color:var(--earth)]">friend.</span></>
                    ) : (
                      <>Join the <span className="italic text-[color:var(--earth)]">harvest.</span></>
                    )}
                  </h2>
                  <p className="text-xs text-[color:var(--muted-foreground)] mt-2">
                    {authMode === "signin" 
                      ? "Sign in to complete your purchase and save custom blends." 
                      : "Create an account to track orders and save sun-dried mix specifications."}
                  </p>
                </div>

                {/* Social login */}
                <button
                  type="button"
                  onClick={handleGoogleSignIn}
                  disabled={authLoading}
                  className="w-full border border-[color:var(--ink)] hover:bg-[color:var(--ink)] hover:text-white transition-all py-3 rounded-sm flex items-center justify-center gap-3 font-mono text-[10px] uppercase tracking-[0.2em] mb-6 cursor-pointer disabled:opacity-50"
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
                <form onSubmit={handleAuthSubmit} className="space-y-5">
                  {authMode === "signup" && (
                    <div>
                      <input
                        type="text"
                        placeholder="Your Name"
                        value={authName}
                        onChange={(e) => setAuthName(e.target.value)}
                        className="w-full bg-transparent border-b border-[color:var(--border)] py-3 font-mono text-xs uppercase tracking-[0.1em] outline-none focus:border-[color:var(--earth)] transition-colors"
                        required
                        disabled={authLoading}
                      />
                    </div>
                  )}
                  <div>
                    <input
                      type="email"
                      placeholder="Email Address"
                      value={authEmail}
                      onChange={(e) => setAuthEmail(e.target.value)}
                      className="w-full bg-transparent border-b border-[color:var(--border)] py-3 font-mono text-xs uppercase tracking-[0.1em] outline-none focus:border-[color:var(--earth)] transition-colors"
                      required
                      disabled={authLoading}
                    />
                  </div>
                  <div>
                    <input
                      type="password"
                      placeholder="Password"
                      value={authPassword}
                      onChange={(e) => setAuthPassword(e.target.value)}
                      className="w-full bg-transparent border-b border-[color:var(--border)] py-3 font-mono text-xs uppercase tracking-[0.1em] outline-none focus:border-[color:var(--earth)] transition-colors"
                      required
                      disabled={authLoading}
                    />
                  </div>

                  {authError && (
                    <div className="font-mono text-[10px] text-red-600 bg-red-50 border border-red-100 p-3 leading-relaxed">
                      {authError}
                    </div>
                  )}

                  <Button type="submit" disabled={authLoading} className="w-full mt-6 py-3.5 cursor-pointer">
                    {authLoading 
                      ? "Processing..." 
                      : authMode === "signin" ? "Sign In & Checkout →" : "Create Account & Checkout →"}
                  </Button>
                </form>

                {/* Footer toggle */}
                <div className="mt-8 text-center border-t border-[color:var(--border)] pt-6">
                  <button
                    type="button"
                    onClick={() => {
                      setAuthMode(authMode === "signin" ? "signup" : "signin");
                      setAuthName("");
                      setAuthEmail("");
                      setAuthPassword("");
                      setAuthError(null);
                    }}
                    className="font-mono text-[10px] uppercase tracking-[0.2em] text-[color:var(--earth)] hover:underline cursor-pointer"
                  >
                    {authMode === "signin" 
                      ? "Don't have an account? Sign Up" 
                      : "Already have an account? Sign In"}
                  </button>
                </div>
              </div>
            </div>

            {/* Cart summary column */}
            <aside className="lg:sticky lg:top-32 lg:self-start border border-[color:var(--border)] bg-[color:var(--cream)] p-8">
              <div className="font-mono text-[11px] uppercase tracking-[0.22em] text-[color:var(--earth)] mb-6">Your order</div>
              <div className="space-y-3 max-h-72 overflow-auto pr-2">
                {items.map((i) => (
                  <div key={i.id} className="flex justify-between text-sm">
                    <span>{i.name} <span className="font-mono text-xs text-[color:var(--muted-foreground)]">×{i.qty}</span></span>
                    <span className="font-mono">{formatINR(i.price * i.qty)}</span>
                  </div>
                ))}
                {items.length === 0 && <p className="font-mono text-xs text-[color:var(--muted-foreground)]">Cart is empty.</p>}
              </div>
              <div className="mt-6 border-t border-[color:var(--border)] pt-4 space-y-2 font-mono text-sm">
                <Row label="Subtotal" value={formatINR(subtotal)} />
                <Row label="Delivery" value={subtotal > 999 ? "Free" : formatINR(60)} />
              </div>
              <div className="mt-4 border-t border-[color:var(--border)] pt-4 flex justify-between">
                <span className="font-mono text-[11px] uppercase tracking-[0.22em]">Total</span>
                <span className="font-display text-3xl">{formatINR(total)}</span>
              </div>
            </aside>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="pt-32 pb-32">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
        <h1 className="font-display text-5xl md:text-6xl">Checkout.</h1>

        <div className="mt-8 flex items-center gap-6 max-w-md">
          {steps.map((label, i) => (
            <div key={label} className="flex items-center gap-3">
              <div className={`w-7 h-7 rounded-full border flex items-center justify-center font-mono text-xs ${step >= i ? "bg-[color:var(--earth)] border-[color:var(--earth)] text-white" : "border-[color:var(--border)]"}`}>{i + 1}</div>
              <span className={`font-mono text-[11px] uppercase tracking-[0.18em] ${step === i ? "text-[color:var(--ink)]" : "text-[color:var(--muted-foreground)]"}`}>{label}</span>
            </div>
          ))}
        </div>

        <div className="mt-16 grid lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-10">
            {step === 0 && (
              <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); setStep(1); }}>
                <h2 className="font-display text-3xl">Delivery details</h2>
                {savedAddresses.length > 0 && (
                  <div className="border border-[color:var(--border)] bg-[color:var(--cream)]/40 p-5 rounded-sm space-y-3">
                    <span className="font-mono text-[9px] uppercase tracking-[0.18em] text-[color:var(--earth)] font-semibold block">
                      Use a Saved Address
                    </span>
                    <div className="grid sm:grid-cols-2 gap-4">
                      {savedAddresses.map((a) => (
                        <div
                          key={a._id}
                          onClick={() => {
                            setShippingName(a.name);
                            setShippingPhone(a.phone);
                            setShippingAddress(a.address);
                            setShippingCity(a.city);
                            setShippingState(a.state);
                            setShippingPin(a.pin);
                            toast.success(`Autofilled: ${a.name}'s address`);
                          }}
                          className="border border-[color:var(--border)] bg-[color:var(--bg)] p-4 rounded-sm hover:border-[color:var(--earth)] cursor-pointer transition-all text-left space-y-1"
                        >
                          <div className="font-display text-lg leading-tight font-medium text-[color:var(--ink)]">{a.name}</div>
                          <div className="font-mono text-[10px] text-[color:var(--muted-foreground)]">{a.phone}</div>
                          <div className="font-mono text-[10px] text-[color:var(--ink)] leading-snug line-clamp-2">
                            {a.address}, {a.city}, {a.state} - {a.pin}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                <div className="grid sm:grid-cols-2 gap-4">
                  <Field label="Full name" value={shippingName} onChange={setShippingName} />
                  <Field label="Phone" type="tel" value={shippingPhone} onChange={setShippingPhone} />
                </div>
                <Field label="Email" type="email" value={user.email || ""} onChange={() => {}} />
                <Field label="Address" value={shippingAddress} onChange={setShippingAddress} />
                <div className="grid sm:grid-cols-3 gap-4">
                  <Field label="City" value={shippingCity} onChange={setShippingCity} />
                  <Field label="State" value={shippingState} onChange={setShippingState} />
                  <Field label="PIN" value={shippingPin} onChange={setShippingPin} />
                </div>
                <Button>Continue to Payment →</Button>
              </form>
            )}
            {step === 1 && (
              <div className="space-y-8">
                <h2 className="font-display text-3xl">Payment</h2>
                <div className="space-y-3">
                  {[
                    ["upi", "UPI", "Pay via any UPI app."],
                    ["card", "Card", "Credit · Debit · International."],
                    ["cod", "Cash on Delivery", "Pay when it arrives."],
                  ].map(([id, l, d]) => (
                    <button key={id} onClick={() => setPay(id as typeof pay)} className={`w-full text-left p-5 border ${pay === id ? "border-[color:var(--earth)] bg-[color:var(--cream)]" : "border-[color:var(--border)]"}`}>
                      <div className="font-display text-2xl">{l}</div>
                      <div className="text-sm text-[color:var(--muted-foreground)] mt-1">{d}</div>
                    </button>
                  ))}
                </div>
                <div className="font-mono text-[11px] uppercase tracking-[0.2em] text-[color:var(--muted-foreground)]">
                  Razorpay secured · no card details stored
                </div>
                <div className="flex items-center justify-between">
                  <button onClick={() => setStep(0)} className="story-link font-mono text-xs uppercase tracking-[0.2em]">← Back</button>
                  <Button onClick={place} disabled={items.length === 0}>Place Order · {formatINR(total)}</Button>
                </div>
              </div>
            )}
            {step === 2 && (
              <div className="py-12">
                <h2 className="font-display italic text-5xl text-[color:var(--earth)]">Thank you.</h2>
                <p className="mt-4 font-display text-2xl text-[color:var(--muted-foreground)] max-w-md">
                  Your order is on its way from Kota. We'll send updates by SMS and email.
                </p>
              </div>
            )}
          </div>

          <aside className="lg:sticky lg:top-32 lg:self-start border border-[color:var(--border)] bg-[color:var(--cream)] p-8">
            <div className="font-mono text-[11px] uppercase tracking-[0.22em] text-[color:var(--earth)] mb-6">Your order</div>
            <div className="space-y-3 max-h-72 overflow-auto pr-2">
              {items.map((i) => (
                <div key={i.id} className="flex justify-between text-sm">
                  <span>{i.name} <span className="font-mono text-xs text-[color:var(--muted-foreground)]">×{i.qty}</span></span>
                  <span className="font-mono">{formatINR(i.price * i.qty)}</span>
                </div>
              ))}
              {items.length === 0 && <p className="font-mono text-xs text-[color:var(--muted-foreground)]">Cart is empty.</p>}
            </div>
            <div className="mt-6 border-t border-[color:var(--border)] pt-4 space-y-2 font-mono text-sm">
              <Row label="Subtotal" value={formatINR(subtotal)} />
              <Row label="Delivery" value={subtotal > 999 ? "Free" : formatINR(60)} />
            </div>
            <div className="mt-4 border-t border-[color:var(--border)] pt-4 flex justify-between">
              <span className="font-mono text-[11px] uppercase tracking-[0.22em]">Total</span>
              <span className="font-display text-3xl">{formatINR(total)}</span>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  required = true,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  required?: boolean;
}) {
  return (
    <label className="block">
      <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-[color:var(--muted-foreground)]">{label}</span>
      <input
        type={type}
        required={required}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 w-full bg-transparent border-b border-[color:var(--ink)] py-2 outline-none focus:border-[color:var(--earth)] transition-colors"
      />
    </label>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return <div className="flex justify-between"><span className="text-[color:var(--muted-foreground)]">{label}</span><span>{value}</span></div>;
}

