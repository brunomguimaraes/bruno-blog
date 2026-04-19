import Link from "next/link";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import { getAllPosts, getPost } from "@/lib/posts";
import ReadProgress from "@/components/ReadProgress";

type Params = { slug: string };

export async function generateStaticParams(): Promise<Params[]> {
  const posts = await getAllPosts();
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) return { title: "Not found" };

  const url = `/blog/${post.slug}`;
  const tags = post.tags.filter(
    (t) => !t.startsWith("series-") && t !== "archive",
  );

  return {
    title: post.title,
    description: post.description,
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      url,
      title: post.title,
      description: post.description,
      publishedTime: post.date || undefined,
      authors: ["Bruno Guimaraes"],
      tags,
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
    },
  };
}

export default async function Post({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) notFound();

  const seriesTag = post.tags.find((t) => t.startsWith("series-"));
  const isArchive = post.tags.includes("archive");
  const visibleTags = post.tags.filter(
    (t) => !t.startsWith("series-") && t !== "archive",
  );

  return (
    <main className="mx-auto w-full max-w-2xl px-6 py-16 font-mono text-accent-soft">
      <ReadProgress />
      <nav className="mb-10 text-xs uppercase tracking-[0.18em] text-accent-dim">
        <Link href="/blog" className="hover:text-accent">← /blog</Link>
      </nav>

      <article className="prose-matrix">
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] uppercase tracking-[0.14em] text-accent">
          <span>[{post.date}]</span>
          {visibleTags.length > 0 && (
            <span>{visibleTags.map((t) => `#${t}`).join(" ")}</span>
          )}
          {seriesTag && (
            <span className="rounded-sm border border-accent/40 bg-accent/10 px-1.5 py-0.5 text-[10px] tracking-[0.18em]">
              series · {seriesTag.replace(/^series-/, "")}
            </span>
          )}
          {isArchive && (
            <span className="rounded-sm border border-accent-dim/40 bg-white/5 px-1.5 py-0.5 text-[10px] tracking-[0.18em] text-accent-dim">
              archive
            </span>
          )}
        </div>
        <h1 className="mt-1 text-4xl font-bold text-white tracking-tight">{post.title}</h1>
        <p className="mt-2 text-accent-soft/80">{post.description}</p>
        <hr className="my-8 border-accent/20" />
        <MDXRemote source={post.content} />
      </article>
    </main>
  );
}
