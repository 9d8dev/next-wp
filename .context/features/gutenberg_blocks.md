# Feature Specification: Gutenberg Block System

**Feature ID**: FEAT-2025-001  
**Feature Name**: Gutenberg Block System for Custom Sections  
**Status**: In Development  
**Priority**: P0 (Critical)  
**Created**: October 6, 2025  
**Last Updated**: October 6, 2025  

---

## Overview

A bidirectional block system that allows content editors to build custom marketing pages in WordPress Gutenberg editor while rendering with DapFlow's React component library on the Next.js frontend.

---

## Goals

### Primary Goals
1. Enable content editors to create marketing pages (Hero, CTA, Features sections) in WordPress
2. Render pages using existing design system (shadcn/ui, craft, Tailwind)
3. Maintain type safety throughout the stack
4. Keep blog posts using simple HTML rendering

### Secondary Goals
1. Create repeatable process for adding new blocks
2. Provide CLI tool for block generation
3. Maintain backward compatibility with existing content
4. Document system for team usage

---

## User Stories

### As a Content Editor
- I want to insert a Hero section in WordPress so that I can create landing pages
- I want to edit text, buttons, and colors in the sidebar so that I can customize sections
- I want to preview sections in the editor so that I can see how they'll look
- I want to reuse the same section types across pages so that I maintain consistency

### As a Developer
- I want to convert React components to WordPress blocks so that I can make them editable
- I want a CLI tool to generate blocks so that I can save time
- I want TypeScript types for all blocks so that I catch errors early
- I want clear documentation so that I can add new blocks independently

### As an End User
- I want pages to load fast so that I have a good experience
- I want consistent design so that the site feels professional
- I want responsive layouts so that I can use any device

---

## System Architecture

### High-Level Flow

```
┌─────────────────────────────────────────────────────────────┐
│                     WordPress (CMS)                         │
│  ┌───────────────────────────────────────────────────────┐ │
│  │           Gutenberg Block Editor                      │ │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  │ │
│  │  │ Hero Block  │  │  CTA Block  │  │Feature Block│  │ │
│  │  └─────────────┘  └─────────────┘  └─────────────┘  │ │
│  │                                                       │ │
│  │  Editor Controls:                                    │ │
│  │  - Text inputs                                       │ │
│  │  - Color pickers                                     │ │
│  │  - Link selectors                                    │ │
│  │  - Layout options                                    │ │
│  └───────────────────────────────────────────────────────┘ │
│                           ↓                                 │
│                   Saves as JSON to DB                       │
│                           ↓                                 │
│  ┌───────────────────────────────────────────────────────┐ │
│  │              WordPress REST API                       │ │
│  │         /wp-json/wp/v2/pages/{id}                    │ │
│  │                                                       │ │
│  │  Returns:                                            │ │
│  │  {                                                   │ │
│  │    "blocks": [                                       │ │
│  │      {                                               │ │
│  │        "blockName": "dapflow/hero",                 │ │
│  │        "attrs": { "title": "...", ... }             │ │
│  │      }                                               │ │
│  │    ]                                                 │ │
│  │  }                                                   │ │
│  └───────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
                           ↓
                     HTTP Request
                           ↓
┌─────────────────────────────────────────────────────────────┐
│                    Next.js (Frontend)                       │
│  ┌───────────────────────────────────────────────────────┐ │
│  │              lib/wordpress.ts                         │ │
│  │         Fetch page data from WP API                   │ │
│  └───────────────────────────────────────────────────────┘ │
│                           ↓                                 │
│  ┌───────────────────────────────────────────────────────┐ │
│  │         lib/blocks/block-renderer.tsx                 │ │
│  │                                                       │ │
│  │  Parse blocks array:                                 │ │
│  │  for each block:                                     │ │
│  │    - Lookup component in registry                    │ │
│  │    - Pass attrs as props                             │ │
│  │    - Render component                                │ │
│  └───────────────────────────────────────────────────────┘ │
│                           ↓                                 │
│  ┌───────────────────────────────────────────────────────┐ │
│  │         components/blocks/Hero.tsx                    │ │
│  │                                                       │ │
│  │  Renders with:                                       │ │
│  │  - shadcn/ui components (Button, Badge)              │ │
│  │  - craft components (Section, Container)             │ │
│  │  - Tailwind CSS classes                              │ │
│  │  - Props from WordPress                              │ │
│  └───────────────────────────────────────────────────────┘ │
│                           ↓                                 │
│                    HTML to Browser                          │
└─────────────────────────────────────────────────────────────┘
```

---

## Component Structure

### WordPress Plugin

```
/plugin/dapflow-blocks/
├── dapflow-blocks.php              # Main plugin file
├── includes/
│   ├── class-block-registry.php    # Registers all blocks
│   ├── class-rest-api.php          # Extends REST API
│   ├── class-block-generator.php   # CLI helper
│   └── class-block-validator.php   # Validates block data
├── blocks/
│   ├── _template/                  # Template for new blocks
│   │   ├── block.json
│   │   ├── edit.js
│   │   ├── index.js
│   │   └── style.scss
│   ├── hero/
│   │   ├── block.json              # Metadata & attributes
│   │   ├── edit.js                 # Editor UI
│   │   ├── index.js                # Registration
│   │   └── style.scss              # Editor styles
│   ├── cta/
│   ├── features/
│   └── ...
├── src/                            # Source files (before build)
├── build/                          # Compiled assets
├── package.json
├── webpack.config.js
└── README.md
```

### Next.js Integration

```
/lib/blocks/
├── block-renderer.tsx              # Main renderer component
├── block-registry.ts               # Maps blockName → Component
├── block-parser.ts                 # Parses WordPress blocks
├── core-blocks.tsx                 # Fallback for core blocks
└── types.ts                        # TypeScript definitions

/components/blocks/
├── Hero.tsx                        # Prop-driven components
├── CTA.tsx
├── Features.tsx
├── Testimonial.tsx
├── Pricing.tsx
└── ...

/lib/wordpress.d.ts                 # Updated with block types
```

---

## Block Lifecycle

### 1. Development Phase

**Developer creates React component:**
```tsx
// components/blocks/Hero.tsx
interface HeroProps {
  title: string;
  subtitle: string;
  primaryCta: { text: string; href: string };
  bgColor?: string;
}

export function Hero({ title, subtitle, primaryCta, bgColor }: HeroProps) {
  return (
    <Section className={bgColor}>
      <Container>
        <h1>{title}</h1>
        <p>{subtitle}</p>
        <Button href={primaryCta.href}>{primaryCta.text}</Button>
      </Container>
    </Section>
  );
}
```

**Developer creates WordPress block:**
```jsx
// plugin/dapflow-blocks/blocks/hero/edit.js
import { InspectorControls, RichText } from '@wordpress/block-editor';
import { PanelBody, TextControl, SelectControl } from '@wordpress/components';

export default function Edit({ attributes, setAttributes }) {
  return (
    <>
      <InspectorControls>
        <PanelBody title="Hero Settings">
          <TextControl
            label="Title"
            value={attributes.title}
            onChange={(title) => setAttributes({ title })}
          />
          <TextControl
            label="Subtitle"
            value={attributes.subtitle}
            onChange={(subtitle) => setAttributes({ subtitle })}
          />
          <SelectControl
            label="Background Color"
            value={attributes.bgColor}
            options={[
              { label: 'Dark', value: 'bg-gray-900' },
              { label: 'Primary', value: 'bg-primary' },
            ]}
            onChange={(bgColor) => setAttributes({ bgColor })}
          />
        </PanelBody>
      </InspectorControls>
      
      <div className={attributes.bgColor}>
        <RichText
          tagName="h1"
          value={attributes.title}
          onChange={(title) => setAttributes({ title })}
        />
        <RichText
          tagName="p"
          value={attributes.subtitle}
          onChange={(subtitle) => setAttributes({ subtitle })}
        />
      </div>
    </>
  );
}
```

**Developer registers block:**
```typescript
// lib/blocks/block-registry.ts
import { Hero } from '@/components/blocks/Hero';

export const BLOCK_COMPONENTS = {
  'dapflow/hero': Hero,
};
```

### 2. Content Editing Phase

**Content editor in WordPress:**
1. Opens page in Gutenberg editor
2. Clicks "+" to add block
3. Searches "Hero"
4. Inserts "Hero Section" block
5. Edits in sidebar:
   - Title: "Welcome to DapFlow"
   - Subtitle: "Build amazing experiences"
   - Button text: "Get Started"
   - Button link: "/signup"
   - Background: "Dark"
6. Sees live preview in editor
7. Publishes page

**WordPress saves to database:**
```html
<!-- wp:dapflow/hero {"title":"Welcome to DapFlow","subtitle":"Build amazing experiences","primaryCtaText":"Get Started","primaryCtaHref":"/signup","bgColor":"bg-gray-900"} /-->
```

**Parsed as:**
```json
{
  "blockName": "dapflow/hero",
  "attrs": {
    "title": "Welcome to DapFlow",
    "subtitle": "Build amazing experiences",
    "primaryCtaText": "Get Started",
    "primaryCtaHref": "/signup",
    "bgColor": "bg-gray-900"
  },
  "innerBlocks": []
}
```

### 3. Rendering Phase

**WordPress REST API response:**
```json
GET /wp-json/wp/v2/pages/123

{
  "id": 123,
  "title": { "rendered": "About" },
  "blocks": [
    {
      "blockName": "dapflow/hero",
      "attrs": {
        "title": "Welcome to DapFlow",
        "subtitle": "Build amazing experiences",
        "primaryCta": {
          "text": "Get Started",
          "href": "/signup"
        },
        "bgColor": "bg-gray-900"
      }
    }
  ]
}
```

**Next.js renders:**
```tsx
// app/pages/[slug]/page.tsx
export default async function Page({ params }) {
  const page = await getPageBySlug(params.slug);
  
  return <BlockRenderer blocks={page.blocks} />;
}

// Renders:
<Hero
  title="Welcome to DapFlow"
  subtitle="Build amazing experiences"
  primaryCta={{ text: "Get Started", href: "/signup" }}
  bgColor="bg-gray-900"
/>
```

---

## Block Types

### Layout Blocks

**Container**
- Props: `maxWidth`, `padding`, `className`
- Purpose: Wrap content with max-width constraint

**Section**
- Props: `padding`, `bgColor`, `className`
- Purpose: Full-width section with vertical spacing

**Flex**
- Props: `direction`, `gap`, `align`, `justify`
- Purpose: Flexbox layout

**Grid**
- Props: `columns`, `gap`, `responsive`
- Purpose: CSS Grid layout

### Content Blocks

**Hero**
- Props: `title`, `subtitle`, `primaryCta`, `secondaryCta`, `badge`, `bgColor`, `image`
- Purpose: Page hero section

**CTA (Call to Action)**
- Props: `title`, `description`, `ctaButton`, `bgColor`, `layout`
- Purpose: Call-to-action section

**Features**
- Props: `title`, `features[]`, `layout`, `columns`
- Purpose: Feature grid/list

**Testimonial**
- Props: `quote`, `author`, `role`, `company`, `avatar`
- Purpose: Customer testimonial

**Pricing**
- Props: `plans[]`, `highlight`, `billingToggle`
- Purpose: Pricing table

---

## Block Attributes Schema

### Example: Hero Block

```json
{
  "apiVersion": 3,
  "name": "dapflow/hero",
  "title": "Hero Section",
  "category": "dapflow",
  "icon": "cover-image",
  "description": "Large hero section with title, subtitle, and CTAs",
  "keywords": ["hero", "header", "banner"],
  "supports": {
    "html": false,
    "align": ["wide", "full"]
  },
  "attributes": {
    "title": {
      "type": "string",
      "default": "Data to enrich your online business"
    },
    "subtitle": {
      "type": "string",
      "default": "Anim aute id magna aliqua ad ad non deserunt sunt."
    },
    "primaryCtaText": {
      "type": "string",
      "default": "Get started"
    },
    "primaryCtaHref": {
      "type": "string",
      "default": "#"
    },
    "secondaryCtaText": {
      "type": "string",
      "default": ""
    },
    "secondaryCtaHref": {
      "type": "string",
      "default": ""
    },
    "badge": {
      "type": "string",
      "default": ""
    },
    "bgColor": {
      "type": "string",
      "default": "bg-gray-900"
    },
    "textColor": {
      "type": "string",
      "default": "text-white"
    }
  }
}
```

---

## Type Definitions

### TypeScript Types

```typescript
// lib/blocks/types.ts

export interface WordPressBlock {
  blockName: string;
  attrs: Record<string, any>;
  innerBlocks?: WordPressBlock[];
  innerHTML?: string;
}

export interface HeroBlockAttributes {
  title: string;
  subtitle: string;
  primaryCtaText: string;
  primaryCtaHref: string;
  secondaryCtaText?: string;
  secondaryCtaHref?: string;
  badge?: string;
  bgColor?: string;
  textColor?: string;
}

export interface CTABlockAttributes {
  title: string;
  description: string;
  ctaText: string;
  ctaHref: string;
  bgColor?: string;
  layout?: 'centered' | 'split';
}

export interface FeatureItem {
  icon?: string;
  title: string;
  description: string;
}

export interface FeaturesBlockAttributes {
  title?: string;
  features: FeatureItem[];
  columns?: 2 | 3 | 4;
  layout?: 'grid' | 'list';
}
```

---

## API Reference

### Block Renderer

```typescript
import { BlockRenderer } from '@/lib/blocks/block-renderer';

<BlockRenderer blocks={page.blocks} />
```

**Props:**
- `blocks`: `WordPressBlock[]` - Array of blocks from WordPress
- `fallback?`: `ReactNode` - Fallback for unknown blocks

### Block Registry

```typescript
import { BLOCK_COMPONENTS } from '@/lib/blocks/block-registry';

// Register new block
BLOCK_COMPONENTS['dapflow/my-block'] = MyBlockComponent;
```

### REST API Extension

**Endpoint:** `GET /wp-json/wp/v2/pages/{id}`

**Response includes:**
```json
{
  "blocks": [
    {
      "blockName": "dapflow/hero",
      "attrs": { ... },
      "innerBlocks": [ ... ]
    }
  ]
}
```

---

## Performance Considerations

### Server-Side Rendering
- All blocks render as React Server Components
- No client-side JavaScript for static content
- Interactive elements use `'use client'` directive

### Caching
- Leverage existing Next.js ISR (revalidate: 3600)
- WordPress webhook triggers revalidation
- Block data cached same as HTML content

### Bundle Size
- Block renderer is tree-shaken
- Only imported components included in bundle
- No WordPress editor code in production bundle

---

## Security Considerations

### Input Sanitization
- All block attributes sanitized in WordPress
- TypeScript types prevent type errors
- XSS protection via React's default escaping

### Access Control
- Block editing respects WordPress roles
- No direct database access from frontend
- REST API uses WordPress authentication

---

## Testing Strategy

### WordPress Plugin Tests
- Block registration works
- Attributes save correctly
- REST API returns block data
- Editor UI is functional

### Next.js Integration Tests
- Blocks render correctly
- Props passed properly
- Fallbacks work for unknown blocks
- Type checking passes

### E2E Tests
- Content editor can add blocks
- Blocks appear on frontend
- Styling matches design
- Responsive behavior correct

---

## Monitoring & Logging

### Metrics to Track
- Block rendering time
- Unknown block warnings
- REST API response size
- Editor performance

### Logging
```typescript
// Block renderer logs unknown blocks
console.warn(`Unknown block: ${block.blockName}`);

// Workflow logging integration
logBlockRender({
  blockName: block.blockName,
  pageId: page.id,
  timestamp: Date.now()
});
```

---

## Documentation Requirements

### For Developers
- How to create new blocks
- Block attribute best practices
- TypeScript type guidelines
- Testing requirements

### For Content Editors
- How to insert blocks
- How to edit block settings
- Common patterns and examples
- Troubleshooting guide

---

## Maintenance Log Integration

**Should this feature be added to Maintenance Log?** YES

**Entry:**
```markdown
## Gutenberg Block System

**Path:** `/plugin/dapflow-blocks/`, `/lib/blocks/`, `/components/blocks/`
**Reason:** Critical infrastructure that all pages depend on
**Check Frequency:** Monthly
**Linked Tasks:** TASK-001, TASK-002, TASK-003
**Notes:**
- Review block performance metrics
- Update block types for new WordPress versions
- Check for deprecated block APIs
- Ensure REST API extension compatibility
```

---

## Workflow Dashboard Integration

**Should this feature be included in Workflow Dashboard?** YES

**Metrics to Display:**
- Number of blocks registered
- Blocks used per page
- Block rendering performance
- Unknown block warnings count
- Block addition/update frequency

---

## Related Documentation

- [ADR-2025-001: Gutenberg Block System](../decisions/ADR-2025-001-gutenberg-block-system.md)
- [Implementation Details](../implementation_details.md)
- [Maintenance Log](../maintenance_log.md)
- [Roadmap](../roadmap.md)

---

## Version History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2025-10-06 | AI Assistant | Initial feature specification |

