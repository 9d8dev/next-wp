# Next.js Starter for WordPress Headless CMS

> [Watch the Demo Video](https://www.youtube.com/watch?v=JZc1-BcOvYw)

![WordPress_Next_js Starter by 9d8](https://github.com/9d8dev/next-wp/assets/57158102/76daa171-d286-4bd7-ae72-837c0d911f7a)

[![Deploy with Vercel](https://vercel.com/button)](<https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2F9d8dev%2Fnext-wp&env=WORDPRESS_URL,WORDPRESS_HOSTNAME&envDescription=Add%20WordPress%20URL%20with%20Rest%20API%20enabled%20(ie.%20https%3A%2F%2Fwp.example.com)%20abd%20the%20hostname%20for%20Image%20rendering%20in%20Next%20JS%20(ie.%20wp.example.com)&project-name=next-wp&repository-name=next-wp&demo-title=Next%20JS%20and%20WordPress%20Starter&demo-url=https%3A%2F%2Fwp.9d8.dev>)

This is a starter template for building a Next.js application that fetches data from a WordPress site using the WordPress REST API. The template includes functions for fetching posts, categories, tags, authors, and featured media from a WordPress site and rendering them in a Next.js application.

`next-wp` is built with [Next.js 14](https://nextjs.org/docs), [React](https://react.dev/), [Typescript](https://www.typescriptlang.org/docs/), [Tailwind](https://tailwindcss.com/), [shadcn/ui](https://ui.shadcn.com/docs), and [brijr/craft](https://github.com/brijr/craft). It pairs nicely with [brijr/components](https://components.bridger.to/) for a rapid development experience. Built by Cameron and Bridger at [9d8](https://9d8.dev).

## Table of Contents

- [Next.js Starter for WordPress Headless CMS](#nextjs-starter-for-wordpress-headless-cms)
  - [Table of Contents](#table-of-contents)
  - [Overview](#overview)
  - [WordPress Functions](#wordpress-functions)
  - [WordPress Types](#wordpress-types)
  - [Post Card Component](#post-card-component)
    - [Props](#props)
    - [Functionality](#functionality)
    - [Usage](#usage)
  - [Filter Component](#filter-component)
    - [Props](#props-1)
    - [Functionality](#functionality-1)
  - [Dynamic Sitemap](#dynamic-sitemap)

## Overview

- `lib/wordpress.ts` -> Functions for fetching WordPress CMS via Rest API
- `lib/wordpress.d.ts` -> Type declarations for WP Rest API
- `components/posts/post-card.tsx` -> Component and styling for posts
- `app/posts/filter.tsx` -> Component for handling filtering of posts
- `/menu.config.ts` -> Site nav menu configuration for desktop and mobile
- `/site.config.ts` -> Configuration for `sitemap.ts`
- `app/sitemap.ts` -> Dynamically generated sitemap

There are two `env` variables are required to be set in `.env.local` file:

```bash
WORDPRESS_URL="https://wordpress.com"
WORDPRESS_HOSTNAME="wordpress.com"
```

You can find the example of `.env.local` file in the `.env.example` file (and in Vercel):

## WordPress Functions

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

6. The selected filter values are passed as props to the component and used to set the initial values of the `Select` components.

7. The selected filter values are passed as props to the component and used to set the initial values of the `Select` components.

## Dynamic Site Map

The sitemap for `next-wp` is generated at `@/app/sitemap.ts` and will appear live on your site at `yourdomain.com/sitemap.xml`. In order to set up your sitemap correctly please make sure to update the `site_domain` in the `site.config.ts` to be the domain of your frontend (not your WordPress instance).

Built by [Bridger Tower](https://twitter.com/bridgertower) and [Cameron Youngblood](https://twitter.com/youngbloodcyb) at [9d8](https://9d8.dev)
