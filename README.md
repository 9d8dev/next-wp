# Next WP

A modern headless WordPress starter built with Next.js 16, React 19, and TypeScript.

[![Deploy on Railway](https://railway.com/button.svg)](https://railway.com/deploy/04y-xq?referralCode=AJtQpy&utm_medium=integration&utm_source=template&utm_campaign=generic)
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2F9d8dev%2Fnext-wp&env=WORDPRESS_URL,WORDPRESS_HOSTNAME,WORDPRESS_WEBHOOK_SECRET&envDescription=Add%20WordPress%20URL%20with%20Rest%20API%20enabled%20(ie.%20https%3A%2F%2Fwp.example.com)%2C%20the%20hostname%20for%20Image%20rendering%20in%20Next%20JS%20(ie.%20wp.example.com)%2C%20and%20a%20secret%20key%20for%20secure%20revalidation&project-name=next-wp&repository-name=next-wp&demo-title=Next%20JS%20and%20WordPress%20Starter&demo-url=https%3A%2F%2Fwp.9d8.dev)

![Next WP Screenshot](https://github.com/user-attachments/assets/8b268c36-eb0d-459f-b9f1-b5f129bd29bc)

> **[Live Demo](https://wp.9d8.dev)** | **[Video Tutorial](https://www.youtube.com/watch?v=JZc1-BcOvYw)** | **[Headless Theme (761)](https://github.com/9d8dev/761)**

## Quick Start

```bash
# Clone the repository
git clone https://github.com/9d8dev/next-wp.git
cd next-wp

# Install dependencies
pnpm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your WordPress URL and credentials

# Start development server
pnpm dev
```

Your site is now running at `http://localhost:3000`.

## Prerequisites

- **Node.js** 18.17 or later
- **pnpm** 8.0 or later (recommended) or npm/yarn
- **WordPress** site with REST API enabled (default in WordPress 4.7+)

## Environment Variables

Create a `.env.local` file in the root directory:

```bash
WORDPRESS_URL="https://your-wordpress-site.com"    # Full WordPress URL
WORDPRESS_HOSTNAME="your-wordpress-site.com"       # Domain for image optimization
WORDPRESS_WEBHOOK_SECRET="your-secret-key-here"    # Secret for cache revalidation
```

## Features

- **Type-safe WordPress API** - Full TypeScript support with comprehensive type definitions
- **Server-side pagination** - Efficient handling of large content libraries
- **Automatic cache revalidation** - WordPress plugin for instant updates
- **Dynamic routes** - Posts, pages, authors, categories, and tags
- **Search & filtering** - Real-time search with debouncing
- **Dynamic sitemap** - Auto-generated XML sitemap
- **OG image generation** - Dynamic social media cards
- **Dark mode** - Built-in theme switching
- **shadcn/ui components** - Beautiful, accessible UI components
- **Responsive design** - Mobile-first with Tailwind CSS v4

## Project Structure

```
next-wp/
├── app/                      # Next.js App Router
│   ├── api/
│   │   ├── og/              # OG image generation
│   │   └── revalidate/      # Cache revalidation webhook
│   ├── pages/[slug]/        # Dynamic WordPress pages
│   ├── posts/
│   │   ├── [slug]/          # Individual post pages
│   │   ├── authors/         # Author archive
│   │   ├── categories/      # Category archive
│   │   └── tags/            # Tag archive
│   ├── layout.tsx           # Root layout
│   ├── page.tsx             # Homepage
│   └── sitemap.ts           # Dynamic sitemap
├── components/
│   ├── posts/               # Post-related components
│   │   ├── post-card.tsx    # Post card component
│   │   ├── filter.tsx       # Filter controls
│   │   └── search-input.tsx # Search component
│   ├── nav/                 # Navigation components
│   ├── theme/               # Theme toggle
│   └── ui/                  # shadcn/ui components
├── lib/
│   ├── wordpress.ts         # WordPress API functions
│   └── wordpress.d.ts       # TypeScript definitions
├── plugin/                  # WordPress revalidation plugin
├── menu.config.ts           # Navigation configuration
├── site.config.ts           # Site metadata
└── CLAUDE.md               # AI assistant guidelines
```

## Deployment

### Railway (Recommended)

Railway deploys the complete stack with one click: MySQL + WordPress + Next.js.

1. Click the **Deploy on Railway** button above
2. Wait for deployment to complete
3. Access WordPress admin at `https://your-wordpress.up.railway.app/wp-admin`
4. Complete the WordPress installation wizard
5. Install the revalidation plugin from `/plugin/next-revalidate.zip`
6. Configure the plugin at Settings > Next.js Revalidation

### Vercel

1. Click the **Deploy with Vercel** button above
2. Fill in environment variables:
   - `WORDPRESS_URL` - Your existing WordPress site URL
   - `WORDPRESS_HOSTNAME` - WordPress domain (for images)
   - `WORDPRESS_WEBHOOK_SECRET` - Generate a secure random string
3. Deploy and wait for build to complete
4. Install the revalidation plugin on your WordPress site
5. Configure the plugin with your Vercel deployment URL

### Local Development

```bash
# Install dependencies
pnpm install

# Copy environment template
cp .env.example .env.local

# Configure your WordPress connection in .env.local
# Then start the dev server
pnpm dev
```

**Required:** Your WordPress site must have the REST API enabled (default since WP 4.7).

## WordPress API Functions

All WordPress interactions are centralized in `lib/wordpress.ts`:

### Posts
```typescript
getAllPosts(filters?)        // Get all posts (max 100)
getPostsPaginated(page, perPage, filters?)  // Paginated posts
getPostBySlug(slug)          // Single post by slug
getPostById(id)              // Single post by ID
```

### Taxonomies
```typescript
getAllCategories()           // All categories
getCategoryBySlug(slug)      // Category by slug
getAllTags()                 // All tags
getTagBySlug(slug)           // Tag by slug
getPostsByCategory(id)       // Posts in category
getPostsByTag(id)            // Posts with tag
```

### Authors & Pages
```typescript
getAllAuthors()              // All authors
getAuthorBySlug(slug)        // Author by slug
getPostsByAuthor(id)         // Posts by author
getAllPages()                // All pages
getPageBySlug(slug)          // Page by slug
```

### Example Usage
```typescript
import { getPostsPaginated } from "@/lib/wordpress";

const { data: posts, headers } = await getPostsPaginated(1, 9, {
  category: "news",
  search: "nextjs"
});

console.log(`Found ${headers.total} posts across ${headers.totalPages} pages`);
```

## Cache Revalidation

The starter uses Next.js cache tags for efficient revalidation:

1. **Install the plugin** - Upload `/plugin/next-revalidate.zip` to WordPress
2. **Configure** - Go to Settings > Next.js Revalidation
3. **Set URL** - Enter your Next.js site URL
4. **Set secret** - Use the same `WORDPRESS_WEBHOOK_SECRET` value

When content changes in WordPress, only affected pages are revalidated.

## Customization

### Site Configuration

Edit `site.config.ts` for site metadata:

```typescript
export const siteConfig = {
  site_name: "Your Site",
  site_domain: "yourdomain.com",
  site_description: "Your site description"
};
```

### Navigation

Edit `menu.config.ts` for navigation links:

```typescript
export const mainMenu = [
  { href: "/", label: "Home" },
  { href: "/posts", label: "Blog" },
  // Add more links...
];
```

### Theming

This project uses shadcn/ui with Tailwind CSS. Customize colors in your CSS or update the shadcn theme.

## Troubleshooting

### REST API not accessible
- Ensure your WordPress site is publicly accessible
- Check that permalinks are set (Settings > Permalinks)
- Verify REST API at `your-site.com/wp-json/wp/v2/posts`

### Images not loading
- Add your WordPress domain to `WORDPRESS_HOSTNAME`
- Check `next.config.ts` has the correct `remotePatterns`

### Revalidation not working
- Verify `WORDPRESS_WEBHOOK_SECRET` matches in both WordPress and Next.js
- Check the plugin is activated in WordPress
- Test the webhook endpoint at `/api/revalidate`

### CORS errors
- Install a CORS plugin on WordPress, or
- Configure your server to allow requests from your Next.js domain

## Scripts

```bash
pnpm dev       # Start development server
pnpm build     # Build for production
pnpm start     # Start production server
pnpm lint      # Run ESLint
```

## Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

MIT License - see [LICENSE](LICENSE) for details.

## Credits

Built with [Next.js](https://nextjs.org/), [Tailwind CSS](https://tailwindcss.com/), [shadcn/ui](https://ui.shadcn.com/), and [brijr/craft](https://craft-ds.com).

Created by [Bridger Tower](https://twitter.com/bridgertower) and [Cameron Youngblood](https://twitter.com/youngbloodcyb) at [9d8](https://9d8.dev).
