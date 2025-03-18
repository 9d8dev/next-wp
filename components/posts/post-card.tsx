import Image from "next/image";
import Link from "next/link";

import { Post } from "@/lib/wordpress.d";
import { cn } from "@/lib/utils";

import {
  getAuthorById,
  getCategoryById,
} from "@/lib/wordpress";

export async function PostCard({ post }: { post: Post }) {
  let author = null;
  try {
    if (post.author) {
      author = await getAuthorById(post.author);
    }
  } catch (error) {
    console.error(`Error fetching author for post ${post.id} (${post.slug}):`, error);
    // Continue without author if there's an error
  }

  let category = null;
  try {
    if (post.categories?.[0]) {
      category = await getCategoryById(post.categories[0]);
    }
  } catch (error) {
    console.error(`Error fetching category for post ${post.id} (${post.slug}):`, error);
    // Continue without category if there's an error
  }

  const date = new Date(post.date).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  // Get the featured media from the embedded data
  const featuredMedia = post._embedded?.['wp:featuredmedia']?.[0];

  return (
    <Link
      href={`/posts/${post.slug}`}
      className={cn(
        "border p-4 bg-accent/30 rounded-lg group flex justify-between flex-col not-prose gap-8",
        "hover:bg-accent/75 transition-all"
      )}
    >
      <div className="flex flex-col gap-4">
        <div className="h-48 w-full overflow-hidden relative rounded-md border flex items-center justify-center bg-muted">
          {featuredMedia?.source_url ? (
            <Image
              className="h-full w-full object-cover"
              src={featuredMedia.source_url}
              alt={post.title?.rendered || "Post thumbnail"}
              width={400}
              height={200}
              priority={false}
            />
          ) : (
            <div className="flex items-center justify-center w-full h-full text-muted-foreground">
              No image available
            </div>
          )}
        </div>
        <div
          dangerouslySetInnerHTML={{
            __html: post.title?.rendered || "Untitled Post",
          }}
          className="text-xl text-primary font-medium group-hover:underline decoration-muted-foreground underline-offset-4 decoration-dotted transition-all"
        ></div>
        <div
          className="text-sm"
          dangerouslySetInnerHTML={{
            __html: post.excerpt?.rendered
              ? post.excerpt.rendered.split(" ").slice(0, 12).join(" ").trim() +
                "..."
              : "No excerpt available",
          }}
        ></div>
      </div>

      <div className="flex flex-col gap-4">
        <hr />
        <div className="flex justify-between items-center text-xs">
          <p>{category?.name || "Uncategorized"}</p>
          <p>{date}</p>
        </div>
      </div>
    </Link>
  );
}
