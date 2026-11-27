import type { ExploreTag } from "./tags";

export type Article = {
  id: number;
  title: string;
  summary: string;
  url: string;
  cover: string | null;
  author: string;
  date: string;
  readingTime: number;
  tags: string[];
};

type FeedSource = {
  name: string;
  url: string;
};

type ParsedItem = Article & {
  publishedMs: number;
  searchText: string;
};

const FEEDS: FeedSource[] = [
  { name: "IEEE Spectrum", url: "https://spectrum.ieee.org/feeds/feed.rss" },
  { name: "Semiconductor Eng", url: "https://semiengineering.com/feed/" },
];

const MAX_PER_SOURCE = 10;

function hashUrl(url: string): number {
  let h = 2166136261;
  for (let i = 0; i < url.length; i++) {
    h ^= url.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function unwrapCdata(raw: string): string {
  return raw.replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1").trim();
}

function decodeEntities(text: string): string {
  return text
    .replace(/&#(\d+);/g, (_, code) => String.fromCodePoint(Number(code)))
    .replace(/&#x([0-9a-fA-F]+);/g, (_, hex) => String.fromCodePoint(parseInt(hex, 16)))
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&quot;/gi, '"')
    .replace(/&apos;|&#39;/gi, "'")
    .replace(/&rsquo;|&lsquo;/gi, "'")
    .replace(/&rdquo;|&ldquo;/gi, '"')
    .replace(/&mdash;/gi, "—")
    .replace(/&ndash;/gi, "–")
    .replace(/&hellip;/gi, "…");
}

function stripHtml(html: string): string {
  return decodeEntities(
    html
      .replace(/<script[\s\S]*?<\/script>/gi, " ")
      .replace(/<style[\s\S]*?<\/style>/gi, " ")
      .replace(/<[^>]+>/g, " ")
  )
    .replace(/\s+/g, " ")
    .trim();
}

function extractTag(block: string, tag: string): string {
  const escaped = tag.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const m = block.match(new RegExp(`<${escaped}(?:\\s[^>]*)?>([\\s\\S]*?)<\\/${escaped}>`, "i"));
  return m ? unwrapCdata(m[1]) : "";
}

function extractAllTags(block: string, tag: string): string[] {
  const escaped = tag.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const re = new RegExp(`<${escaped}(?:\\s[^>]*)?>([\\s\\S]*?)<\\/${escaped}>`, "gi");
  const results: string[] = [];
  let m: RegExpExecArray | null;
  while ((m = re.exec(block)) !== null) {
    const val = decodeEntities(unwrapCdata(m[1])).trim();
    if (val) results.push(val);
  }
  return results;
}

function extractCover(block: string, htmlBodies: string[]): string | null {
  const mediaMatch = block.match(/<(?:media:content|media:thumbnail|enclosure)\b[^>]*\burl=["']([^"']+)["']/i);
  if (mediaMatch?.[1] && /\.(?:png|jpe?g|webp|gif|avif)|media-library|wp-content\/uploads/i.test(mediaMatch[1])) {
    return decodeEntities(mediaMatch[1]);
  }
  for (const body of htmlBodies) {
    const imgMatch = body.match(/<img\b[^>]*\bsrc=["']([^"']+)["']/i);
    if (imgMatch?.[1] && !/1x1|pixel|gravatar/i.test(imgMatch[1])) {
      return decodeEntities(imgMatch[1]);
    }
  }
  return null;
}

function cleanSummary(rawDesc: string): string {
  const text = stripHtml(rawDesc)
    .replace(/The post .*? appeared first on .*?\.$/i, "")
    .trim();
  return text || "Read the full technical article for details.";
}

function parseFeed(xml: string, sourceName: string): ParsedItem[] {
  const itemBlocks = xml.match(/<item\b[^>]*>[\s\S]*?<\/item>/gi) ?? [];
  const items: ParsedItem[] = [];

  for (const block of itemBlocks) {
    const title = decodeEntities(extractTag(block, "title")).trim();
    const url = decodeEntities(extractTag(block, "link")).trim();
    if (!title || !url) continue;

    const rawDesc = extractTag(block, "description");
    const rawContent = extractTag(block, "content:encoded");
    const summary = cleanSummary(rawDesc || rawContent);
    const cover = extractCover(block, [rawDesc, rawContent]);

    const author = decodeEntities(extractTag(block, "dc:creator") || extractTag(block, "author")) || sourceName;
    const pubDateStr = extractTag(block, "pubDate");
    const parsedDate = pubDateStr ? new Date(pubDateStr) : new Date();
    const validDate = Number.isNaN(parsedDate.getTime()) ? new Date() : parsedDate;

    const date = validDate.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
      timeZone: "UTC",
    });

    const wordSource = stripHtml(rawContent || rawDesc);
    const wordCount = wordSource ? wordSource.split(/\s+/).length : 0;
    const readingTime = Math.max(2, Math.round(wordCount / 200));

    const rssCategories = extractAllTags(block, "category");
    const tags = [sourceName, ...rssCategories.filter((c) => c.toLowerCase() !== "news" && c.toLowerCase() !== "blog reviews")];

    items.push({
      id: hashUrl(url),
      title,
      summary,
      url,
      cover,
      author,
      date,
      readingTime,
      tags,
      publishedMs: validDate.getTime(),
      searchText: `${title} ${summary} ${rssCategories.join(" ")}`.toLowerCase(),
    });
  }

  return items;
}

function matchesTag(item: ParsedItem, tag: ExploreTag): boolean {
  if (tag.keywords.length === 0) return true;
  return tag.keywords.some((kw) => {
    const escaped = kw.toLowerCase().replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    return new RegExp(`\\b${escaped}\\b`, "i").test(item.searchText);
  });
}

async function fetchFeed(source: FeedSource): Promise<ParsedItem[]> {
  try {
    const res = await fetch(source.url, {
      signal: AbortSignal.timeout(10000),
      headers: {
        Accept: "application/rss+xml, application/xml, text/xml;q=0.9, */*;q=0.8",
        "User-Agent": "eces-website/1.0 (ECE Society NIT Warangal)",
      },
      next: { revalidate: 60 * 30, tags: ["explore-rss"] },
    });
    if (!res.ok) throw new Error(`${source.name} responded ${res.status}`);
    const xml = await res.text();
    return parseFeed(xml, source.name);
  } catch (err) {
    console.error(`[explore] failed to load ${source.name} RSS:`, err);
    return [];
  }
}

export async function getArticles(tag: ExploreTag): Promise<Article[]> {
  const perSource = await Promise.all(FEEDS.map(fetchFeed));

  const selected = perSource.flatMap((items) =>
    items.filter((item) => matchesTag(item, tag)).slice(0, MAX_PER_SOURCE)
  );

  selected.sort((a, b) => b.publishedMs - a.publishedMs);

  return selected.map((item) => ({
    id: item.id,
    title: item.title,
    summary: item.summary,
    url: item.url,
    cover: item.cover,
    author: item.author,
    date: item.date,
    readingTime: item.readingTime,
    tags: item.tags,
  }));
}
