import React, { useState, useEffect, useRef } from "react";
import { getLatestVideos } from "@/lib/api-client";
import { type YouTubeVideo } from "@/lib/data";
import { Play, X, Calendar } from "lucide-react";
import { format } from "date-fns";

export function FieldDiaries() {
  const [videos, setVideos] = useState<YouTubeVideo[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeVideoId, setActiveVideoId] = useState<string | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    getLatestVideos()
      .then((data) => {
        if (data && data.length > 0) {
          setVideos(data);
        }
      })
      .catch((err) => {
        console.error("Error loading YouTube playlist:", err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  // Listen for Escape key to close modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setActiveVideoId(null);
      }
    };
    if (activeVideoId) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [activeVideoId]);

  const formatDate = (dateStr: string) => {
    try {
      return format(new Date(dateStr), "MMM dd, yyyy");
    } catch {
      return dateStr;
    }
  };

  const handleScroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const scrollAmount = 400;
      scrollContainerRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <section className="py-24 bg-[color:var(--secondary)]/10 border-y border-[color:var(--border)]/40 overflow-hidden">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
        
        {/* Section Header */}
        <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="max-w-2xl">
            <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-[color:var(--earth)] font-semibold block mb-3">
              HADOTI FIELD DIARIES
            </span>
            <h2 className="font-display text-4xl md:text-5xl lg:text-6xl leading-[1.1] tracking-tight">
              Watch Our <span className="italic font-display text-[color:var(--earth)]">Stories & Recipes</span>
            </h2>
            <p className="mt-4 text-[color:var(--muted-foreground)] text-sm md:text-base">
              Journey to the fields of Bundi and Jhalawar. Watch how our heritage grains are harvested, cleaned, and crafted into traditional recipes.
            </p>
          </div>
          
          {/* Custom Carousel Controls */}
          {videos.length > 0 && (
            <div className="flex items-center gap-3">
              <button
                onClick={() => handleScroll("left")}
                className="w-11 h-11 rounded-full border border-[color:var(--border)] flex items-center justify-center hover:bg-[color:var(--foreground)] hover:text-[color:var(--background)] transition-all duration-300 cursor-pointer"
                aria-label="Previous videos"
              >
                ←
              </button>
              <button
                onClick={() => handleScroll("right")}
                className="w-11 h-11 rounded-full border border-[color:var(--border)] flex items-center justify-center hover:bg-[color:var(--foreground)] hover:text-[color:var(--background)] transition-all duration-300 cursor-pointer"
                aria-label="Next videos"
              >
                →
              </button>
            </div>
          )}
        </div>

        {/* Videos Container */}
        {loading ? (
          /* Skeletons */
          <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide">
            {[1, 2, 3].map((n) => (
              <div key={n} className="flex-none w-[320px] md:w-[400px] animate-pulse">
                <div className="aspect-video bg-[color:var(--muted)]/20 rounded-md mb-4" />
                <div className="h-4 bg-[color:var(--muted)]/20 w-1/3 mb-2 rounded" />
                <div className="h-6 bg-[color:var(--muted)]/20 w-3/4 rounded" />
              </div>
            ))}
          </div>
        ) : videos.length === 0 ? (
          <div className="py-12 text-center border border-dashed border-[color:var(--border)] rounded-lg">
            <p className="text-[color:var(--muted-foreground)]">
              Follow our channel for seasonal recipes and stories.
            </p>
            <a
              href="https://www.youtube.com/@anaajrajasthan01"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-block font-mono text-xs uppercase tracking-[0.2em] text-[color:var(--earth)] hover:underline"
            >
              Visit Channel on YouTube →
            </a>
          </div>
        ) : (
          /* Scrollable Video Gallery */
          <div
            ref={scrollContainerRef}
            className="flex gap-6 overflow-x-auto pb-6 scrollbar-hide snap-x snap-mandatory"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {videos.map((video) => (
              <div
                key={video.id}
                className="flex-none w-[300px] md:w-[400px] snap-start group cursor-pointer"
                onClick={() => setActiveVideoId(video.id)}
              >
                {/* Thumbnail Frame */}
                <div className="relative aspect-video w-full overflow-hidden rounded bg-[color:var(--muted)]/10 border border-[color:var(--border)]/30">
                  <img
                    src={video.thumbnail}
                    alt={video.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    loading="lazy"
                  />
                  
                  {/* Premium Overlay Play Button */}
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/45 transition-colors duration-500 flex items-center justify-center">
                    <div className="w-14 h-14 rounded-full bg-white/95 text-[color:var(--foreground)] flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-all duration-300 ease-out">
                      <Play className="w-5 h-5 fill-current ml-0.5" />
                    </div>
                  </div>
                </div>

                {/* Video Info */}
                <div className="mt-4">
                  <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-[color:var(--muted-foreground)]">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{formatDate(video.published)}</span>
                  </div>
                  
                  <h3 className="font-display text-lg md:text-xl mt-2 leading-snug group-hover:text-[color:var(--earth)] transition-colors duration-300 line-clamp-2">
                    {video.title}
                  </h3>
                  
                  {video.description && (
                    <p className="mt-2 text-[color:var(--muted-foreground)] text-xs line-clamp-2 leading-relaxed">
                      {video.description}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox Modal Overlay */}
      {activeVideoId && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4 animate-fade-in"
          onClick={() => setActiveVideoId(null)}
        >
          {/* Close Button */}
          <button
            onClick={() => setActiveVideoId(null)}
            className="absolute top-6 right-6 text-white/80 hover:text-white transition-colors p-3 bg-white/10 hover:bg-white/20 rounded-full z-50 focus:outline-none cursor-pointer"
            aria-label="Close video player"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Video Player Modal Content */}
          <div
            className="relative w-full max-w-[1000px] aspect-video bg-black rounded overflow-hidden shadow-2xl scale-in"
            onClick={(e) => e.stopPropagation()}
          >
            <iframe
              src={`https://www.youtube.com/embed/${activeVideoId}?autoplay=1&modestbranding=1&rel=0`}
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              className="absolute inset-0 w-full h-full border-0"
            />
          </div>
        </div>
      )}
    </section>
  );
}
