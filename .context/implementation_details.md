# Implementation Details - DapFlow

## Technical Specifications

### WordPress API Integration

#### Core Functions (`lib/wordpress.ts`)
```typescript
// Default fetch configuration
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

#### Key API Functions
- `getAllPosts(filterParams?)`: Fetches posts with optional filtering (limited to 100 posts)
- `getPostsPaginated(page?, perPage?, filterParams?)`: **Recommended** - Server-side pagination
- `getPostBySlug(slug)`: Individual post retrieval
- `getAllCategories()`, `getAllTags()`, `getAllAuthors()`: Taxonomy data
- `getFeaturedMediaById(id)`: Media retrieval with size information

#### Cache Tag Hierarchy
```typescript
// Global tags
["wordpress"]

// Content type tags
["posts", "categories", "tags", "authors"]

// Pagination-specific tags
["posts-page-1", "posts-page-2", "posts-search", "posts-author-123"]

// Individual item tags
["post-123", "category-456", "tag-789", "author-123"]
```

### Next.js Configuration

#### App Router Structure
```
app/
├── layout.tsx              # Root layout with theme provider
├── page.tsx                # Homepage
├── globals.css             # Global styles
├── posts/
│   ├── page.tsx            # Posts listing with pagination
│   ├── [slug]/page.tsx     # Individual post pages
│   ├── authors/page.tsx    # Authors listing
│   ├── categories/page.tsx # Categories listing
│   └── tags/page.tsx       # Tags listing
├── pages/
│   └── [slug]/page.tsx     # WordPress pages
├── api/
│   ├── og/route.tsx        # Dynamic OG image generation
│   └── revalidate/route.ts # Webhook endpoint for cache invalidation
├── sitemap.ts              # Dynamic sitemap generation
└── robots.txt              # SEO configuration
```

#### Dynamic Features
- **OG Images**: Generated on-demand using Edge Runtime
- **Sitemap**: Auto-generated from WordPress content
- **Metadata**: Dynamic meta tags for SEO

### Component Architecture

#### Design System Components (`components/ui/`)
- Built on Radix UI primitives
- Tailwind CSS styling
- TypeScript support with proper prop types
- Accessibility-first design

#### Post Components (`components/posts/`)
- `PostCard`: Individual post display with featured image, excerpt, metadata
- `FilterPosts`: Category, tag, and author filtering
- `SearchInput`: Real-time search with 300ms debouncing

#### Theme System (`components/theme/`)
- `ThemeProvider`: Context-based theme management
- `ThemeToggle`: Dark/light mode switcher
- CSS variables for consistent theming

### Search Implementation

#### Client-Side Component
```typescript
// components/posts/search-input.tsx
- Debounced input (300ms)
- URL-based state management
- Maintains existing filters
- Server-side rendering compatible
```

#### Server-Side Processing
```typescript
// WordPress API integration
- Search across post content, titles, author names
- Category and tag name search
- Smart query construction
- Filter combination support
```

### Pagination System

#### Server-Side Pagination
```typescript
interface WordPressResponse<T> {
  data: T;
  headers: {
    total: number;
    totalPages: number;
  };
}
```

#### Benefits
- Performance: Only fetch needed posts (9 vs 100+)
- Memory efficiency: Reduced memory usage
- Network optimization: 90% smaller payloads
- Scalability: Handles thousands of posts

### Revalidation System

#### WordPress Plugin Integration
- Plugin location: `/plugin/next-revalidate/`
- Automatic webhook triggers on content changes
- Granular cache invalidation based on content type
- Manual revalidation option available

#### Webhook Endpoint
```typescript
// app/api/revalidate/route.ts
- Validates webhook secret
- Determines content type and ID
- Revalidates specific cache tags
- Returns appropriate HTTP status
```

### Environment Configuration

#### Environment Variables
```bash
WORDPRESS_URL="https://cms.dapflow.com"
WORDPRESS_HOSTNAME="cms.dapflow.com"
WORDPRESS_WEBHOOK_SECRET="secure-random-string"
```

#### Site Configuration (`site.config.ts`)
```typescript
export const siteConfig = {
  site_name: "DapFlow",
  site_description: "Headless WordPress with Next.js for DapFlow",
  site_domain: "https://dapflow.com",
};
```

#### Menu Configuration (`menu.config.ts`)
```typescript
// Desktop and mobile navigation structure
- Home link
- Posts section
- Pages section
- Categories/Tags/Authors links
- Theme toggle
```

### Build and Development

#### Package Manager
- **pnpm**: Fast, efficient package management
- **Lockfile**: `pnpm-lock.yaml` for reproducible builds

#### Development Commands
```bash
pnpm dev          # Development server
pnpm build        # Production build
pnpm start        # Production server
pnpm lint         # ESLint checking
```

#### TypeScript Configuration
- Strict mode enabled
- Path mapping for clean imports
- WordPress API types included
- Component prop validation

### Performance Optimizations

#### Image Optimization
- Next.js Image component for automatic optimization
- Multiple size variants from WordPress
- Lazy loading and responsive images
- WebP format support

#### Code Splitting
- Automatic route-based code splitting
- Dynamic imports for heavy components
- Tree shaking for unused code elimination

#### Caching Strategy
- Static generation where possible
- Incremental Static Regeneration (ISR)
- Edge caching with Vercel
- Browser caching with proper headers

### Error Handling

#### WordPress API Errors
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

#### Error Boundaries
- React error boundaries for component errors
- Graceful fallbacks for failed API calls
- User-friendly error messages
- Development vs production error display

### SEO Implementation

#### Dynamic Metadata
- Page-specific meta titles and descriptions
- Open Graph tags for social sharing
- Twitter Card support
- Canonical URLs

#### Structured Data
- JSON-LD schema for posts and pages
- Breadcrumb navigation
- Author and organization markup

#### Performance SEO
- Core Web Vitals optimization
- Lighthouse score optimization
- Mobile-first responsive design
- Fast loading times

### Security Implementation

#### API Security
- Webhook secret validation
- Environment variable protection
- Input sanitization
- Rate limiting considerations

#### Content Security
- XSS prevention with proper escaping
- CSRF protection built into Next.js
- Secure headers configuration
- HTTPS enforcement

### Testing Strategy

#### Test Organization
```
tests/
├── api/           # API endpoint tests
├── auth/          # Authentication tests
└── workflow/      # Workflow and integration tests
```

#### Testing Types
- Unit tests for utility functions
- Integration tests for API calls
- Component tests for UI elements
- End-to-end tests for critical user flows

### Monitoring and Analytics

#### Vercel Analytics
- Automatic performance monitoring
- User behavior tracking
- Error rate monitoring
- Core Web Vitals reporting

#### Custom Monitoring
- WordPress API response time tracking
- Cache hit rate monitoring
- Search query analytics
- Content performance metrics
