import { useState, useEffect } from "react";
import { Link } from "@tanstack/react-router";
import { blogPosts as backupBlogPosts, imageForBlog } from "@/lib/data";
import { getBlogs } from "@/lib/api-client";

export function BlogPreview() {
  const [data, setData] = useState(backupBlogPosts);

  useEffect(() => {
    getBlogs().then((res) => {
      if (res && res.length > 0) {
        setData(res);
      }
    });
  }, []);

  const posts = data.slice(0, 2);
  return (
    <section className="py-28">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
        <div className="mb-12 flex items-end justify-between">
          <h2 className="font-display text-5xl md:text-6xl leading-[1.05]">
            From the <span className="italic text-[color:var(--earth)]">journal.</span>
          </h2>
          <Link to="/blog" className="story-link font-mono text-xs uppercase tracking-[0.2em]">
            All posts →
          </Link>
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          {posts.map((p, i) => (
            <Link
              key={p.slug}
              to="/blog/$slug"
              params={{ slug: p.slug }}
              className="group block"
            >
              <div className="zoom-frame relative h-[360px]">
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                  style={{
                    backgroundImage: `url(${p.image || imageForBlog(p.slug)})`,
                  }}
                />
                <div className="absolute inset-0 bg-black/15 group-hover:bg-black/5 transition-colors duration-500" />
              </div>
              <div className="mt-5 flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.22em] text-[color:var(--muted-foreground)]">
                <span className="text-[color:var(--earth)]">{p.type}</span>
                <span>·</span>
                <span>{p.date}</span>
              </div>
              <h3 className="font-display text-3xl mt-3 leading-tight">{p.title}</h3>
              <p className="mt-3 text-[color:var(--muted-foreground)] max-w-md">{p.excerpt}</p>
              <span className="story-link mt-4 inline-block font-mono text-xs uppercase tracking-[0.2em]">Read →</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
