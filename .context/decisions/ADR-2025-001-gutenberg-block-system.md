# ADR-2025-001: Gutenberg Block System for Custom Sections

**Status**: Accepted  
**Date**: October 6, 2025  
**Author**: AI Assistant (Claude)  
**Deciders**: Nikhil (Lead Developer)  

---

## Context

DapFlow is a headless WordPress site built with Next.js 15, React, TypeScript, Tailwind CSS, shadcn/ui, and brijr/craft. Currently:

- **Blog posts** render WordPress content as HTML using `dangerouslySetInnerHTML`
- **Pages** also render as HTML, limiting design flexibility
- **Marketing pages** need custom sections (Hero, CTA, Features) that match modern design systems
- **Content editors** need the ability to build pages visually in WordPress without code changes

### Problem Statement

WordPress pages currently output raw HTML that doesn't leverage our React component library (shadcn/ui, craft). This means:

1. No access to our design system components in WordPress editor
2. Can't create flowout.com-style marketing pages in WordPress
3. Content editors can't build custom layouts without developer intervention
4. Styling is inconsistent between blog content and marketing sections

### Business Goal

Enable content editors to create beautiful marketing pages (like https://flowout.com) directly in WordPress, while rendering with our Next.js design system on the frontend.

---

## Decision

We will implement a **bidirectional Gutenberg block system** that:

1. **Registers custom Gutenberg blocks** in WordPress for each React component (Hero, CTA, Features, etc.)
2. **Extends WordPress REST API** to expose block data as structured JSON (not HTML)
3. **Creates a block renderer** in Next.js that maps block data to React components
4. **Maintains separation** between blog posts (HTML) and marketing pages (blocks)

### Architecture

```
React Component (Prop-Driven)
    ↓
WordPress Gutenberg Block (Editor UI)
    ↓ [User edits content]
WordPress Database (Stores as JSON)
    ↓
WordPress REST API (Returns block data)
    ↓
Next.js Block Renderer
    ↓
React Component (Rendered with WordPress data)
```

---

## Technical Approach

### 1. WordPress Plugin: `dapflow-blocks`

**Location**: `/plugin/dapflow-blocks/`

**Responsibilities**:
- Register custom Gutenberg blocks
- Provide editor UI with InspectorControls
- Extend REST API to expose blocks as JSON
- Handle block validation and sanitization

**Block Structure**:
```
/blocks/
  /hero/
    - block.json          # Block metadata
    - edit.js             # Editor UI (React)
    - index.js            # Registration
    - style.scss          # Editor styles
```

### 2. Next.js Block System

**Location**: `/lib/blocks/` and `/components/blocks/`

**Responsibilities**:
- Parse WordPress block JSON
- Map block names to React components
- Render blocks with proper props
- Handle nested blocks and fallbacks

**Key Files**:
```typescript
// lib/blocks/block-renderer.tsx
export function BlockRenderer({ blocks }: { blocks: Block[] })

// lib/blocks/block-registry.ts
export const BLOCK_COMPONENTS = {
  'dapflow/hero': Hero,
  'dapflow/cta': CTA,
}

// components/blocks/Hero.tsx
export function Hero(props: HeroProps)
```

### 3. Component Pattern

**All React components must be prop-driven**:

```typescript
// ❌ Hardcoded (Old)
export default function Hero() {
  return <h1>Fixed Title</h1>
}

// ✅ Prop-Driven (New)
interface HeroProps {
  title: string;
  subtitle: string;
}

export function Hero({ title, subtitle }: HeroProps) {
  return <h1>{title}</h1>
}
```

### 4. REST API Extension

Extend WordPress `/wp/v2/pages` endpoint:

```php
add_filter('rest_prepare_page', function($response, $post) {
    $blocks = parse_blocks($post->post_content);
    $response->data['blocks'] = $blocks;
    return $response;
}, 10, 2);
```

Response includes:
```json
{
  "id": 123,
  "title": { "rendered": "About" },
  "content": { "rendered": "<div>...</div>" },
  "blocks": [
    {
      "blockName": "dapflow/hero",
      "attrs": {
        "title": "Welcome to DapFlow",
        "subtitle": "Build amazing experiences"
      },
      "innerBlocks": []
    }
  ]
}
```

---

## Alternatives Considered

### Alternative 1: Hardcode Marketing Pages in Next.js

**Approach**: Build marketing pages as static Next.js pages, use WordPress only for blog.

**Pros**:
- Full control over React code
- No WordPress plugin needed
- Simpler architecture

**Cons**:
- ❌ Content editors can't modify pages
- ❌ Requires developer for every content change
- ❌ Defeats purpose of CMS
- ❌ Doesn't scale with team

**Rejected**: Doesn't meet business requirement for content editor autonomy.

---

### Alternative 2: Use Page Builder Plugin (e.g., Elementor, Beaver Builder)

**Approach**: Install a WordPress page builder plugin.

**Pros**:
- Ready-made solution
- Lots of features

**Cons**:
- ❌ Generates bloated HTML
- ❌ Doesn't use our design system
- ❌ Inconsistent styling with Next.js
- ❌ Performance overhead
- ❌ Vendor lock-in

**Rejected**: Doesn't leverage our existing React components and design system.

---

### Alternative 3: Use Headless CMS (Builder.io, Plasmic, etc.)

**Approach**: Replace WordPress with a headless CMS that has visual editing.

**Pros**:
- Purpose-built for this use case
- Visual editing for React components

**Cons**:
- ❌ Requires migration from WordPress
- ❌ Additional cost
- ❌ Learning curve for team
- ❌ Lose WordPress ecosystem
- ❌ Still need blog posts in WordPress

**Rejected**: Too disruptive, project already uses WordPress successfully for blog.

---

### Alternative 4: ACF Flexible Content

**Approach**: Use Advanced Custom Fields plugin with Flexible Content layouts.

**Pros**:
- Simpler than custom blocks
- Widely used pattern

**Cons**:
- ❌ Requires paid ACF Pro plugin
- ❌ Less intuitive than block editor
- ❌ Doesn't use Gutenberg editor (inconsistent UX)
- ❌ Still need to build all UI

**Rejected**: Gutenberg is the future of WordPress, ACF is legacy approach.

---

## Decision Rationale

**Why Custom Gutenberg Blocks?**

1. ✅ **Leverages existing stack**: Uses our React components, Tailwind, shadcn/ui
2. ✅ **Content editor friendly**: Gutenberg is WordPress's native editor
3. ✅ **Full control**: We control exactly how components render
4. ✅ **Type-safe**: TypeScript throughout the stack
5. ✅ **Performance**: Renders as React components, not bloated HTML
6. ✅ **Scalable**: Easy to add new blocks as needed
7. ✅ **Maintainable**: Clear separation between WordPress (data) and Next.js (presentation)
8. ✅ **Future-proof**: Gutenberg is WordPress's long-term direction

---

## Implementation Strategy

### Phase 1: Foundation (Week 1)
- WordPress plugin infrastructure
- REST API extension
- Next.js block renderer
- Documentation

### Phase 2: Example Block (Week 2)
- Convert Hero component to prop-driven
- Create WordPress Hero block
- Integration testing

### Phase 3: Automation (Week 3)
- Block generator CLI
- Developer documentation
- Team training

### Phase 4: Ongoing
- Add blocks as React components are provided
- ~2-4 hours per block

---

## Consequences

### Positive

1. **Content editors** can build marketing pages independently
2. **Consistent design** using our React components
3. **Type-safe** throughout the stack
4. **Reusable** components across pages
5. **Performance** maintained (Server Components)
6. **Flexible** for future requirements

### Negative

1. **Initial development time** (~3 weeks)
2. **Custom plugin maintenance** required
3. **Team learning curve** for block development
4. **WordPress dependency** for page content

### Mitigations

- Comprehensive documentation reduces learning curve
- CLI tool automates repetitive tasks
- Clear separation allows incremental adoption
- Backward compatibility with HTML rendering

---

## Technical Considerations

### Type Safety

```typescript
// lib/wordpress.d.ts - Updated types
export interface Page extends WPEntity {
  title: RenderedTitle;
  content: RenderedContent;
  blocks?: WordPressBlock[];  // NEW
}

export interface WordPressBlock {
  blockName: string;
  attrs: Record<string, any>;
  innerBlocks?: WordPressBlock[];
  innerHTML?: string;
}
```

### Backward Compatibility

Pages without blocks continue to render as HTML:

```tsx
{page.blocks ? (
  <BlockRenderer blocks={page.blocks} />
) : (
  <Prose dangerouslySetInnerHTML={{ __html: page.content.rendered }} />
)}
```

### Cache Strategy

Leverage existing Next.js ISR and revalidation:
- Blocks are cached like HTML content
- Webhook revalidation works unchanged
- No performance impact

### Error Handling

```tsx
// Unknown blocks render fallback
if (!Component) {
  console.warn(`Unknown block: ${block.blockName}`);
  return <div dangerouslySetInnerHTML={{ __html: block.innerHTML }} />;
}
```

---

## Success Metrics

### Technical Metrics
- ✅ All blocks render correctly on frontend
- ✅ Block editing is intuitive in WordPress
- ✅ Page load time remains < 1.5s
- ✅ Type errors caught at build time
- ✅ Block generator reduces development time to < 1 hour per block

### Business Metrics
- ✅ Content editors can create pages without developer help
- ✅ New marketing pages can be created in < 1 day
- ✅ Design consistency maintained across site
- ✅ Team satisfaction with editing experience

---

## References

- [Gutenberg Block API](https://developer.wordpress.org/block-editor/reference-guides/block-api/)
- [Next.js 15 Documentation](https://nextjs.org/docs)
- [WordPress REST API](https://developer.wordpress.org/rest-api/)
- [Project Roadmap](../roadmap.md)
- [Implementation Details](../implementation_details.md)

---

## Version History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2025-10-06 | AI Assistant | Initial ADR created |

---

## Approval

- [x] Technical approach validated
- [x] Alternatives considered
- [x] Implementation plan defined
- [x] Timeline agreed upon
- [ ] Stakeholder approval pending

