import { createFileRoute } from "@tanstack/react-router";
import { Hero } from "@/components/home/Hero";
import { TrustBar } from "@/components/home/TrustBar";
import { FeaturedCategories } from "@/components/home/FeaturedCategories";
import { CustomizerTeaser } from "@/components/home/CustomizerTeaser";
import { StatsSection } from "@/components/home/StatsSection";
import { BestsellerScroll } from "@/components/home/BestsellerScroll";
import { FarmStory } from "@/components/home/FarmStory";
import { Testimonials } from "@/components/home/Testimonials";
import { BlogPreview } from "@/components/home/BlogPreview";
import { Newsletter } from "@/components/home/Newsletter";
import { Ticker } from "@/components/layout/Ticker";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Hadoti Farms — Grown in Hadoti" },
      { name: "description", content: "Pesticide-free dals, masalas and custom ration boxes from 400+ farmers in Kota, Bundi and Jhalawar." },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <>
      <Hero />
      <TrustBar />
      <FeaturedCategories />
      <CustomizerTeaser />
      <StatsSection />
      <BestsellerScroll />
      <FarmStory />
      <Testimonials />
      <BlogPreview />
      <Newsletter />
      <div className="bg-[color:var(--cream)] border-t border-[color:var(--border)] overflow-hidden py-1">
        <Ticker
          items={[
            "100% Traceable Staples",
            "Sourced Direct From Growers",
            "Traditional Sun-Dried Batches",
            "No Preservatives Added",
            "Stone-Ground Flour Blends",
            "Empowering Rajasthani Agriculture",
          ]}
          className="border-none py-4"
          textClassName="text-[color:var(--earth)] font-mono text-[11px] font-semibold tracking-[0.25em]"
          dotClassName="text-[color:var(--earth)] opacity-50"
        />
      </div>
    </>
  );
}

