# Core WordPress Blocks - React Components

**All core WordPress blocks are now rendered as React components using Tailwind CSS, shadcn/ui, and the craft design system.**

## Overview

Instead of using WordPress's rendered HTML, we now have custom React components for every core WordPress block. This gives us:

- ✅ Full control over styling and layout
- ✅ Consistent design system across all blocks
- ✅ Responsive, mobile-first design
- ✅ Type-safe components with TypeScript
- ✅ Performance optimizations
- ✅ Easy customization and theming

## Architecture

```
WordPress (CMS) → REST API → Next.js (Frontend)
                              ↓
                         Block Renderer
                              ↓
                    ┌─────────┴─────────┐
                    ↓                   ↓
            Custom Blocks          Core Blocks
         (DapFlow blocks)      (WordPress blocks)
                    ↓                   ↓
            React Components    React Components
```

## Supported Core Blocks

### Layout Blocks
- **Columns** (`core/columns`) - Responsive grid layout
- **Column** (`core/column`) - Individual column
- **Group** (`core/group`) - Generic container

### Content Blocks
- **Paragraph** (`core/paragraph`) - Text content
- **Heading** (`core/heading`) - H1-H6 headings
- **List** (`core/list`) - Ordered/unordered lists
- **Quote** (`core/quote`) - Blockquotes
- **Code** (`core/code`) - Code snippets
- **Preformatted** (`core/preformatted`) - Preformatted text

### Media Blocks
- **Image** (`core/image`) - Single images with captions
- **Gallery** (`core/gallery`) - Image galleries
- **Video** (`core/video`) - Video embeds
- **Audio** (`core/audio`) - Audio players

### Interactive Blocks
- **Buttons** (`core/buttons`) - Button group
- **Button** (`core/button`) - Individual button (uses shadcn/ui Button)

### Formatting Blocks
- **Separator** (`core/separator`) - Horizontal rule
- **Spacer** (`core/spacer`) - Vertical spacing

### Embed Blocks
- **Embed** (`core/embed`) - YouTube, Twitter, etc.

### Table Blocks
- **Table** (`core/table`) - Data tables

## Component Structure

All core block components are located in:
```
components/blocks/CoreBlocks.tsx
```

Each component follows this pattern:

```tsx
export function CoreBlockName({ block }: { block: WordPressBlock }) {
  const { attrs, innerHTML, innerBlocks } = block;
  
  // Component logic and rendering
  return (
    <Section>
      <Container>
        {/* Tailwind/shadcn styling */}
      </Container>
    </Section>
  );
}
```

## Design System Integration

### Tailwind CSS
All components use Tailwind utility classes for styling:
- `flex`, `grid` for layouts
- Responsive breakpoints: `sm:`, `md:`, `lg:`
- Design tokens: `bg-muted`, `text-foreground`, `border-border`

### shadcn/ui
Interactive components use shadcn/ui primitives:
- `Button` component for all buttons
- Consistent hover states and transitions
- Theme-aware styling (light/dark mode)

### craft Design System
Layout components use craft primitives:
- `Section` - Page sections with consistent spacing
- `Container` - Content containers with max-width
- `Prose` - Typography for text content

## Examples

### Columns Block
```tsx
// In WordPress Gutenberg:
// - Create a Columns block
// - Add 3 columns
// - Add content in each column

// Rendered as:
<Section>
  <Container>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      <div className="flex flex-col gap-4">{/* Column 1 */}</div>
      <div className="flex flex-col gap-4">{/* Column 2 */}</div>
      <div className="flex flex-col gap-4">{/* Column 3 */}</div>
    </div>
  </Container>
</Section>
```

### Button Block
```tsx
// In WordPress Gutenberg:
// - Add a Button block
// - Set text and URL

// Rendered as:
<Button asChild>
  <a href="/contact">Contact Us</a>
</Button>
```

### Image Block
```tsx
// In WordPress Gutenberg:
// - Add an Image block
// - Upload image and add caption

// Rendered as:
<Section>
  <Container>
    <figure className="my-8">
      <div className="rounded-lg overflow-hidden border">
        <img src="..." alt="..." />
      </div>
      <figcaption className="text-sm text-muted-foreground mt-2">
        Caption text
      </figcaption>
    </figure>
  </Container>
</Section>
```

## Customization

### Styling Individual Blocks

To customize a specific block type, edit the component in `CoreBlocks.tsx`:

```tsx
// Example: Change button styling
export function CoreButton({ block }: { block: WordPressBlock }) {
  // ...
  return (
    <Button 
      asChild 
      variant="default" // Change to "outline", "ghost", etc.
      size="lg" // Change to "sm", "lg", etc.
    >
      <a href={buttonUrl}>{buttonText}</a>
    </Button>
  );
}
```

### Adding New Block Support

To add support for a new core block:

1. Create the component in `CoreBlocks.tsx`:
```tsx
export function CoreNewBlock({ block }: { block: WordPressBlock }) {
  // Your component logic
  return <div>...</div>;
}
```

2. Add it to the router in `CoreBlockRenderer`:
```tsx
if (blockName === 'core/new-block') return <CoreNewBlock block={block} />;
```

### Theme Integration

All blocks automatically respect your site's theme:
- Light/dark mode via Tailwind's `dark:` variants
- Color tokens from `globals.css`
- Consistent spacing and typography

## Benefits Over HTML Rendering

### Before (HTML):
```tsx
<div dangerouslySetInnerHTML={{ __html: page.content.rendered }} />
```
- ❌ No control over styling
- ❌ Can't use React features
- ❌ Hard to maintain consistency
- ❌ WordPress CSS required

### After (React):
```tsx
<BlockRenderer blocks={page.blocks} />
```
- ✅ Full styling control
- ✅ React components with hooks
- ✅ Design system consistency
- ✅ No WordPress CSS needed

## Performance

- **Server-Side Rendering**: All components render on the server
- **No Client JS**: Most blocks are pure HTML (no hydration)
- **Image Optimization**: Can easily add Next.js Image component
- **Code Splitting**: Components loaded on-demand

## Troubleshooting

### Block Not Rendering
1. Check if block is in `CoreBlockRenderer` switch
2. Verify block data in WordPress REST API
3. Check browser console for errors

### Styling Issues
1. Ensure Tailwind classes are correct
2. Check if dark mode is affecting styles
3. Verify craft components are imported

### Layout Problems
1. Check responsive breakpoints (`md:`, `lg:`)
2. Verify grid/flex container setup
3. Test on different screen sizes

## Next Steps

1. **Test all blocks** on the careers page
2. **Customize styling** to match your brand
3. **Add more blocks** as needed
4. **Optimize performance** with Next.js Image

## File Structure

```
components/
  blocks/
    CoreBlocks.tsx      # All core block components
    Hero.tsx            # Custom DapFlow blocks
    HeroBasic.tsx
    ...
lib/
  blocks/
    block-renderer.tsx  # Main block router
    core-blocks.tsx     # Re-exports CoreBlockRenderer
    types.ts            # TypeScript definitions
app/
  pages/
    [slug]/
      page.tsx          # Uses BlockRenderer
```

---

**Ready to go!** Refresh `http://localhost:3000/pages/careers` to see all blocks rendered as React components! 🚀

