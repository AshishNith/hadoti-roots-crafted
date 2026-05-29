import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { imageForBlog } from "@/lib/data";
import { getBlogBySlug } from "@/lib/api-client";

export const Route = createFileRoute("/blog/$slug")({
  head: ({ loaderData }) => {
    const p = (loaderData as any)?.post;
    return { meta: [{ title: p ? `${p.title} — Hadoti Farms` : "Journal" }] };
  },
  loader: async ({ params }) => {
    try {
      const p = await getBlogBySlug(params.slug);
      if (!p) throw notFound();
      return { post: p };
    } catch (e) {
      throw notFound();
    }
  },
  component: PostPage,
});

function PostPage() {
  const { post } = Route.useLoaderData() as any;
  return (
    <article className="pt-32 pb-32">
      <div className="max-w-[820px] mx-auto px-6">
        <Link to="/blog" className="story-link font-mono text-[11px] uppercase tracking-[0.22em] text-[color:var(--earth)]">← Journal</Link>
        <div className="mt-6 font-mono text-[11px] uppercase tracking-[0.22em] text-[color:var(--muted-foreground)]">{post.type} · {post.date}</div>
        <h1 className="font-display text-5xl md:text-7xl mt-4 leading-[1.05] italic">{post.title}</h1>
        <div className="mt-12 zoom-frame relative h-[420px]">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${post.image || imageForBlog(post.slug)})` }}
          />
          <div className="absolute inset-0 bg-black/10" />
        </div>
        <div className="mt-12 font-display text-2xl leading-relaxed text-[color:var(--ink)]/85 space-y-6">
          <p className="text-3xl italic">{post.excerpt}</p>
          {post.content ? (
            <p className="font-body text-lg leading-relaxed text-[color:var(--ink)]/80">{post.content}</p>
          ) : (
            <>
              <p>The fields of Hadoti hold a particular silence at dawn. Black cotton soil, low monsoon, slow seasons — these are the conditions that shape every grain we ship.</p>
              <p>This is a placeholder body for the journal entry. Real long-form writing — interviews with farmers, recipe walkthroughs, seasonal guides — lives here in production.</p>
            </>
          )}
          <p className="font-body text-base text-[color:var(--muted-foreground)] mt-10 border-t border-[color:var(--border)] pt-6">— Hadoti Farms Editorial</p>
        </div>
      </div>
    </article>
  );
}
