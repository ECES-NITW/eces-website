"use client";

import { useState } from "react";
import { ArticleCard } from "./article-card";
import type { Article } from "./articles";

const GRID = "grid grid-cols-[repeat(auto-fill,minmax(260px,1fr))] justify-items-center gap-7";

export function ArticleGrid({ articles }: { articles: Article[] }) {
  const [flippedId, setFlippedId] = useState<number | null>(null);

  return (
    <div className={GRID}>
      {articles.map((a) => (
        <ArticleCard
          key={a.id}
          article={a}
          flipped={flippedId === a.id}
          onFlipChange={(isFlipped) =>
            setFlippedId(isFlipped ? a.id : null)
          }
        />
      ))}
    </div>
  );
}
