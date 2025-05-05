import { revalidateTag } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const requestBody = await request.json();
    const secret = request.headers.get("x-webhook-secret");

    // Validate webhook secret
    if (secret !== process.env.WORDPRESS_WEBHOOK_SECRET) {
      console.error("Invalid webhook secret");
      return NextResponse.json(
        { message: "Invalid webhook secret" },
        { status: 401 }
      );
    }

    // Extract content type and ID from the webhook payload
    const { contentType, contentId } = requestBody;

    if (!contentType) {
      return NextResponse.json(
        { message: "Missing content type" },
        { status: 400 }
      );
    }

    // Determine which tags to revalidate
    const tagsToRevalidate = ["wordpress"];

    // Add content type specific tag
    if (contentType === "post") {
      tagsToRevalidate.push("posts");
      if (contentId) {
        tagsToRevalidate.push(`post-${contentId}`);
      }
    } else if (contentType === "page") {
      tagsToRevalidate.push("pages");
      if (contentId) {
        tagsToRevalidate.push(`page-${contentId}`);
      }
    } else if (contentType === "category") {
      tagsToRevalidate.push("categories");
      if (contentId) {
        tagsToRevalidate.push(`category-${contentId}`);
      }
    } else if (contentType === "tag") {
      tagsToRevalidate.push("tags");
      if (contentId) {
        tagsToRevalidate.push(`tag-${contentId}`);
      }
    } else if (contentType === "author" || contentType === "user") {
      tagsToRevalidate.push("authors");
      if (contentId) {
        tagsToRevalidate.push(`author-${contentId}`);
      }
    } else if (contentType === "media") {
      tagsToRevalidate.push("media");
      if (contentId) {
        tagsToRevalidate.push(`media-${contentId}`);
      }
    }

    // Revalidate all determined tags
    for (const tag of tagsToRevalidate) {
      console.log(`Revalidating tag: ${tag}`);
      revalidateTag(tag);
    }

    return NextResponse.json({
      revalidated: true,
      message: `Revalidated tags: ${tagsToRevalidate.join(", ")}`,
    });
  } catch (error) {
    console.error("Revalidation error:", error);
    return NextResponse.json(
      { message: "Error revalidating content" },
      { status: 500 }
    );
  }
}