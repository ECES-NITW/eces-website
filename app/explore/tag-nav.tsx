"use client";

import type { CSSProperties } from "react";
import PillNav from "@/components/PillNav";
import { EXPLORE_TAGS, tagHref } from "./tags";

export function TagNav({ activeSlug }: { activeSlug: string }) {
  return (
    <PillNav
      logo="/ece-logo.png"
      logoAlt="ECES"
      logoHref="/"
      items={EXPLORE_TAGS.map((t) => ({ label: t.label, href: tagHref(t.slug) }))}
      activeHref={tagHref(activeSlug)}
      itemStyle="pill"
      hoverEffect="fill"
      indicator="dot"
      layout="split"
      surface="none"
      size="md"
      bounce={0.3}
      stretch={0.5}
      collapse="auto"
      intro
      theme="dark"
      highlightColor="#4ba4ff"
      highlightTextColor="#030812"
      barColor="transparent"
      textColor="#eef8ff"
      style={
        {
          "--pn-tile": "transparent",
          "--pn-tile-rim": "inset 0 0 0 1px rgba(132, 194, 248, 0.38)",
          "--pn-edge": "rgba(132, 194, 248, 0.3)",
          "--pn-rim": "rgba(144, 226, 255, 0.14)",
          "--pn-panel-surface": "rgba(7, 20, 41, 0.96)",
        } as CSSProperties
      }
    />
  );
}