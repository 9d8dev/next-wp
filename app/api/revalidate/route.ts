import { revalidatePath, revalidateTag } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

export const maxDuration = 30;

/**
 * WordPress webhook handler for content revalidation
 * Receives notifications from WordPress when content changes
 * and revalidates the entire site
 */

export async function POST(request: NextRequest) {
  try {
    const requestBody = await request.json();
    const secret = request.headers.get("x-webhook-secret");

    if (secret !== process.env.WORDPRESS_WEBHOOK_SECRET) {
      console.error("Invalid webhook secret");
      return NextResponse.json(
        { message: "Invalid webhook secret" },
        { status: 401 }
      );
    }

    const { contentType, contentId } = requestBody;

    if (!contentType) {
      return NextResponse.json(
        { message: "Missing content type" },
        { status: 400 }
      );
    }

    try {
      console.log(
        `Revalidating content: ${contentType}${
          contentId ? ` (ID: ${contentId})` : ""
        }`
      );

      // Revalidate specific content type tags
      revalidateTag("wordpress");

      if (contentType === "post") {
        revalidateTag("posts");
        if (contentId) {
          revalidateTag(`post-${contentId}`);
        }
        // Clear all post pages when any post changes
        revalidateTag("posts-page-1");
      } else if (contentType === "category") {
        revalidateTag("categories");
        if (contentId) {
          revalidateTag(`posts-category-${contentId}`);
          revalidateTag(`category-${contentId}`);
        }
      } else if (contentType === "tag") {
        revalidateTag("tags");
        if (contentId) {
          revalidateTag(`posts-tag-${contentId}`);
          revalidateTag(`tag-${contentId}`);
        }
      } else if (contentType === "author" || contentType === "user") {
        revalidateTag("authors");
        if (contentId) {
          revalidateTag(`posts-author-${contentId}`);
          revalidateTag(`author-${contentId}`);
        }
      }

      // Also revalidate the entire layout for safety
      revalidatePath("/", "layout");

      return NextResponse.json({
        revalidated: true,
        message: `Revalidated ${contentType}${
          contentId ? ` (ID: ${contentId})` : ""
        } and related content`,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error("Error revalidating path:", error);
      return NextResponse.json(
        {
          revalidated: false,
          message: "Failed to revalidate site",
          error: (error as Error).message,
          timestamp: new Date().toISOString(),
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Revalidation error:", error);
    return NextResponse.json(
      {
        message: "Error revalidating content",
        error: (error as Error).message,
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
