import { revalidateWordPressData } from "@/lib/wordpress";
import { NextRequest } from "next/server";

// Webhook secret from environment variable
const WEBHOOK_SECRET = process.env.WORDPRESS_WEBHOOK_SECRET;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Verify webhook secret
    const secret = request.headers.get("x-webhook-secret");
    if (WEBHOOK_SECRET && secret !== WEBHOOK_SECRET) {
      return Response.json(
        { message: "Invalid webhook secret" },
        { status: 401 }
      );
    }

    // Extract information from the webhook
    const { type, subtype, id } = body;

    // Determine which tags to revalidate based on the webhook data
    const tagsToRevalidate: string[] = ["wordpress"];

    // Add specific content type tag
    if (type) {
      tagsToRevalidate.push(type + "s"); // e.g., "post" -> "posts"
    }

    // Add specific content item tag
    if (id) {
      tagsToRevalidate.push(`${type}-${id}`);
    }

    // Handle taxonomies
    if (type === "term") {
      tagsToRevalidate.push(subtype + "s"); // e.g., "category" -> "categories"
      if (id) {
        tagsToRevalidate.push(`${subtype}-${id}`);
      }
    }

    // Revalidate the content
    await revalidateWordPressData(tagsToRevalidate);

    return Response.json({
      revalidated: true,
      tags: tagsToRevalidate,
      message: `Revalidated ${tagsToRevalidate.join(", ")}`,
    });
  } catch (error) {
    console.error("Revalidation error:", error);
    return Response.json(
      { message: "Error revalidating content" },
      { status: 500 }
    );
  }
}
