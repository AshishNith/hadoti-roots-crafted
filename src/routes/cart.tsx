import { createFileRoute, Link } from "@tanstack/react-router";
import { useCart } from "@/lib/store";
import { formatINR } from "@/lib/data";
import { Button } from "@/components/ui/HFButton";
import { QuantityControl } from "@/components/ui/QuantityControl";
import { X } from "lucide-react";

export const Route = createFileRoute("/cart")({
  head: () => ({ meta: [{ title: "Cart — Hadoti Farms" }] }),
  component: CartPage,
});

function CartPage() {
  const items = useCart((s) => s.items);
  const setQty = useCart((s) => s.setQty);
  const remove = useCart((s) => s.remove);
  const subtotal = useCart((s) => s.subtotal());

  return (
    <section className="pt-32 pb-32">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
        <div className="font-mono text-[11px] uppercase tracking-[0.22em] text-[color:var(--earth)] mb-4">Cart</div>
        <h1 className="font-display text-5xl md:text-7xl leading-[1]">Your <span className="italic">basket.</span></h1>

        {items.length === 0 ? (
          <div className="mt-20 max-w-md">
            <p className="font-display italic text-3xl text-[color:var(--muted-foreground)]">
              Empty for now. The pantry is waiting.
            </p>
            <Link to="/shop" className="mt-8 inline-block"><Button>Browse the pantry</Button></Link>
          </div>
        ) : (
          <div className="mt-16 grid lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2 space-y-6">
              {items.map((i) => (
                <div key={i.id} className="flex gap-6 border-b border-[color:var(--border)] pb-6">
                  <div className="w-28 h-28 shrink-0" style={{ background: "linear-gradient(160deg,#8b5e3c,#2c1d12)" }} />
                  <div className="flex-1">
                    <div className="flex justify-between gap-4">
                      <div>
                        <h3 className="font-display text-2xl">{i.name}</h3>
                        <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-[color:var(--muted-foreground)] mt-1">{i.weight}</div>
                        {i.customization && (
                          <p className="font-mono text-xs text-[color:var(--muted-foreground)] mt-2">{i.customization}</p>
                        )}
                      </div>
                      <button onClick={() => remove(i.id)} aria-label="Remove" className="text-[color:var(--muted-foreground)] hover:text-[color:var(--ink)] transition-colors h-fit">
                        <X size={18} />
                      </button>
                    </div>
                    <div className="mt-4 flex items-center justify-between">
                      <QuantityControl value={i.qty} onChange={(q) => setQty(i.id, q)} />
                      <span className="font-mono">{formatINR(i.price * i.qty)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <aside className="lg:sticky lg:top-32 lg:self-start border border-[color:var(--border)] bg-[color:var(--cream)] p-8">
              <div className="font-mono text-[11px] uppercase tracking-[0.22em] text-[color:var(--earth)] mb-6">Order summary</div>
              <div className="space-y-3 font-mono text-sm">
                <Row label="Subtotal" value={formatINR(subtotal)} />
                <Row label="Delivery" value={subtotal > 999 ? "Free" : formatINR(60)} />
              </div>
              <div className="mt-6 border-t border-[color:var(--border)] pt-4 flex items-center justify-between">
                <span className="font-mono text-[11px] uppercase tracking-[0.22em]">Total</span>
                <span className="font-display text-3xl">{formatINR(subtotal + (subtotal > 999 ? 0 : 60))}</span>
              </div>
              <Link to="/checkout" className="block mt-6"><Button className="w-full">Proceed to Checkout</Button></Link>
              <Link to="/shop" className="block mt-4 text-center story-link font-mono text-xs uppercase tracking-[0.2em]">Continue shopping</Link>
            </aside>
          </div>
        )}
      </div>
    </section>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return <div className="flex justify-between"><span className="text-[color:var(--muted-foreground)]">{label}</span><span>{value}</span></div>;
}
