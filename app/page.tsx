import HomePage from "@/components/HomePage";
import { getAllPosts } from "@/lib/posts";

export default async function Home() {
  const posts = await getAllPosts();
  return <HomePage posts={posts.slice(0, 3)} />;
}
