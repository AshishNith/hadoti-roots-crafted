import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/account")({
  head: () => ({ meta: [{ title: "Account — Hadoti Farms" }] }),
  component: AccountPage,
});

function AccountPage() {
  return (
    <section className="pt-40 pb-32">
      <div className="max-w-[1100px] mx-auto px-6 lg:px-10">
        <div className="font-mono text-[11px] uppercase tracking-[0.22em] text-[color:var(--earth)] mb-4">Account</div>
        <h1 className="font-display text-6xl md:text-8xl leading-[1]">Welcome, <span className="italic">friend.</span></h1>

        <div className="mt-20 grid md:grid-cols-3 gap-6">
          {[
            ["Orders", "Track recent orders and reorder favourites.", "/cart"],
            ["Saved Blends", "Your custom dal mixes, masalas, and boxes.", "/customize"],
            ["Subscriptions", "Your monthly ration boxes.", "/customize/ration-box"],
          ].map(([t, d, to]) => (
            <Link key={t} to={to} className="block border border-[color:var(--border)] bg-[color:var(--cream)] p-8 hover:border-[color:var(--ink)] transition-colors">
              <h2 className="font-display text-3xl">{t}</h2>
              <p className="mt-3 text-[color:var(--muted-foreground)]">{d}</p>
              <span className="mt-6 inline-block story-link font-mono text-xs uppercase tracking-[0.2em] text-[color:var(--earth)]">Open →</span>
            </Link>
          ))}
        </div>

        <div className="mt-20 border-t border-[color:var(--border)] pt-10 font-mono text-[11px] uppercase tracking-[0.22em] text-[color:var(--muted-foreground)]">
          Not signed in yet · this is a preview account view
        </div>
      </div>
    </section>
  );
}
