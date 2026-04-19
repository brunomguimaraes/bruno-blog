import { getAllPosts, type Post } from "@/lib/posts";
import {
  AUTHOR_BYLINE,
  FEED_DESCRIPTION,
  FEED_TITLE,
  FEED_URL,
  SITE_LANGUAGE,
  SITE_URL,
} from "@/lib/site";

// Statically generated at build time — getAllPosts() reads MDX off disk,
// so there's no reason to hit it per-request. A new post means a new
// build, which regenerates this route along with everything else.
export const dynamic = "force-static";

const XML_ESCAPES: Record<string, string> = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&apos;",
};

function escapeXml(value: string): string {
  return value.replace(/[&<>"']/g, (ch) => XML_ESCAPES[ch] ?? ch);
}

// Frontmatter dates are "YYYY-MM-DD". RSS 2.0 wants RFC 822. We treat
// the calendar date as UTC midnight — good enough for a blog where
// post-time-of-day is never meaningful.
function toRfc822(date: string): string {
  const d = new Date(`${date}T00:00:00Z`);
  if (Number.isNaN(d.getTime())) return new Date(0).toUTCString();
  return d.toUTCString();
}

function postUrl(slug: string): string {
  return `${SITE_URL}/blog/${slug}`;
}

function renderItem(post: Post): string {
  const url = postUrl(post.slug);
  const categories = post.tags
    .map((tag) => `    <category>${escapeXml(tag)}</category>`)
    .join("\n");

  return [
    "  <item>",
    `    <title>${escapeXml(post.title)}</title>`,
    `    <link>${escapeXml(url)}</link>`,
    `    <guid isPermaLink="true">${escapeXml(url)}</guid>`,
    `    <pubDate>${toRfc822(post.date)}</pubDate>`,
    `    <description>${escapeXml(post.description)}</description>`,
    categories,
    `    <dc:creator>${escapeXml(AUTHOR_BYLINE)}</dc:creator>`,
    "  </item>",
  ]
    .filter(Boolean)
    .join("\n");
}

export async function GET(): Promise<Response> {
  const posts = await getAllPosts();
  const lastBuildDate = posts[0]?.date
    ? toRfc822(posts[0].date)
    : new Date().toUTCString();

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0"
     xmlns:atom="http://www.w3.org/2005/Atom"
     xmlns:dc="http://purl.org/dc/elements/1.1/">
<channel>
  <title>${escapeXml(FEED_TITLE)}</title>
  <link>${escapeXml(`${SITE_URL}/blog`)}</link>
  <description>${escapeXml(FEED_DESCRIPTION)}</description>
  <language>${escapeXml(SITE_LANGUAGE)}</language>
  <lastBuildDate>${lastBuildDate}</lastBuildDate>
  <atom:link href="${escapeXml(FEED_URL)}" rel="self" type="application/rss+xml" />
${posts.map(renderItem).join("\n")}
</channel>
</rss>
`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      // Give CDNs/readers a sane refresh cadence — 1h fresh, 1d stale.
      "Cache-Control": "public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
