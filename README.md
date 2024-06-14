# Next.js Starter for Wordpress Headless CMS

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2F9d8dev%2Fnext-wp&env=WORDPRESS_URL,WORDPRESS_HOSTNAME&envDescription=Add%20Wordpress%20URL%20with%20Rest%20API%20enabled%20(ie.%20https%3A%2F%2Fwp.example.com)%20abd%20the%20hostname%20for%20Image%20rendering%20in%20Next%20JS%20(ie.%20wp.example.com)&project-name=next-wp&repository-name=next-wp&demo-title=Next%20JS%20and%20WordPress%20Starter&demo-url=https%3A%2F%2Fwp.9d8.dev)

- `lib/wordpress.ts` -> Functions for fetching WordPress CMS via Rest API
- `lib/wordpress.d.ts` -> Type declarations for WP Rest API
- `components/posts/post-card.tsx` -> Component and styling for posts
- `app/posts/filter.tsx` -> Component for handling filtering of posts

There are two `env` variables are required to be set in `.env.local` file:

```bash
WORDPRESS_URL="https://wordpress.com"
WORDPRESS_HOSTNAME="wordpress.com"
```

You can find the exampple of `.env.local` file in the `.env.example` file (and in Vercel):

## Wordpress Functions

The `lib/wordpress.ts` file contains several functions for fetching data from a WordPress site using the WordPress REST API. Here's a brief overview of each function:

- `getAllPosts(filterParams?: { author?: string; tag?: string; category?: string; })`: Fetches all posts from the WordPress site. Optionally, you can pass filter parameters to filter posts by author, tag, or category.

- `getPostById(id: number)`: Fetches a single post by its ID.

- `getPostBySlug(slug: string)`: Fetches a single post by its slug.

- `getAllCategories()`: Fetches all categories from the WordPress site.

- `getCategoryById(id: number)`: Fetches a single category by its ID.

- `getCategoryBySlug(slug: string)`: Fetches a single category by its slug.

- `getPostsByCategory(categoryId: number)`: Fetches all posts belonging to a specific category by its ID.

- `getPostsByTag(tagId: number)`: Fetches all posts tagged with a specific tag by its ID.

- `getTagsByPost(postId: number)`: Fetches all tags associated with a specific post by its ID.

- `getAllTags()`: Fetches all tags from the WordPress site.

- `getTagById(id: number)`: Fetches a single tag by its ID.

- `getTagBySlug(slug: string)`: Fetches a single tag by its slug.

- `getAllPages()`: Fetches all pages from the WordPress site.

- `getPageById(id: number)`: Fetches a single page by its ID.

- `getPageBySlug(slug: string)`: Fetches a single page by its slug.

- `getAllAuthors()`: Fetches all authors from the WordPress site.

- `getAuthorById(id: number)`: Fetches a single author by their ID.

- `getAuthorBySlug(slug: string)`: Fetches a single author by their slug.

- `getPostsByAuthor(authorId: number)`: Fetches all posts written by a specific author by their ID.

- `getPostsByAuthorSlug(authorSlug: string)`: Fetches all posts written by a specific author by their slug.

- `getPostsByCategorySlug(categorySlug: string)`: Fetches all posts belonging to a specific category by its slug.

- `getPostsByTagSlug(tagSlug: string)`: Fetches all posts tagged with a specific tag by its slug.

- `getFeaturedMediaById(id: number)`: Fetches the featured media (e.g., featured image) by its ID.

These functions provide a convenient way to interact with the WordPress REST API and retrieve various types of data from your WordPress site. They can be used in your Next.js application to fetch and display WordPress content.

## WordPress Types

The `lib/wordpress.d.ts` file contains TypeScript type definitions for various WordPress entities and related data structures. Here's an overview of the main types:

- `Post`: Represents a WordPress post with properties such as `id`, `title`, `content`, `excerpt`, `author`, `categories`, `tags`, and more.

- `Category`: Represents a WordPress category with properties like `id`, `name`, `slug`, `description`, `parent`, and `count`.

- `Tag`: Represents a WordPress tag with properties similar to `Category`, including `id`, `name`, `slug`, `description`, and `count`.

- `Page`: Represents a WordPress page with properties like `id`, `title`, `content`, `excerpt`, `author`, `parent`, and `template`.

- `Author`: Represents a WordPress author with properties such as `id`, `name`, `slug`, `description`, `avatar_urls`, and `meta`.

- `BlockType`: Represents a WordPress block type with properties like `name`, `title`, `description`, `icon`, `category`, `attributes`, and more.

- `EditorBlock`: Represents a block in the WordPress editor with properties like `id`, `name`, `attributes`, `innerBlocks`, and `innerHTML`.

- `TemplatePart`: Represents a template part in WordPress with properties such as `id`, `slug`, `theme`, `type`, `content`, `title`, and `status`.

- `SearchResult`: Represents a search result from WordPress with properties like `id`, `title`, `url`, `type`, and `subtype`.

- `FeaturedMedia`: Represents featured media (e.g., featured image) in WordPress with properties like `id`, `title`, `caption`, `alt_text`, `media_details`, and `source_url`.

- `FilterBarProps`: Represents the props for a filter bar component with properties `authors`, `tags`, `categories`, and selected values for each.

These type definitions provide type safety and autocompletion when working with WordPress data in your Next.js application. They ensure that you are accessing the correct properties and passing the expected data types when interacting with the WordPress REST API.

## Post Card Component

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
