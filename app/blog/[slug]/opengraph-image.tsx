import { ImageResponse } from "next/og";
import { getPost } from "@/lib/posts";

export const runtime = "nodejs";

export const alt = "Bruno Guimaraes — blog post";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const MONO = '"JetBrains Mono", "SF Mono", "Menlo", "Consolas", monospace';

type Params = { slug: string };

export async function generateStaticParams(): Promise<Params[]> {
  const { getAllPosts } = await import("@/lib/posts");
  const posts = await getAllPosts();
  return posts.map((p) => ({ slug: p.slug }));
}

export default async function PostOGImage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const post = await getPost(slug);

  const title = post?.title ?? "post not found";
  const description = post?.description ?? "";
  const date = post?.date ?? "";
  const tags = (post?.tags ?? []).filter(
    (t) => !t.startsWith("series-") && t !== "archive",
  );

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          background:
            "radial-gradient(1200px 700px at 12% 0%, #0a1836 0%, #02040a 55%, #000 100%)",
          color: "#d6e8ff",
          fontFamily: MONO,
          padding: 56,
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "repeating-linear-gradient(0deg, rgba(26,163,255,0.04) 0px, rgba(26,163,255,0.04) 1px, transparent 1px, transparent 3px)",
            pointerEvents: "none",
            display: "flex",
          }}
        />

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            flex: 1,
            borderRadius: 14,
            border: "1px solid rgba(26,163,255,0.35)",
            background: "rgba(3, 8, 22, 0.72)",
            boxShadow:
              "inset 0 0 0 1px rgba(26,163,255,0.08), 0 0 60px rgba(26,163,255,0.15)",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              padding: "14px 20px",
              borderBottom: "1px solid rgba(26,163,255,0.25)",
              background: "rgba(10, 24, 54, 0.55)",
              fontSize: 18,
              color: "#8fb7e6",
            }}
          >
            <span
              style={{
                width: 12,
                height: 12,
                borderRadius: 999,
                background: "#ff5f56",
                display: "flex",
              }}
            />
            <span
              style={{
                width: 12,
                height: 12,
                borderRadius: 999,
                background: "#ffbd2e",
                display: "flex",
              }}
            />
            <span
              style={{
                width: 12,
                height: 12,
                borderRadius: 999,
                background: "#27c93f",
                display: "flex",
              }}
            />
            <span style={{ marginLeft: 14, letterSpacing: 2 }}>
              bruno@bridge · ~/blog
            </span>
            <span
              style={{
                marginLeft: "auto",
                fontSize: 14,
                color: "#4f7ab0",
                letterSpacing: 2,
              }}
            >
              brunao.dev
            </span>
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              flex: 1,
              padding: "44px 48px",
              gap: 24,
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 14,
                fontSize: 20,
                color: "#6faaff",
                letterSpacing: 2,
              }}
            >
              <span>$ cat {slug}.mdx</span>
              {date && (
                <>
                  <span style={{ color: "#1a3a66" }}>·</span>
                  <span style={{ color: "#4f7ab0" }}>{date}</span>
                </>
              )}
            </div>

            <div
              style={{
                display: "flex",
                fontSize: title.length > 38 ? 58 : 72,
                fontWeight: 700,
                color: "#ffffff",
                letterSpacing: -1,
                lineHeight: 1.05,
                maxWidth: "100%",
              }}
            >
              {title}
            </div>

            {description ? (
              <div
                style={{
                  display: "flex",
                  fontSize: 26,
                  color: "#a9c6ee",
                  lineHeight: 1.35,
                  maxWidth: "100%",
                }}
              >
                {description}
              </div>
            ) : null}

            <div
              style={{
                display: "flex",
                height: 1,
                background:
                  "linear-gradient(90deg, rgba(26,163,255,0.6), rgba(26,163,255,0))",
              }}
            />

            <div
              style={{
                marginTop: "auto",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                fontSize: 18,
                color: "#4f7ab0",
                letterSpacing: 3,
                textTransform: "uppercase",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <span
                  style={{
                    width: 10,
                    height: 10,
                    borderRadius: 999,
                    background: "#27c93f",
                    display: "flex",
                    boxShadow: "0 0 10px #27c93f",
                  }}
                />
                <span>bruno guimaraes · fullstack</span>
              </div>
              {tags.length > 0 && (
                <div
                  style={{
                    display: "flex",
                    gap: 10,
                    color: "#6faaff",
                  }}
                >
                  {tags.slice(0, 4).map((t) => (
                    <span
                      key={t}
                      style={{
                        display: "flex",
                        border: "1px solid rgba(26,163,255,0.35)",
                        borderRadius: 4,
                        padding: "4px 10px",
                      }}
                    >
                      #{t}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
