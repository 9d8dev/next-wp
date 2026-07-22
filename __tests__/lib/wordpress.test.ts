import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

// Mock fetch globally before importing the module
const mockFetch = vi.fn();
vi.stubGlobal("fetch", mockFetch);

function mockResponse(
  body: unknown,
  options: { ok?: boolean; status?: number; statusText?: string; headers?: Record<string, string> } = {}
) {
  const { ok = true, status = 200, statusText = "OK", headers = {} } = options;
  return {
    ok,
    status,
    statusText,
    json: () => Promise.resolve(body),
    headers: {
      get: (name: string) => headers[name] ?? null,
    },
  };
}

describe("WordPress API", () => {
  beforeEach(() => {
    vi.stubEnv("WORDPRESS_URL", "https://example.com");
    mockFetch.mockReset();
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  // We need to dynamically import the module for each test group
  // to pick up environment variable changes

  describe("getPostBySlug", () => {
    it("passes _embed=true and returns the first post", async () => {
      const post = { id: 1, slug: "hello", title: { rendered: "Hello" } };
      mockFetch.mockResolvedValueOnce(mockResponse([post]));

      const { getPostBySlug } = await import("@/lib/wordpress");
      const result = await getPostBySlug("hello");

      expect(result).toEqual(post);
      const fetchUrl = mockFetch.mock.calls[0][0] as string;
      expect(fetchUrl).toContain("slug=hello");
      expect(fetchUrl).toContain("_embed=true");
    });

    it("returns undefined when no post matches", async () => {
      mockFetch.mockResolvedValueOnce(mockResponse([]));

      const { getPostBySlug } = await import("@/lib/wordpress");
      const result = await getPostBySlug("nonexistent");

      expect(result).toBeUndefined();
    });
  });

  describe("getPostsPaginated", () => {
    it("builds query with filter params", async () => {
      mockFetch.mockResolvedValueOnce(
        mockResponse([], {
          headers: { "X-WP-Total": "0", "X-WP-TotalPages": "0" },
        })
      );

      const { getPostsPaginated } = await import("@/lib/wordpress");
      await getPostsPaginated(1, 9, {
        author: "5",
        category: "3",
        tag: "7",
        search: "hello",
      });

      const fetchUrl = mockFetch.mock.calls[0][0] as string;
      expect(fetchUrl).toContain("author=5");
      expect(fetchUrl).toContain("categories=3");
      expect(fetchUrl).toContain("tags=7");
      expect(fetchUrl).toContain("search=hello");
      expect(fetchUrl).toContain("per_page=9");
      expect(fetchUrl).toContain("page=1");
    });

    it("returns data with pagination headers", async () => {
      const posts = [{ id: 1 }, { id: 2 }];
      mockFetch.mockResolvedValueOnce(
        mockResponse(posts, {
          headers: { "X-WP-Total": "20", "X-WP-TotalPages": "3" },
        })
      );

      const { getPostsPaginated } = await import("@/lib/wordpress");
      const result = await getPostsPaginated(1, 9);

      expect(result.data).toEqual(posts);
      expect(result.headers.total).toBe(20);
      expect(result.headers.totalPages).toBe(3);
    });

    it("returns empty response on fetch failure", async () => {
      mockFetch.mockRejectedValueOnce(new Error("Network error"));

      const { getPostsPaginated } = await import("@/lib/wordpress");
      const result = await getPostsPaginated(1, 9);

      expect(result.data).toEqual([]);
      expect(result.headers.total).toBe(0);
    });
  });

  describe("getAllPostSlugs", () => {
    it("paginates through all pages", async () => {
      // Page 1
      mockFetch.mockResolvedValueOnce(
        mockResponse([{ slug: "post-1" }, { slug: "post-2" }], {
          headers: { "X-WP-Total": "3", "X-WP-TotalPages": "2" },
        })
      );
      // Page 2
      mockFetch.mockResolvedValueOnce(
        mockResponse([{ slug: "post-3" }], {
          headers: { "X-WP-Total": "3", "X-WP-TotalPages": "2" },
        })
      );

      const { getAllPostSlugs } = await import("@/lib/wordpress");
      const slugs = await getAllPostSlugs();

      expect(slugs).toEqual([
        { slug: "post-1" },
        { slug: "post-2" },
        { slug: "post-3" },
      ]);
      expect(mockFetch).toHaveBeenCalledTimes(2);
    });
  });

  describe("getAllPostsForSitemap", () => {
    it("returns slug, modified, and permalink path for all posts", async () => {
      mockFetch.mockResolvedValueOnce(
        mockResponse(
          [
            {
              slug: "a",
              modified: "2025-01-01",
              link: "https://www.gujrera.com/news/a/",
            },
            {
              slug: "b",
              modified: "2025-01-02",
              link: "https://www.gujrera.com/p/ahmedabad/b/",
            },
          ],
          {
            headers: { "X-WP-Total": "2", "X-WP-TotalPages": "1" },
          }
        )
      );

      const { getAllPostsForSitemap } = await import("@/lib/wordpress");
      const result = await getAllPostsForSitemap();

      expect(result).toEqual([
        { slug: "a", modified: "2025-01-01", path: "/news/a/" },
        { slug: "b", modified: "2025-01-02", path: "/p/ahmedabad/b/" },
      ]);
    });

    it("returns empty array on failure", async () => {
      mockFetch.mockRejectedValueOnce(new Error("fail"));

      const { getAllPostsForSitemap } = await import("@/lib/wordpress");
      const result = await getAllPostsForSitemap();

      expect(result).toEqual([]);
    });
  });

  describe("getAllCategories", () => {
    it("fetches categories with per_page=100", async () => {
      const categories = [{ id: 1, name: "News" }];
      mockFetch.mockResolvedValueOnce(mockResponse(categories));

      const { getAllCategories } = await import("@/lib/wordpress");
      const result = await getAllCategories();

      expect(result).toEqual(categories);
      const fetchUrl = mockFetch.mock.calls[0][0] as string;
      expect(fetchUrl).toContain("per_page=100");
    });

    it("returns empty array on failure", async () => {
      mockFetch.mockRejectedValueOnce(new Error("fail"));

      const { getAllCategories } = await import("@/lib/wordpress");
      const result = await getAllCategories();

      expect(result).toEqual([]);
    });
  });

  describe("getAllTags", () => {
    it("fetches tags with per_page=100", async () => {
      const tags = [{ id: 1, name: "JavaScript" }];
      mockFetch.mockResolvedValueOnce(mockResponse(tags));

      const { getAllTags } = await import("@/lib/wordpress");
      const result = await getAllTags();

      expect(result).toEqual(tags);
      const fetchUrl = mockFetch.mock.calls[0][0] as string;
      expect(fetchUrl).toContain("per_page=100");
    });
  });

  describe("getAllAuthors", () => {
    it("fetches authors with per_page=100", async () => {
      const authors = [{ id: 1, name: "Admin" }];
      mockFetch.mockResolvedValueOnce(mockResponse(authors));

      const { getAllAuthors } = await import("@/lib/wordpress");
      const result = await getAllAuthors();

      expect(result).toEqual(authors);
      const fetchUrl = mockFetch.mock.calls[0][0] as string;
      expect(fetchUrl).toContain("/users");
    });
  });

  describe("WordPressAPIError", () => {
    it("includes status and endpoint", async () => {
      mockFetch.mockResolvedValue(
        mockResponse(null, { ok: false, status: 404, statusText: "Not Found" })
      );

      const { getPostById, WordPressAPIError } = await import(
        "@/lib/wordpress"
      );

      await expect(getPostById(999)).rejects.toThrow(WordPressAPIError);
      await expect(getPostById(999)).rejects.toThrow("Not Found");
    });
  });

  describe("error handling", () => {
    it("getCategoryById throws on 404", async () => {
      mockFetch.mockResolvedValueOnce(
        mockResponse(null, { ok: false, status: 404, statusText: "Not Found" })
      );

      const { getCategoryById } = await import("@/lib/wordpress");
      await expect(getCategoryById(999)).rejects.toThrow("Not Found");
    });

    it("getAuthorById throws on 404", async () => {
      mockFetch.mockResolvedValueOnce(
        mockResponse(null, { ok: false, status: 404, statusText: "Not Found" })
      );

      const { getAuthorById } = await import("@/lib/wordpress");
      await expect(getAuthorById(999)).rejects.toThrow("Not Found");
    });
  });

  describe("fetch retry", () => {
    it("retries on 5xx then succeeds", async () => {
      const post = { id: 1, slug: "hello" };
      mockFetch
        .mockResolvedValueOnce(
          mockResponse(null, { ok: false, status: 503, statusText: "Unavailable" })
        )
        .mockResolvedValueOnce(
          mockResponse(null, { ok: false, status: 500, statusText: "Server Error" })
        )
        .mockResolvedValueOnce(mockResponse(post));

      const { getPostById } = await import("@/lib/wordpress");
      const result = await getPostById(1);

      expect(result).toEqual(post);
      expect(mockFetch).toHaveBeenCalledTimes(3);
    });

    it("does not retry on 4xx", async () => {
      mockFetch.mockResolvedValue(
        mockResponse(null, { ok: false, status: 404, statusText: "Not Found" })
      );

      const { getPostById } = await import("@/lib/wordpress");
      await expect(getPostById(999)).rejects.toThrow("Not Found");
      expect(mockFetch).toHaveBeenCalledTimes(1);
    });

    it("gives up after max retries on persistent 5xx", async () => {
      mockFetch.mockResolvedValue(
        mockResponse(null, { ok: false, status: 500, statusText: "Server Error" })
      );

      const { getPostById } = await import("@/lib/wordpress");
      await expect(getPostById(1)).rejects.toThrow("Server Error");
      // 1 initial attempt + 3 retries.
      expect(mockFetch).toHaveBeenCalledTimes(4);
    });
  });

  describe("linkToPath", () => {
    it("strips the origin from an absolute WordPress link", async () => {
      const { linkToPath } = await import("@/lib/wordpress");
      expect(linkToPath("https://www.gujrera.com/news/foo/")).toBe("/news/foo/");
    });

    it("preserves a nested category permalink", async () => {
      const { linkToPath } = await import("@/lib/wordpress");
      expect(linkToPath("https://www.gujrera.com/p/ahmedabad/bar/")).toBe(
        "/p/ahmedabad/bar/"
      );
    });

    it("adds a trailing slash when missing", async () => {
      const { linkToPath } = await import("@/lib/wordpress");
      expect(linkToPath("https://www.gujrera.com/news/foo")).toBe("/news/foo/");
    });

    it("accepts a bare path", async () => {
      const { linkToPath } = await import("@/lib/wordpress");
      expect(linkToPath("/tag/airport/")).toBe("/tag/airport/");
    });

    it("maps the root to /", async () => {
      const { linkToPath } = await import("@/lib/wordpress");
      expect(linkToPath("https://www.gujrera.com/")).toBe("/");
    });
  });

  describe("pathToSegments", () => {
    it("splits a nested path into non-empty segments", async () => {
      const { pathToSegments } = await import("@/lib/wordpress");
      expect(pathToSegments("/p/ahmedabad/bar/")).toEqual([
        "p",
        "ahmedabad",
        "bar",
      ]);
    });

    it("returns an empty array for the root", async () => {
      const { pathToSegments } = await import("@/lib/wordpress");
      expect(pathToSegments("/")).toEqual([]);
    });
  });

  describe("getPostByPath", () => {
    it("resolves a post when its link matches the request path", async () => {
      const post = {
        id: 1,
        slug: "foo",
        link: "https://www.gujrera.com/news/foo/",
      };
      mockFetch.mockResolvedValueOnce(mockResponse([post]));

      const { getPostByPath } = await import("@/lib/wordpress");
      const result = await getPostByPath("/news/foo/");

      expect(result).toEqual(post);
      const fetchUrl = mockFetch.mock.calls[0][0] as string;
      expect(fetchUrl).toContain("slug=foo");
    });

    it("returns undefined when the resolved link does not match the path", async () => {
      // Slug matches, but the post really lives under a different category.
      const post = {
        id: 1,
        slug: "foo",
        link: "https://www.gujrera.com/guide/foo/",
      };
      mockFetch.mockResolvedValueOnce(mockResponse([post]));

      const { getPostByPath } = await import("@/lib/wordpress");
      const result = await getPostByPath("/news/foo/");

      expect(result).toBeUndefined();
    });
  });
});
