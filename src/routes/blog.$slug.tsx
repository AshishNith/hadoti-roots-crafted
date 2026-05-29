import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { blogPosts, imageForBlog } from "@/lib/data";

export const Route = createFileRoute("/blog/$slug")({
  head: ({ params }) => {
    const p = blogPosts.find((x) => x.slug === params.slug);
    return { meta: [{ title: p ? `${p.title} — Hadoti Farms` : "Journal" }] };
  },
  loader: ({ params }) => {
    const p = blogPosts.find((x) => x.slug === params.slug);
    if (!p) throw notFound();
    return { post: p };
  },
  component: PostPage,
});

function PostPage() {
  const { post } = Route.useLoaderData();
  return (
    <article className="pt-32 pb-32">
      <div className="max-w-[820px] mx-auto px-6">
        <Link to="/blog" className="story-link font-mono text-[11px] uppercase tracking-[0.22em] text-[color:var(--earth)]">← Journal</Link>
        <div className="mt-6 font-mono text-[11px] uppercase tracking-[0.22em] text-[color:var(--muted-foreground)]">{post.type} · {post.date}</div>
        <h1 className="font-display text-5xl md:text-7xl mt-4 leading-[1.05] italic">{post.title}</h1>
        <div className="mt-12 zoom-frame relative h-[420px]">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${imageForBlog(post.slug)})` }}
          />
          <div className="absolute inset-0 bg-black/10" />
        </div>
        <div className="mt-12 font-display text-2xl leading-relaxed text-[color:var(--ink)]/85 space-y-6">
          <p className="text-3xl italic">{post.excerpt}</p>
          <p>The fields of Hadoti hold a particular silence at dawn. Black cotton soil, low monsoon, slow seasons — these are the conditions that shape every grain we ship.</p>
          <p>This is a placeholder body for the journal entry. Real long-form writing — interviews with farmers, recipe walkthroughs, seasonal guides — lives here in production.</p>
          <p className="font-body text-base text-[color:var(--muted-foreground)]">— Hadoti Farms Editorial</p>
        </div>
      </div>
    </article>
  );
}
