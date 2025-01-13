# Next.js Starter for WordPress Headless CMS

> [Watch the Demo Video](https://www.youtube.com/watch?v=JZc1-BcOvYw)

![CleanShot 2025-01-07 at 23 18 41@2x](https://github.com/user-attachments/assets/8b268c36-eb0d-459f-b9f1-b5f129bd29bc)

[![Deploy with Vercel](https://vercel.com/button)](<https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2F9d8dev%2Fnext-wp&env=WORDPRESS_URL,WORDPRESS_HOSTNAME,WORDPRESS_WEBHOOK_SECRET&envDescription=Add%20WordPress%20URL%20with%20Rest%20API%20enabled%20(ie.%20https%3A%2F%2Fwp.example.com)%2C%20the%20hostname%20for%20Image%20rendering%20in%20Next%20JS%20(ie.%20wp.example.com)%2C%20and%20a%20secret%20key%20for%20secure%20revalidation&project-name=next-wp&repository-name=next-wp&demo-title=Next%20JS%20and%20WordPress%20Starter&demo-url=https%3A%2F%2Fwp.9d8.dev>)

This is a starter template for building a Next.js application that fetches data from a WordPress site using the WordPress REST API. The template includes functions for fetching posts, categories, tags, authors, and featured media from a WordPress site and rendering them in a Next.js application.

`next-wp` is built with [Next.js 15](https://nextjs.org/docs), [React](https://react.dev/), [Typescript](https://www.typescriptlang.org/docs/), [Tailwind](https://tailwindcss.com/), [shadcn/ui](https://ui.shadcn.com/docs), and [brijr/craft](https://github.com/brijr/craft). It pairs nicely with [brijr/components](https://components.bridger.to/) for a rapid development experience. Built by Cameron and Bridger at [9d8](https://9d8.dev).

## Table of Contents

- [Next.js Starter for WordPress Headless CMS](#nextjs-starter-for-wordpress-headless-cms)
  - [Table of Contents](#table-of-contents)
  - [Overview](#overview)
  - [WordPress Functions](#wordpress-functions)
  - [WordPress Types](#wordpress-types)
  - [Post Card Component](#post-card-component)
  - [Filter Component](#filter-component)
  - [Dynamic Sitemap](#dynamic-sitemap)
  - [Dynamic OG Images](#dynamic-og-images)
  - [Revalidation Setup](#revalidation-setup)
  - [Search Functionality](#search-functionality)

## Overview

### What's included?

✅ Type-safe data layer with the WordPress RestAPI<br>
✅ Granular access to revalidation and cache tags<br>
✅ Setup for all basic WordPress options: Posts, Pages, Authors, Categories, Tags<br>
✅ Easy integration with custom post types and ACF<br>
✅ Dynamic routes for Posts and Pages<br>
✅ Design system for layout and prose styling ([craft-ds.com](https://craft-ds.com))<br>
✅ Filter, Search, and Card components<br>
✅ Dynamically rendered sitemap<br>
✅ Dynamically generated metadata<br>
✅ Dynamically generated OG/Twitter Cards for Posts and pages<br>
✅ Responsive Nav and Footer components<br>
✅ Site configuration file<br>
✅ Menu configuration file<br>
✅ Lite and dark mode support<br>
✅ shadcn/ui components and theming<br>

### Important files

- `lib/wordpress.ts` -> Functions for fetching WordPress CMS via Rest API with cache tags
- `lib/wordpress.d.ts` -> Type declarations for the WordPress Rest API
- `components/craft.tsx` -> Handles the design system for the site and prose styling
- `components/posts/post-card.tsx` -> Component and styling for posts
- `components/posts/filter.tsx` -> Filter component for Posts
- `components/posts/search-input.tsx` -> Search component for Posts
- `menu.config.ts` -> Site nav menu configuration for desktop and mobile
- `site.config.ts` -> Configuration for `sitemap.ts` and more
- `app/sitemap.ts` -> Dynamically generated sitemap

The following environment variables are required in your `.env.local` file:

```bash
WORDPRESS_URL="https://wordpress.com"
WORDPRESS_HOSTNAME="wordpress.com"
WORDPRESS_WEBHOOK_SECRET="your-secret-key-here"
```

You can find the example of `.env.local` file in the `.env.example` file (and in Vercel).

## WordPress Functions

The `lib/wordpress.ts` file contains a comprehensive set of functions for interacting with the WordPress REST API. Each function is optimized for Next.js 15's caching system and includes proper error handling.

### Core Functionality

```typescript
// Default fetch options for all WordPress API calls
const defaultFetchOptions = {
  next: {
    tags: ["wordpress"],
    revalidate: 3600, // 1 hour cache
  },
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
};
```

### Available Functions

#### Posts

- `getAllPosts(filterParams?: { author?: string; tag?: string; category?: string; })`: Fetches posts with optional filtering by author, tag, or category. Uses cache tags for efficient revalidation.
- `getPostById(id: number)`: Retrieves a specific post by ID with proper error handling.
- `getPostBySlug(slug: string)`: Fetches a post using its URL-friendly slug.

#### Categories

- `getAllCategories()`: Retrieves all categories with cache invalidation support.
- `getCategoryById(id: number)`: Gets a specific category with error handling.
- `getCategoryBySlug(slug: string)`: Fetches a category by its slug.
- `getPostsByCategory(categoryId: number)`: Gets all posts in a category, using proper cache tags.

#### Tags

- `getAllTags()`: Fetches all available tags.
- `getTagById(id: number)`: Retrieves a specific tag.
- `getTagBySlug(slug: string)`: Gets a tag by its slug.
- `getTagsByPost(postId: number)`: Fetches all tags associated with a post.
- `getPostsByTag(tagId: number)`: Gets all posts with a specific tag.

#### Pages

- `getAllPages()`: Retrieves all WordPress pages.
- `getPageById(id: number)`: Gets a specific page by ID.
- `getPageBySlug(slug: string)`: Fetches a page by its slug.

#### Authors

- `getAllAuthors()`: Fetches all WordPress authors.
- `getAuthorById(id: number)`: Gets a specific author.
- `getAuthorBySlug(slug: string)`: Retrieves an author by slug.
- `getPostsByAuthor(authorId: number)`: Gets all posts by a specific author.

#### Media

- `getFeaturedMediaById(id: number)`: Retrieves featured media (images) with size information.

### Error Handling

All functions use the custom `WordPressAPIError` class for consistent error handling:

```typescript
class WordPressAPIError extends Error {
  constructor(
    message: string,
    public status: number,
    public endpoint: string,
  ) {
    super(message);
    this.name = "WordPressAPIError";
  }
}
```

### Cache Management

Each function supports Next.js 15's cache tags for efficient revalidation:

```typescript
// Example cache configuration
{
  next: {
    tags: ["wordpress", "posts", `post-${id}`],
    revalidate: 3600,
  }
}
```

### Usage Example

```typescript
try {
  // Fetch posts with filtering
  const posts = await getAllPosts({
    author: "123",
    category: "news",
    tag: "featured",
  });

  // Handle errors properly
} catch (error) {
  if (error instanceof WordPressAPIError) {
    console.error(`API Error: ${error.message} (${error.status})`);
  }
}
```

These functions are designed to work seamlessly with Next.js 15's App Router and provide proper TypeScript support through the types defined in `wordpress.d.ts`.

## WordPress Types

The `lib/wordpress.d.ts` file contains comprehensive TypeScript type definitions for WordPress entities. The type system is built around a core `WPEntity` interface that provides common properties for WordPress content:

```typescript
interface WPEntity {
  id: number;
  date: string;
  date_gmt: string;
  modified: string;
  modified_gmt: string;
  slug: string;
  status: "publish" | "future" | "draft" | "pending" | "private";
  link: string;
  guid: {
    rendered: string;
  };
}
```

Key type definitions include:

### Content Types

- `Post`: Blog posts and articles (extends `WPEntity`)
- `Page`: Static pages (extends `WPEntity`)
- `Author`: User information
- `Category`: Post categories (extends `Taxonomy`)
- `Tag`: Post tags (extends `Taxonomy`)
- `FeaturedMedia`: Media attachments (extends `WPEntity`)

### Shared Interfaces

- `RenderedContent`: For content with HTML rendering
- `RenderedTitle`: For titles with HTML rendering
- `Taxonomy`: Base interface for categories and tags

### Component Types

```typescript
interface FilterBarProps {
  authors: Author[];
  tags: Tag[];
  categories: Category[];
  selectedAuthor?: Author["id"];
  selectedTag?: Tag["id"];
  selectedCategory?: Category["id"];
  onAuthorChange?: (authorId: Author["id"] | undefined) => void;
  onTagChange?: (tagId: Tag["id"] | undefined) => void;
  onCategoryChange?: (categoryId: Category["id"] | undefined) => void;
}
```

### Media Types

```typescript
interface MediaDetails {
  width: number;
  height: number;
  file: string;
  sizes: Record<string, MediaSize>;
}

interface MediaSize {
  file: string;
  width: number;
  height: number;
  mime_type: string;
  source_url: string;
}
```

All types are designed to be:

- Fully type-safe
- Extensible
- Self-documenting
- Compatible with the WordPress REST API

## Post Card Component

The `components/posts/post-card.tsx` file contains the `PostCard` component, which is responsible for rendering a single post card in the application. Here's an overview of the component:

### Props

- `post`: A `Post` object representing the WordPress post to be rendered.

### Functionality

1. The component fetches the featured media, author, and category associated with the post using the `getFeaturedMediaById`, `getAuthorById`, and `getCategoryById` functions from `lib/wordpress.ts`.

2. It formats the post date using the `toLocaleDateString` method with the specified options.

3. The component renders a link to the individual post page using the post's slug.

4. Inside the link, it displays the post's featured image, title, excerpt, category, and date.

5. The post title and excerpt are rendered using the `dangerouslySetInnerHTML` attribute to handle HTML content.

6. The component applies various CSS classes to style the post card, including hover effects and transitions.

### Usage

To use the `PostCard` component, import it into your desired page or component and pass a `Post` object as the `post` prop.

## Filter Component

The `components/posts/filter.tsx` file contains the `FilterPosts` component, which provides a filtering interface for posts based on tags, categories, and authors. Here's an overview of the component:

### Props

- `authors`: An array of `Author` objects representing the available authors to filter by.
- `tags`: An array of `Tag` objects representing the available tags to filter by.
- `categories`: An array of `Category` objects representing the available categories to filter by.
- `selectedAuthor`: An optional string representing the currently selected author ID.
- `selectedTag`: An optional string representing the currently selected tag ID.
- `selectedCategory`: An optional string representing the currently selected category ID.

### Functionality

1. The component uses the `useRouter` hook from Next.js to handle navigation and URL updates based on the selected filters.

2. It renders three `Select` components for filtering posts by tag, category, and author. Each `Select` component displays the available options and allows the user to select a specific value or choose "All" to reset the filter.

3. When a filter value is changed, the `handleFilterChange` function is called with the filter type and selected value. It updates the URL query parameters accordingly and navigates to the updated URL.

4. The component also includes a "Reset Filters" button that, when clicked, calls the `handleResetFilters` function to navigate back to the `/posts` page without any filters applied.

5. The selected filter values are passed as props to the component and used to set the initial values of the `Select` components.

## Search Functionality

The template includes a powerful search system that works seamlessly with WordPress's REST API:

### Search Component

Located in `components/posts/search-input.tsx`, the SearchInput component provides real-time search capabilities:

```typescript
// Usage example
import { SearchInput } from "@/components/posts/search-input";

<SearchInput defaultValue={search} />
```

Features:

- Real-time search with 300ms debouncing
- URL-based state management
- Maintains filters while searching
- Server-side rendering for SEO
- Combines with existing category, tag, and author filters

### Search Implementation

The search system is implemented across several layers:

1. **Client-Side Component** (`search-input.tsx`):

   - Uses Next.js App Router's URL handling
   - Debounced input for better performance
   - Maintains search state in URL parameters

2. **Server-Side Processing** (`page.tsx`):

   - Handles search parameters server-side
   - Combines search with other filters
   - Parallel data fetching for better performance

3. **WordPress API Integration** (`wordpress.ts`):
   - Comprehensive search across:
     - Post content and titles
     - Author names
     - Category names
     - Tag names
   - Smart query construction
   - Filter combination support

### Search API Functions

The following search-related functions are available in `lib/wordpress.ts`:

```typescript
// Search posts with combined filters
getAllPosts({
  search?: string,
  author?: string,
  tag?: string,
  category?: string
})

// Search specific content types
searchCategories(query: string)
searchTags(query: string)
searchAuthors(query: string)
```

### Example Usage

```typescript
// In your page component
const { search } = await searchParams;
const posts = search ? await getAllPosts({ search }) : await getAllPosts();
```

The search functionality automatically updates filters and results as you type, providing a smooth user experience while maintaining good performance through debouncing and server-side rendering.

## Dynamic OG Images

This starter includes automatic OG image generation for both posts and pages. The OG images are generated on-demand using the Edge Runtime and include:

- Dynamic title and description
- Modern, responsive design
- Proper social media card sizes
- Automatic text wrapping and scaling

You can test the OG image generation by visiting:

```
/api/og?title=Your Title&description=Your Description
```

The OG images are automatically generated for:

- Blog posts: `/posts/[slug]`
- Pages: `/pages/[slug]`

Each OG image includes:

- The post/page title
- A snippet of the content (automatically trimmed and cleaned)
- Consistent branding across your site
- Proper dimensions for social media platforms

## Dynamic Sitemap

The sitemap for `next-wp` is generated at `@/app/sitemap.ts` and will appear live on your site at `yourdomain.com/sitemap.xml`. In order to set up your sitemap correctly please make sure to update the `site_domain` in the `site.config.ts` to be the domain of your frontend (not your WordPress instance).

## Revalidation Setup

This starter implements an intelligent caching and revalidation system using Next.js 15's cache tags. Here's how it works:

### Cache Tags System

The WordPress API functions use a hierarchical cache tag system:

- Global tag: `wordpress` (affects all content)
- Content type tags: `posts`, `pages`, `categories`, etc.
- Individual item tags: `post-123`, `category-456`, etc.

### Automatic Revalidation

1. **Install the WordPress Plugin:**

   - Navigate to `wordpress/next-revalidate/`
   - Create a zip file of the folder
   - Install and activate through WordPress admin
   - Go to Settings > Next.js Revalidation
   - Configure your Next.js URL and webhook secret

2. **Configure Next.js:**

   - Add `WORDPRESS_WEBHOOK_SECRET` to your environment variables
   - The webhook endpoint at `/api/revalidate` is already set up
   - No additional configuration needed

3. **How it Works:**
   - When content is updated in WordPress, the plugin sends a webhook
   - The webhook includes content type and ID information
   - Next.js automatically revalidates the appropriate cache tags
   - Only affected content is updated, maintaining performance

### Manual Revalidation

You can also manually revalidate content using the `revalidateWordPressData` function:

```typescript
// Revalidate all WordPress content
await revalidateWordPressData();

// Revalidate specific content types
await revalidateWordPressData(["posts"]);
await revalidateWordPressData(["categories"]);

// Revalidate specific items
await revalidateWordPressData(["post-123"]);
await revalidateWordPressData(["category-456"]);
```

This system ensures your content stays fresh while maintaining optimal performance through intelligent caching.

Built by [Bridger Tower](https://twitter.com/bridgertower) and [Cameron Youngblood](https://twitter.com/youngbloodcyb) at [9d8](https://9d8.dev)
