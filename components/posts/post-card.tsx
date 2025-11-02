import Image from "next/image";
import Link from "next/link";

import { cn, extractExcerptText } from "@/lib/utils";

import {
  getFeaturedMediaById,
  getCategoryById,
  CardPost,
} from "@/lib/wordpress";

export async function PostCard({ post }: { post: CardPost }) {
  const media = post._embedded?.["wp:featuredmedia"] ?
    post._embedded?.["wp:featuredmedia"][0]
    : post.featured_media
    ? await getFeaturedMediaById(post.featured_media)
    : null;
  const date = new Date(post.date).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
  const category = post._embedded?.["wp:term"][0] && post._embedded?.["wp:term"][0][0].taxonomy === "category" ?
    post._embedded?.["wp:term"][0][0]
    : post.categories?.[0]
    ? await getCategoryById(post.categories[0])
    : null;

  return (
    <Link
      href={`/posts/${post.slug}`}
      className={cn(
        "border p-4 bg-accent/30 rounded-lg group flex justify-between flex-col not-prose gap-8",
        "hover:bg-accent/75 transition-all"
      )}
    >
      <div className="flex flex-col gap-4">
        {media?.source_url && (
          <div className="h-48 w-full overflow-hidden relative rounded-md border flex items-center justify-center bg-muted">
            <Image
              className="h-full w-full object-cover"
              src={media.source_url}
              alt={media.alt_text || post.title?.rendered || "Post thumbnail"}
              width={400}
              height={200}
            />
          </div>
        )}
        <div
          dangerouslySetInnerHTML={{
            __html: post.title?.rendered || "Untitled Post",
          }}
          className="text-xl text-primary font-medium group-hover:underline decoration-muted-foreground underline-offset-4 decoration-dotted transition-all"
        ></div>
        <div className="text-sm">
          {post.excerpt?.rendered
              ? extractExcerptText(post.excerpt.rendered).split(" ").slice(0, 24).join(" ").trim() + "..."
              : "No excerpt available"}
        </div>
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
