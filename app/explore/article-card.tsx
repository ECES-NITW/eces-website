"use client";

import FlipCard from "@/components/FlipCard";
import type { Article } from "./articles";

const stop = (e: React.SyntheticEvent) => e.stopPropagation();

export function ArticleCard({
  article,
  flipped,
  onFlipChange,
}: {
  article: Article;
  flipped?: boolean;
  onFlipChange?: (flipped: boolean) => void;
}) {
  const { title, summary, url, cover, author, date, readingTime, tags } = article;

  /* ── FRONT ── cover image with gradient overlay */
  const front = (
    <div
      className="relative flex h-full w-full flex-col justify-end overflow-hidden p-5 text-left"
      style={{ background: "linear-gradient(135deg,#071429 0%,#030812 100%)" }}
    >
      {cover ? (
        <img
          src={cover}
          alt=""
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 h-full w-full object-cover"
        />
      ) : null}
      {cover ? (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "linear-gradient(to top, rgba(3,8,18,.92) 0%, rgba(3,8,18,.55) 55%, rgba(3,8,18,.18) 100%)",
          }}
        />
      ) : null}

      <div className="relative z-10">
        {/* tag pills – site style */}
        <div className="mb-2.5 flex flex-wrap gap-1.5">
          {tags.slice(0, 2).map((t) => (
            <span
              key={t}
              style={{
                border: "1px solid rgba(132,194,248,.28)",
                color: "#90e2ff",
                fontSize: 10,
                letterSpacing: ".1em",
                textTransform: "uppercase",
                fontFamily: '"Barlow Condensed", sans-serif',
              }}
              className="rounded-full px-2.5 py-0.5 backdrop-blur"
            >
              {t}
            </span>
          ))}
        </div>

        {/* title */}
        <h3
          className="line-clamp-3 font-semibold leading-snug"
          style={{
            fontFamily: '"Barlow Condensed", sans-serif',
            fontSize: "clamp(18px,2vw,22px)",
            color: "#eef8ff",
            textTransform: "uppercase",
            letterSpacing: "-.01em",
          }}
        >
          {title}
        </h3>

        {/* meta */}
        <p className="mt-2" style={{ fontSize: 11, color: "#b7cce0", letterSpacing: ".04em" }}>
          {author}
          {date ? ` · ${date}` : ""}
        </p>
      </div>
    </div>
  );

  /* ── BACK ── summary + read-more */
  const back = (
    <div
      className="flex h-full w-full flex-col justify-between p-5 text-left"
      style={{ background: "linear-gradient(160deg,#071429 0%,#030812 100%)" }}
    >
      <div>
        {/* small title */}
        <p
          style={{
            fontSize: 10,
            color: "#90e2ff",
            letterSpacing: ".13em",
            textTransform: "uppercase",
            marginBottom: 10,
            fontFamily: '"Barlow Condensed", sans-serif',
          }}
        >
          {tags[0] ?? "Article"}
        </p>
        <h4
          className="line-clamp-2"
          style={{
            fontFamily: '"Barlow Condensed", sans-serif',
            fontSize: 20,
            fontWeight: 600,
            color: "#eef8ff",
            textTransform: "uppercase",
            lineHeight: 1.1,
            margin: "0 0 12px",
          }}
        >
          {title}
        </h4>
        <p
          className="line-clamp-4"
          style={{ fontSize: 13, lineHeight: 1.55, color: "#b7cce0", margin: 0 }}
        >
          {summary}
        </p>
      </div>

      {/* footer */}
      <div
        style={{
          borderTop: "1px solid rgba(132,194,248,.18)",
          paddingTop: 14,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <span style={{ fontSize: 11, color: "#b7cce0", letterSpacing: ".06em", textTransform: "uppercase" }}>
          {readingTime} min read
        </span>
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          onClick={stop}
          onPointerDown={stop}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            padding: "9px 16px",
            background: "#a5e7ff",
            color: "#041328",
            fontSize: 11,
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: ".05em",
            transition: "background .2s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = "#d2f4ff")}
          onMouseLeave={(e) => (e.currentTarget.style.background = "#a5e7ff")}
        >
          Read more →
        </a>
      </div>
    </div>
  );

  return (
    <FlipCard
      front={front}
      back={back}
      flipped={flipped}
      onFlipChange={onFlipChange}
      ariaLabel={`Show details for ${title}`}
      axis="y"
      flipOnClick
      tilt
      tiltMax={10}
      glare
      glareOpacity={0.15}
      hoverScale={1.03}
      perspective={1100}
      stiffness={170}
      damping={20}
      width={260}
      height={340}
      radius={4}
      background="#071429"
      color="#eef8ff"
      shadow
      shadowColor="#000814"
      shadowOpacity={0.5}
    />
  );
}
