import Image from "next/image";
import Link from "next/link";

import { cn } from "@/lib/utils";

import {
  CardPost,
} from "@/lib/wordpress";

export function PostCard({ post }: { post: CardPost }) {
  const media = post.featuredMedia;
  const date = post.date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
  const category = post.categories[0]

  return (
    <Link
      href={`/posts/${post.slug}`}
      className={cn(
        "border p-4 bg-accent/30 rounded-lg group flex justify-between flex-col not-prose gap-8",
        "hover:bg-accent/75 transition-all"
      )}
    >
      <div className="flex flex-col gap-4">
        {media?.sourceUrl && (
          <div className="h-48 w-full overflow-hidden relative rounded-md border flex items-center justify-center bg-muted">
            <Image
              className="h-full w-full object-cover"
              src={media.sourceUrl}
              alt={media.altText || post.title || "Post thumbnail"}
              width={400}
              height={200}
            />
          </div>
        )}
        <div
          dangerouslySetInnerHTML={{
            __html: post.title || "Untitled Post",
          }}
          className="text-xl text-primary font-medium group-hover:underline decoration-muted-foreground underline-offset-4 decoration-dotted transition-all"
        ></div>
        <div className="text-sm">
          {post.excerpt
              ? post.excerpt.split(" ").slice(0, 24).join(" ").trim() + "..."
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
