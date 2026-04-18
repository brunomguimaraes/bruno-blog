import HomePage from "@/components/HomePage";
import { getAllPosts } from "@/lib/posts";
import { getTodayNow } from "@/lib/now";

// Re-render at most once per hour so now.log rotates at least daily
// without needing a fresh deploy.
export const revalidate = 3600;

export default async function Home() {
  const posts = await getAllPosts();
  const nowEntries = getTodayNow(5);
  return <HomePage posts={posts.slice(0, 3)} nowEntries={nowEntries} />;
}
