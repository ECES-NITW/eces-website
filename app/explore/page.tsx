import type { Metadata } from "next";
import { Suspense } from "react";
import { ArticleGrid } from "./article-grid";
import { TagNav } from "./tag-nav";
import { getArticles } from "./articles";
import { resolveTag } from "./tags";

export const metadata: Metadata = {
  title: "Explore | ECE Society NIT Warangal",
  description: "Latest developments and explainers in electronics and communication.",
};

type Props = { searchParams: Promise<{ tag?: string }> }; // Next 15+

async function Articles({ slug }: { slug: string }) {
  const articles = await getArticles(resolveTag(slug));

  if (articles.length === 0) {
    return (
      <p className="py-20 text-center text-white/60">
        Nothing here right now. Try another tag or check back later.
      </p>
    );
  }

  return <ArticleGrid articles={articles} />;
}

function GridSkeleton() {
  return (
    <div className="grid grid-cols-[repeat(auto-fill,minmax(260px,1fr))] justify-items-center gap-7">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="h-[340px] w-[260px] animate-pulse bg-[#071429]" style={{ border: "1px solid rgba(132,194,248,.12)" }} />
      ))}
    </div>
  );
}

export default async function ExplorePage({ searchParams }: Props) {
  const { slug } = resolveTag((await searchParams).tag);

  return (
    <main className="mx-auto max-w-6xl px-4 pb-24 pt-20">
      {/* Page header — site condensed-uppercase style */}
      <header className="mb-10" style={{ borderBottom: "1px solid rgba(132,194,248,.22)", paddingBottom: "2rem" }}>
        <p style={{ fontSize: 11, color: "#90e2ff", letterSpacing: ".16em", textTransform: "uppercase", margin: "0 0 10px" }}>
          ECE Society · NIT Warangal
        </p>
        <h1
          style={{
            fontFamily: '"Barlow Condensed", sans-serif',
            fontSize: "clamp(54px, 7vw, 86px)",
            fontWeight: 700,
            lineHeight: 0.95,
            letterSpacing: "-.025em",
            textTransform: "uppercase",
            color: "#eef8ff",
            margin: "0 0 16px",
          }}
        >
          Explore
        </h1>
        <p style={{ fontSize: 15, color: "#b7cce0", lineHeight: 1.55, margin: 0, maxWidth: 480 }}>
          Latest in tech and electronics.{" "}
          <span style={{ color: "#90e2ff" }}>Tap a card to flip it.</span>
        </p>
      </header>

      <div className="mb-10 flex justify-center">
        <TagNav activeSlug={slug} />
      </div>

      {/* key re-triggers the skeleton on every tag change */}
      <Suspense key={slug} fallback={<GridSkeleton />}>
        <Articles slug={slug} />
      </Suspense>
    </main>
  );
}