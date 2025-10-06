# Quick Reference - DapFlow

## Environment URLs

| Environment | URL | Branch | Purpose |
|-------------|-----|--------|---------|
| **Production** | https://dapflow.com | `main` | Live site |
| **Staging** | https://stage.dapflow.com | `staging` | Pre-production testing |
| **Development** | https://dev.dapflow.com | `develop` | Active development |
| **Feature Preview** | Auto-generated | `feature/*` | Individual feature testing |

## Essential Commands

### Development
```bash
pnpm dev          # Start development server (localhost:3000)
pnpm build        # Production build
pnpm start        # Production server
pnpm lint         # ESLint checking
```

### Git Workflow
```bash
# Start feature
git checkout develop
git pull origin develop
git checkout -b feature/feature-name

# Commit and push
git add .
git commit -m "feat: description"
git push -u origin feature/feature-name

# Deploy to staging
git checkout staging
git merge develop
git push origin staging

# Deploy to production
git checkout main
git merge staging
git push origin main
```

## Environment Variables

### Required Variables
```bash
WORDPRESS_URL="https://cms.dapflow.com"
WORDPRESS_HOSTNAME="cms.dapflow.com"
WORDPRESS_WEBHOOK_SECRET="your-secure-secret"
```

### Vercel Environment Setup
- **Production**: Set for `main` branch
- **Preview**: Set for `staging`, `develop`, `feature/*` branches
- **Development**: Set for local development

## WordPress API Functions

### Core Functions (`lib/wordpress.ts`)
```typescript
// Posts
getAllPosts(filterParams?)           // All posts with filtering
getPostsPaginated(page?, perPage?)   // Server-side pagination (recommended)
getPostBySlug(slug)                  // Single post by slug
getPostById(id)                      // Single post by ID

// Taxonomies
getAllCategories()                   // All categories
getAllTags()                         // All tags
getAllAuthors()                      // All authors

// Media
getFeaturedMediaById(id)             // Featured image with sizes

// Filtering
getPostsByCategory(categoryId)       // Posts in category
getPostsByTag(tagId)                 // Posts with tag
getPostsByAuthor(authorId)           // Posts by author
```

### Filter Parameters
```typescript
interface FilterParams {
  author?: string;     // Author ID
  category?: string;   // Category ID
  tag?: string;        // Tag ID
  search?: string;     // Search query
}
```

## Cache Tags

### Global Tags
- `wordpress` - All WordPress content

### Content Type Tags
- `posts` - All posts
- `categories` - All categories
- `tags` - All tags
- `authors` - All authors

### Individual Item Tags
- `post-{id}` - Specific post
- `category-{id}` - Specific category
- `tag-{id}` - Specific tag
- `author-{id}` - Specific author

### Pagination Tags
- `posts-page-{page}` - Specific page
- `posts-search` - Search results
- `posts-category-{id}` - Category-filtered posts
- `posts-tag-{id}` - Tag-filtered posts
- `posts-author-{id}` - Author-filtered posts

## Manual Revalidation

```typescript
import { revalidateTag } from "next/cache";

// Revalidate all WordPress content
revalidateTag("wordpress");

// Revalidate specific content
revalidateTag("posts");
revalidateTag("post-123");
revalidateTag("posts-page-1");
```

## Component Props

### PostCard Component
```typescript
interface PostCardProps {
  post: Post;
}
```

### FilterPosts Component
```typescript
interface FilterPostsProps {
  authors: Author[];
  tags: Tag[];
  categories: Category[];
  selectedAuthor?: string;
  selectedTag?: string;
  selectedCategory?: string;
  onAuthorChange?: (authorId: string | undefined) => void;
  onTagChange?: (tagId: string | undefined) => void;
  onCategoryChange?: (categoryId: string | undefined) => void;
}
```

### SearchInput Component
```typescript
interface SearchInputProps {
  defaultValue?: string;
}
```

## WordPress Types

### Core Types
```typescript
interface Post {
  id: number;
  title: RenderedContent;
  content: RenderedContent;
  excerpt: RenderedContent;
  slug: string;
  date: string;
  modified: string;
  featured_media: number;
  author: number;
  categories: number[];
  tags: number[];
}

interface Category {
  id: number;
  name: string;
  slug: string;
  description: string;
  count: number;
}

interface Tag {
  id: number;
  name: string;
  slug: string;
  description: string;
  count: number;
}

interface Author {
  id: number;
  name: string;
  slug: string;
  description: string;
  avatar_urls: Record<string, string>;
}
```

## API Endpoints

### WordPress REST API
```bash
# Posts
GET https://cms.dapflow.com/wp-json/wp/v2/posts
GET https://cms.dapflow.com/wp-json/wp/v2/posts/{id}

# Categories
GET https://cms.dapflow.com/wp-json/wp/v2/categories

# Tags
GET https://cms.dapflow.com/wp-json/wp/v2/tags

# Authors
GET https://cms.dapflow.com/wp-json/wp/v2/users

# Media
GET https://cms.dapflow.com/wp-json/wp/v2/media/{id}
```

### Next.js API Routes
```bash
# OG Image Generation
GET /api/og?title={title}&description={description}

# Cache Revalidation
POST /api/revalidate
```

## File Structure

```
app/
├── layout.tsx              # Root layout
├── page.tsx                # Homepage
├── posts/
│   ├── page.tsx            # Posts listing
│   └── [slug]/page.tsx     # Individual posts
├── pages/
│   └── [slug]/page.tsx     # WordPress pages
├── api/
│   ├── og/route.tsx        # OG images
│   └── revalidate/route.ts # Cache revalidation
└── sitemap.ts              # Dynamic sitemap

components/
├── posts/
│   ├── post-card.tsx       # Post display
│   ├── filter.tsx          # Post filtering
│   └── search-input.tsx    # Search functionality
├── nav/                    # Navigation components
├── ui/                     # Reusable UI components
└── theme/                  # Theme management

lib/
├── wordpress.ts            # WordPress API functions
├── wordpress.d.ts          # TypeScript definitions
└── utils.ts                # Utility functions
```

## Configuration Files

### Site Configuration (`site.config.ts`)
```typescript
export const siteConfig = {
  site_name: "DapFlow",
  site_description: "Headless WordPress with Next.js for DapFlow",
  site_domain: "https://dapflow.com",
};
```

### Menu Configuration (`menu.config.ts`)
```typescript
// Desktop and mobile navigation structure
// Links to posts, pages, categories, tags, authors
```

### Next.js Configuration (`next.config.ts`)
```typescript
// Image domains, redirects, headers
```

### Tailwind Configuration (`tailwind.config.ts`)
```typescript
// Theme customization, plugins
```

## Troubleshooting Quick Fixes

### Build Errors
1. Check environment variables in Vercel
2. Fix TypeScript errors locally
3. Clear cache: `rm -rf .next`
4. Reinstall dependencies: `pnpm install`

### WordPress Connection Issues
1. Verify `WORDPRESS_URL` is correct
2. Check WordPress REST API is enabled
3. Test API endpoint directly
4. Check for CORS issues

### Cache Issues
1. Test webhook endpoint: `POST /api/revalidate`
2. Manual revalidation: `revalidateTag("wordpress")`
3. Check cache tags in code
4. Verify WordPress plugin settings

### Deployment Issues
1. Check Vercel deployment logs
2. Verify branch configuration
3. Ensure environment variables are set
4. Check for build errors

## Performance Optimization

### Recommended Settings
- Use `getPostsPaginated` instead of `getAllPosts`
- Enable Next.js Image optimization
- Set appropriate cache headers
- Use server-side rendering where possible

### Monitoring
- Vercel Analytics for performance
- Core Web Vitals tracking
- Error rate monitoring
- API response time tracking

## Security Checklist

- [ ] Environment variables secured
- [ ] Webhook secret configured
- [ ] HTTPS enforced
- [ ] Input validation in place
- [ ] WordPress REST API secured
- [ ] No sensitive data in client code
