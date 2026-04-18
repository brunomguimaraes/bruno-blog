import fs from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";

const postsDir = path.join(process.cwd(), "content", "posts");

export type Post = {
  slug: string;
  title: string;
  date: string;
  tags: string[];
  description: string;
  content: string;
};

function normalize(raw: string, slug: string): Post {
  const { data, content } = matter(raw);
  return {
    slug,
    title: (data.title as string) ?? slug,
    date: (data.date as string) ?? "",
    tags: Array.isArray(data.tags) ? (data.tags as string[]) : [],
    description: (data.description as string) ?? "",
    content,
  };
}

export async function getAllPosts(): Promise<Post[]> {
  let files: string[] = [];
  try {
    files = await fs.readdir(postsDir);
  } catch {
    return [];
  }
  const posts = await Promise.all(
    files
      .filter((f) => f.endsWith(".mdx"))
      .map(async (file) => {
        const raw = await fs.readFile(path.join(postsDir, file), "utf8");
        return normalize(raw, file.replace(/\.mdx$/, ""));
      }),
  );
  return posts.sort((a, b) => b.date.localeCompare(a.date));
}

export async function getPost(slug: string): Promise<Post | null> {
  try {
    const raw = await fs.readFile(path.join(postsDir, `${slug}.mdx`), "utf8");
    return normalize(raw, slug);
  } catch {
    return null;
  }
}
