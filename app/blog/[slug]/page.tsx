import Link from "next/link";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import { getAllPosts, getPost } from "@/lib/posts";

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
  return {
    title: `${post.title} — Bruno Guimaraes`,
    description: post.description,
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

  return (
    <main className="mx-auto max-w-2xl px-6 py-16 font-mono text-accent-soft">
      <nav className="mb-10 text-xs uppercase tracking-[0.18em] text-accent-dim">
        <Link href="/blog" className="hover:text-accent">← /blog</Link>
      </nav>

      <article className="prose-matrix">
        <div className="text-[11px] uppercase tracking-[0.14em] text-accent">
          [{post.date}] {post.tags.map((t) => `#${t}`).join(" ")}
        </div>
        <h1 className="mt-1 text-4xl font-bold text-white tracking-tight">{post.title}</h1>
        <p className="mt-2 text-accent-soft/80">{post.description}</p>
        <hr className="my-8 border-accent/20" />
        <MDXRemote source={post.content} />
      </article>
    </main>
  );
}
