import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useCart } from "@/lib/store";
import { formatINR } from "@/lib/data";
import { Button } from "@/components/ui/HFButton";
import { toast } from "sonner";

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

  const total = subtotal + (subtotal > 999 ? 0 : 60);

  const place = () => {
    clear();
    setStep(2);
    toast.success("Order placed. Your harvest is on its way.");
  };

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
                <div className="grid sm:grid-cols-2 gap-4">
                  <Field label="Full name" />
                  <Field label="Phone" type="tel" />
                </div>
                <Field label="Email" type="email" />
                <Field label="Address" />
                <div className="grid sm:grid-cols-3 gap-4">
                  <Field label="City" />
                  <Field label="State" />
                  <Field label="PIN" />
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

function Field({ label, type = "text" }: { label: string; type?: string }) {
  return (
    <label className="block">
      <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-[color:var(--muted-foreground)]">{label}</span>
      <input type={type} required className="mt-1 w-full bg-transparent border-b border-[color:var(--ink)] py-2 outline-none focus:border-[color:var(--earth)] transition-colors" />
    </label>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return <div className="flex justify-between"><span className="text-[color:var(--muted-foreground)]">{label}</span><span>{value}</span></div>;
}
