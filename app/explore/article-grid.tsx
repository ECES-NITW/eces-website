"use client";

import { useState } from "react";
import { ArticleCard } from "./article-card";
import type { Article } from "./articles";

const GRID = "grid grid-cols-[repeat(auto-fill,minmax(260px,1fr))] justify-items-center gap-7";

export function ArticleGrid({ articles }: { articles: Article[] }) {
  const [flippedUrl, setFlippedUrl] = useState<string | null>(null);

  return (
    <div className={GRID}>
      {articles.map((a) => (
        <ArticleCard
          key={a.url}
          article={a}
          flipped={flippedUrl === a.url}
          onFlipChange={(isFlipped) =>
            setFlippedUrl(isFlipped ? a.url : null)
          }
        />
      ))}
    </div>
  );
}
