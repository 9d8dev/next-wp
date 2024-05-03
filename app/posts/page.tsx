import { getAllPosts } from "@/lib/wordpress";

export default async function Page() {
  const posts = await getAllPosts();

  return (
    <div>
      <h1>All Posts</h1>
      <ul>
        {posts.map((post: any) => (
          <li key={post.id}>{post.title.rendered}</li>
        ))}
      </ul>
    </div>
  );
}
