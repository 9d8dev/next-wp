# Mental Model - DapFlow Architecture

## Project Overview
DapFlow is a headless WordPress site built with Next.js 15, featuring a modern tech stack and multi-environment deployment strategy.

## Architecture Principles

### Headless WordPress Architecture
- **Backend**: WordPress CMS at `https://cms.dapflow.com`
- **Frontend**: Next.js 15 with App Router at `https://dapflow.com`
- **API Integration**: WordPress REST API for content management
- **Real-time Updates**: Webhook-based cache invalidation system

### Tech Stack
- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS + shadcn/ui components
- **Deployment**: Vercel with multi-environment setup
- **Package Manager**: pnpm

### Key Architectural Decisions

#### 1. Server-Side Rendering (SSR)
- All pages use React Server Components
- SEO-optimized with dynamic metadata generation
- Automatic OG image generation for social sharing

#### 2. Caching Strategy
- Next.js 15 cache tags for granular revalidation
- WordPress webhook integration for automatic cache invalidation
- Hierarchical cache tags (wordpress → posts → post-123)

#### 3. Multi-Environment Strategy
- **Production**: `main` branch → `dapflow.com`
- **Staging**: `staging` branch → `stage.dapflow.com`
- **Preview**: `develop`/`feature/*` branches → auto-generated URLs

## Content Flow

### WordPress → Next.js Data Flow
1. Content created/updated in WordPress CMS
2. WordPress webhook triggers Next.js revalidation
3. Next.js invalidates specific cache tags
4. Fresh content served on next request

### API Layer
- `lib/wordpress.ts`: Centralized WordPress API functions
- Type-safe with `lib/wordpress.d.ts`
- Error handling with custom `WordPressAPIError` class
- Pagination support for large content sets

## Component Architecture

### Design System
- **Base**: shadcn/ui components
- **Styling**: Tailwind CSS with craft-ds design system
- **Theme**: Dark/light mode support
- **Responsive**: Mobile-first approach

### Key Components
- `components/posts/`: Post-related components (cards, filters, search)
- `components/nav/`: Navigation components
- `components/ui/`: Reusable UI components
- `components/theme/`: Theme management

## Deployment Architecture

### Vercel Integration
- Automatic deployments from Git branches
- Environment-specific configuration
- Edge runtime for OG image generation
- Analytics integration

### Environment Variables
- `WORDPRESS_URL`: WordPress backend URL
- `WORDPRESS_HOSTNAME`: WordPress hostname for image optimization
- `WORDPRESS_WEBHOOK_SECRET`: Secure webhook communication

## Performance Considerations

### Optimization Strategies
- Server-side pagination (not client-side)
- Image optimization with Next.js Image component
- Code splitting and lazy loading
- Cache-first strategy with intelligent invalidation

### Monitoring
- Vercel Analytics for performance metrics
- Core Web Vitals tracking
- Error monitoring and logging

## Security Model

### WordPress Integration
- REST API authentication
- Webhook secret validation
- Environment variable protection
- HTTPS enforcement across all environments

### Next.js Security
- Type-safe API calls
- Input validation and sanitization
- Secure environment variable handling
- CSRF protection built-in

## Scalability Considerations

### Content Scaling
- Server-side pagination for large post volumes
- Efficient cache tag system for selective invalidation
- WordPress plugin for automated revalidation

### Team Scaling
- Clear branch strategy for multiple developers
- Code review requirements
- Automated testing and deployment
- Documentation-driven development

## Future Architecture Considerations

### Potential Enhancements
- Multi-site WordPress support
- Advanced search with Elasticsearch
- Real-time features with WebSockets
- Mobile app integration via API
- Headless commerce integration

### Monitoring & Observability
- Application Performance Monitoring (APM)
- Error tracking and alerting
- User analytics and behavior tracking
- Content performance metrics
