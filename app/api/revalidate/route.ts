import { revalidatePath } from "next/cache";
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
      console.log("Revalidating entire site");
      revalidatePath("/", "layout");

      return NextResponse.json({
        revalidated: true,
        message: `Revalidated entire site due to ${contentType} update${
          contentId ? ` (ID: ${contentId})` : ""
        }`,
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
