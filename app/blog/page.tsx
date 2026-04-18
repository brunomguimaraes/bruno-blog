import Link from "next/link";
import { getAllPosts } from "@/lib/posts";

export const metadata = {
  title: "Blog — Bruno Guimaraes",
  description: "Notes on building, shipping, and staying calm on-call.",
};

export default async function BlogIndex() {
  const posts = await getAllPosts();
  return (
    <main className="mx-auto max-w-2xl px-6 py-16 font-mono text-accent-soft">
      <nav className="mb-10 text-xs uppercase tracking-[0.18em] text-accent-dim">
        <Link href="/" className="hover:text-accent">← /home</Link>
      </nav>
      <h1 className="mb-2 text-4xl font-bold text-white tracking-tight">~/blog</h1>
      <p className="mb-10 text-sm text-accent-dim">
        {posts.length} entries. Press <kbd className="rounded border border-accent/30 bg-accent/10 px-1.5 py-0.5 text-[11px]">?</kbd> anywhere for shortcuts.
      </p>

      <ul className="space-y-4">
        {posts.map((p) => (
          <li key={p.slug}>
            <Link
              href={`/blog/${p.slug}`}
              className="block rounded-md border border-transparent p-3 transition hover:border-accent/30 hover:bg-accent/5"
            >
              <div className="text-[11px] uppercase tracking-[0.14em] text-accent opacity-70">
                [{p.date}] {p.tags.map((t) => `#${t}`).join(" ")}
              </div>
              <div className="mt-1 text-lg text-white">{p.title}</div>
              <div className="mt-1 text-sm text-accent-soft/75">{p.description}</div>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
