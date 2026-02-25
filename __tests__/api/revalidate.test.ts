import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock next/cache
const mockRevalidateTag = vi.fn();
const mockRevalidatePath = vi.fn();
vi.mock("next/cache", () => ({
  revalidateTag: (...args: unknown[]) => mockRevalidateTag(...args),
  revalidatePath: (...args: unknown[]) => mockRevalidatePath(...args),
}));

// Mock next/server
vi.mock("next/server", () => {
  class MockNextRequest {
    private _body: unknown;
    private _headers: Map<string, string>;

    constructor(url: string, init?: { method?: string; body?: string; headers?: Record<string, string> }) {
      this._body = init?.body ? JSON.parse(init.body) : null;
      this._headers = new Map(Object.entries(init?.headers ?? {}));
    }

    async json() {
      return this._body;
    }

    get headers() {
      return {
        get: (name: string) => this._headers.get(name) ?? null,
      };
    }
  }

  class MockNextResponse {
    static json(body: unknown, init?: { status?: number }) {
      return {
        body,
        status: init?.status ?? 200,
        json: () => Promise.resolve(body),
      };
    }
  }

  return {
    NextRequest: MockNextRequest,
    NextResponse: MockNextResponse,
  };
});

import { NextRequest } from "next/server";

function createRequest(body: Record<string, unknown>, secret?: string) {
  const headers: Record<string, string> = {};
  if (secret) headers["x-webhook-secret"] = secret;

  return new NextRequest("http://localhost/api/revalidate", {
    method: "POST",
    body: JSON.stringify(body),
    headers,
  });
}

describe("POST /api/revalidate", () => {
  beforeEach(() => {
    mockRevalidateTag.mockReset();
    mockRevalidatePath.mockReset();
    vi.stubEnv("WORDPRESS_WEBHOOK_SECRET", "test-secret");
  });

  it("returns 401 for invalid webhook secret", async () => {
    const { POST } = await import("@/app/api/revalidate/route");
    const req = createRequest({ contentType: "post" }, "wrong-secret");
    const res = await POST(req);

    expect(res.status).toBe(401);
    const body = await res.json();
    expect(body.message).toContain("Invalid webhook secret");
  });

  it("returns 401 for missing webhook secret", async () => {
    const { POST } = await import("@/app/api/revalidate/route");
    const req = createRequest({ contentType: "post" });
    const res = await POST(req);

    expect(res.status).toBe(401);
  });

  it("returns 400 for missing contentType", async () => {
    const { POST } = await import("@/app/api/revalidate/route");
    const req = createRequest({}, "test-secret");
    const res = await POST(req);

    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.message).toContain("Missing content type");
  });

  it("revalidates post tags", async () => {
    const { POST } = await import("@/app/api/revalidate/route");
    const req = createRequest(
      { contentType: "post", contentId: 42 },
      "test-secret"
    );
    const res = await POST(req);

    expect(res.status).toBe(200);
    expect(mockRevalidateTag).toHaveBeenCalledWith("wordpress", { expire: 0 });
    expect(mockRevalidateTag).toHaveBeenCalledWith("posts", { expire: 0 });
    expect(mockRevalidateTag).toHaveBeenCalledWith("post-42", { expire: 0 });
    expect(mockRevalidateTag).toHaveBeenCalledWith("posts-page-1", {
      expire: 0,
    });
    expect(mockRevalidatePath).toHaveBeenCalledWith("/", "layout");
  });

  it("revalidates category tags", async () => {
    const { POST } = await import("@/app/api/revalidate/route");
    const req = createRequest(
      { contentType: "category", contentId: 5 },
      "test-secret"
    );
    await POST(req);

    expect(mockRevalidateTag).toHaveBeenCalledWith("categories", {
      expire: 0,
    });
    expect(mockRevalidateTag).toHaveBeenCalledWith("posts-category-5", {
      expire: 0,
    });
    expect(mockRevalidateTag).toHaveBeenCalledWith("category-5", {
      expire: 0,
    });
  });

  it("revalidates tag tags", async () => {
    const { POST } = await import("@/app/api/revalidate/route");
    const req = createRequest(
      { contentType: "tag", contentId: 10 },
      "test-secret"
    );
    await POST(req);

    expect(mockRevalidateTag).toHaveBeenCalledWith("tags", { expire: 0 });
    expect(mockRevalidateTag).toHaveBeenCalledWith("posts-tag-10", {
      expire: 0,
    });
    expect(mockRevalidateTag).toHaveBeenCalledWith("tag-10", { expire: 0 });
  });

  it("revalidates author tags (contentType=author)", async () => {
    const { POST } = await import("@/app/api/revalidate/route");
    const req = createRequest(
      { contentType: "author", contentId: 2 },
      "test-secret"
    );
    await POST(req);

    expect(mockRevalidateTag).toHaveBeenCalledWith("authors", { expire: 0 });
    expect(mockRevalidateTag).toHaveBeenCalledWith("posts-author-2", {
      expire: 0,
    });
  });

  it("revalidates author tags (contentType=user)", async () => {
    const { POST } = await import("@/app/api/revalidate/route");
    const req = createRequest(
      { contentType: "user", contentId: 3 },
      "test-secret"
    );
    await POST(req);

    expect(mockRevalidateTag).toHaveBeenCalledWith("authors", { expire: 0 });
    expect(mockRevalidateTag).toHaveBeenCalledWith("posts-author-3", {
      expire: 0,
    });
  });

  it("handles post without contentId", async () => {
    const { POST } = await import("@/app/api/revalidate/route");
    const req = createRequest({ contentType: "post" }, "test-secret");
    const res = await POST(req);

    expect(res.status).toBe(200);
    expect(mockRevalidateTag).toHaveBeenCalledWith("posts", { expire: 0 });
    // Should NOT have been called with a specific post tag
    expect(mockRevalidateTag).not.toHaveBeenCalledWith(
      expect.stringContaining("post-"),
      expect.anything()
    );
  });

  it("always revalidates layout path", async () => {
    const { POST } = await import("@/app/api/revalidate/route");
    const req = createRequest({ contentType: "post" }, "test-secret");
    await POST(req);

    expect(mockRevalidatePath).toHaveBeenCalledWith("/", "layout");
  });

  it("returns revalidated response with timestamp", async () => {
    const { POST } = await import("@/app/api/revalidate/route");
    const req = createRequest({ contentType: "post" }, "test-secret");
    const res = await POST(req);

    const body = await res.json();
    expect(body.revalidated).toBe(true);
    expect(body.timestamp).toBeDefined();
    expect(body.message).toContain("post");
  });
});
