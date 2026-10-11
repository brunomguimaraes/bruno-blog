import HomePage from "@/components/HomePage";
import { getAllPosts } from "@/lib/posts";
import { getTodayNow } from "@/lib/now";
import { getSkills } from "@/lib/skills";

// Re-render at most once per hour so now.log rotates at least daily
// without needing a fresh deploy.
export const revalidate = 3600;

export default async function Home() {
  const posts = await getAllPosts();
  const nowEntries = getTodayNow(5);
  const skills = (await getSkills()).map(({ slug, title, summary }) => ({ slug, title, summary }));
  return <HomePage posts={posts.slice(0, 3)} nowEntries={nowEntries} skills={skills} />;
}
