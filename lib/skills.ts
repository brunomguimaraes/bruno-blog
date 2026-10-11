import fs from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";

const skillsDir = path.join(process.cwd(), "skills");

export type Skill = {
  slug: string;
  title: string;
  summary: string;
  description: string;
  category: string;
  relatedPost?: string;
  updated: string;
  source: string;
};

export async function getSkills(): Promise<Skill[]> {
  const folders = await fs.readdir(skillsDir, { withFileTypes: true });
  return Promise.all(folders.filter((f) => f.isDirectory()).sort((a, b) => a.name.localeCompare(b.name)).map(async (folder) => {
    const source = await fs.readFile(path.join(skillsDir, folder.name, "SKILL.md"), "utf8");
    const { data } = matter(source);
    const meta = data.metadata;
    if (data.name !== folder.name || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(folder.name) ||
      typeof data.description !== "string" || !meta ||
      [meta.title, meta.summary, meta.category, meta.updated].some((v) => typeof v !== "string")) {
      throw new Error(`Invalid skill metadata: ${folder.name}`);
    }
    return {
      slug: folder.name, title: meta.title, summary: meta.summary,
      description: data.description, category: meta.category,
      relatedPost: typeof meta["related-post"] === "string" ? meta["related-post"] : undefined,
      updated: meta.updated, source,
    };
  }));
}
