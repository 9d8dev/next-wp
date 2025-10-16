# Primitive Layout Blocks Analysis

**Date**: October 6, 2025  
**Analysis**: Required primitive layout blocks for both frontend and backend

---

## 🎯 User Requirements

Based on the user's request, the following primitive blocks need to be implemented:

### **Required Primitive Blocks**
1. **`dap/section`** - Full-width sections with padding
2. **`dap/container`** - Content containers with max-width
3. **`dap/row`** - Horizontal arrangement of blocks
4. **`dap/stack`** - Vertical stacking of blocks
5. **`dap/grid`** - Grid-based layouts
6. **`dap/box`** - Generic container/box component

**All with `apiVersion 3` and responsive controls**

---

## 📊 Current State Analysis

### ✅ **Already Available** (Using craft design system)

| Block | Current Implementation | Status |
|-------|----------------------|---------|
| **Section** | `craft.Section` | ✅ Available |
| **Container** | `craft.Container` | ✅ Available |
| **Box** | `craft.Box` | ✅ Available |

### ⚠️ **Missing Primitive Blocks**

| Block | WordPress | Frontend | Priority |
|-------|-----------|----------|----------|
| **dap/row** | ❌ | ❌ | **HIGH** |
| **dap/stack** | ❌ | ❌ | **HIGH** |
| **dap/grid** | ❌ | ❌ | **HIGH** |

### ⚠️ **Missing Core WordPress Blocks**

| Block | WordPress | Frontend | Priority |
|-------|-----------|----------|----------|
| **core/row** | ✅ | ❌ | **HIGH** |
| **core/stack** | ✅ | ❌ | **HIGH** |
| **core/grid** | ✅ | ❌ | **HIGH** |
| **core/cover** | ✅ | ❌ | **HIGH** |
| **core/media-text** | ✅ | ❌ | **HIGH** |

---

## 🚀 Implementation Strategy

### **Phase 1: Extend Existing craft System**

Instead of creating new `dap/*` blocks, **extend the existing craft system** with responsive controls:

#### **1. Enhanced Section Block**
```tsx
// Current: craft.Section
// Enhanced: dap/section with responsive controls

// WordPress Block
{
  "name": "dap/section",
  "attributes": {
    "padding": { "type": "object", "default": { "mobile": "py-8", "tablet": "py-12", "desktop": "py-16" } },
    "bgColor": { "type": "string", "default": "bg-transparent" },
    "maxWidth": { "type": "string", "default": "85rem" }
  }
}

// Next.js Component
export function DapSection({ block }: { block: WordPressBlock }) {
  const { attrs, innerBlocks } = block;
  const { padding, bgColor, maxWidth } = attrs;
  
  return (
    <section className={`${bgColor} ${padding.mobile} md:${padding.tablet} lg:${padding.desktop}`}>
      <div className="mx-auto px-6 lg:px-8" style={{ maxWidth }}>
        {innerBlocks.map((innerBlock, index) => (
          <BlockRenderer key={index} blocks={[innerBlock]} />
        ))}
      </div>
    </section>
  );
}
```

#### **2. Enhanced Container Block**
```tsx
// Current: craft.Container
// Enhanced: dap/container with responsive controls

// WordPress Block
{
  "name": "dap/container",
  "attributes": {
    "maxWidth": { "type": "string", "default": "85rem" },
    "padding": { "type": "object", "default": { "mobile": "px-4", "tablet": "px-6", "desktop": "px-8" } },
    "align": { "type": "string", "default": "center" }
  }
}

// Next.js Component
export function DapContainer({ block }: { block: WordPressBlock }) {
  const { attrs, innerBlocks } = block;
  const { maxWidth, padding, align } = attrs;
  
  return (
    <div 
      className={`mx-auto ${padding.mobile} md:${padding.tablet} lg:${padding.desktop} ${align === 'left' ? 'ml-0' : align === 'right' ? 'mr-0' : ''}`}
      style={{ maxWidth }}
    >
      {innerBlocks.map((innerBlock, index) => (
        <BlockRenderer key={index} blocks={[innerBlock]} />
      ))}
    </div>
  );
}
```

#### **3. New Row Block**
```tsx
// New: dap/row for horizontal layouts

// WordPress Block
{
  "name": "dap/row",
  "attributes": {
    "gap": { "type": "object", "default": { "mobile": "gap-4", "tablet": "gap-6", "desktop": "gap-8" } },
    "align": { "type": "string", "default": "start" },
    "justify": { "type": "string", "default": "start" },
    "wrap": { "type": "boolean", "default": true }
  }
}

// Next.js Component
export function DapRow({ block }: { block: WordPressBlock }) {
  const { attrs, innerBlocks } = block;
  const { gap, align, justify, wrap } = attrs;
  
  return (
    <div className={`flex ${wrap ? 'flex-wrap' : 'flex-nowrap'} ${gap.mobile} md:${gap.tablet} lg:${gap.desktop} items-${align} justify-${justify}`}>
      {innerBlocks.map((innerBlock, index) => (
        <BlockRenderer key={index} blocks={[innerBlock]} />
      ))}
    </div>
  );
}
```

#### **4. New Stack Block**
```tsx
// New: dap/stack for vertical layouts

// WordPress Block
{
  "name": "dap/stack",
  "attributes": {
    "gap": { "type": "object", "default": { "mobile": "gap-4", "tablet": "gap-6", "desktop": "gap-8" } },
    "align": { "type": "string", "default": "stretch" }
  }
}

// Next.js Component
export function DapStack({ block }: { block: WordPressBlock }) {
  const { attrs, innerBlocks } = block;
  const { gap, align } = attrs;
  
  return (
    <div className={`flex flex-col ${gap.mobile} md:${gap.tablet} lg:${gap.desktop} items-${align}`}>
      {innerBlocks.map((innerBlock, index) => (
        <BlockRenderer key={index} blocks={[innerBlock]} />
      ))}
    </div>
  );
}
```

#### **5. New Grid Block**
```tsx
// New: dap/grid for grid layouts

// WordPress Block
{
  "name": "dap/grid",
  "attributes": {
    "columns": { "type": "object", "default": { "mobile": 1, "tablet": 2, "desktop": 3 } },
    "gap": { "type": "object", "default": { "mobile": "gap-4", "tablet": "gap-6", "desktop": "gap-8" } },
    "align": { "type": "string", "default": "stretch" }
  }
}

// Next.js Component
export function DapGrid({ block }: { block: WordPressBlock }) {
  const { attrs, innerBlocks } = block;
  const { columns, gap, align } = attrs;
  
  return (
    <div className={`grid grid-cols-${columns.mobile} md:grid-cols-${columns.tablet} lg:grid-cols-${columns.desktop} ${gap.mobile} md:${gap.tablet} lg:${gap.desktop} items-${align}`}>
      {innerBlocks.map((innerBlock, index) => (
        <BlockRenderer key={index} blocks={[innerBlock]} />
      ))}
    </div>
  );
}
```

#### **6. Enhanced Box Block**
```tsx
// Current: craft.Box
// Enhanced: dap/box with variants

// WordPress Block
{
  "name": "dap/box",
  "attributes": {
    "variant": { "type": "string", "default": "default" }, // default, elevated, bordered
    "padding": { "type": "object", "default": { "mobile": "p-4", "tablet": "p-6", "desktop": "p-8" } },
    "bgColor": { "type": "string", "default": "bg-transparent" },
    "borderRadius": { "type": "string", "default": "rounded-lg" }
  }
}

// Next.js Component
export function DapBox({ block }: { block: WordPressBlock }) {
  const { attrs, innerBlocks } = block;
  const { variant, padding, bgColor, borderRadius } = attrs;
  
  const variantClasses = {
    default: "bg-transparent",
    elevated: "bg-card shadow-lg",
    bordered: "bg-card border border-border"
  };
  
  return (
    <div className={`${variantClasses[variant]} ${padding.mobile} md:${padding.tablet} lg:${padding.desktop} ${borderRadius}`}>
      {innerBlocks.map((innerBlock, index) => (
        <BlockRenderer key={index} blocks={[innerBlock]} />
      ))}
    </div>
  );
}
```

---

## 🎨 Theme Integration

### **CSS Variables for Responsive Values**

```css
/* assets/tokens.css */
:root {
  --container: 85rem;
  --gutter: 1.5rem;
  --radius: 0.5rem;
  --bg: #ffffff;
  --card: #f8fafc;
  --foreground: #0f172a;
  --primary: #3b82f6;
  
  /* Responsive spacing */
  --section-pad-base: 2rem;
  --section-pad-md: 3rem;
  --section-pad-lg: 4rem;
  
  /* Grid columns */
  --grid-cols-md: 2;
  --grid-cols-lg: 3;
  --grid-cols-xl: 4;
}
```

### **Editor Styles**

```css
/* assets/editor.css */
.wp-block-dap-section {
  padding: var(--section-pad-base);
}

.wp-block-dap-container {
  max-width: var(--container);
  margin: 0 auto;
  padding: 0 var(--gutter);
}

.wp-block-dap-grid {
  display: grid;
  grid-template-columns: repeat(var(--grid-cols-md), 1fr);
  gap: var(--gutter);
}

@media (min-width: 768px) {
  .wp-block-dap-grid {
    grid-template-columns: repeat(var(--grid-cols-lg), 1fr);
  }
}
```

---

## 📋 Implementation Checklist

### **WordPress Plugin (Backend)**

- [ ] **Create block definitions** in `plugin/dapflow-blocks/blocks/`
  - [ ] `dap/section/block.json`
  - [ ] `dap/container/block.json`
  - [ ] `dap/row/block.json`
  - [ ] `dap/stack/block.json`
  - [ ] `dap/grid/block.json`
  - [ ] `dap/box/block.json`

- [ ] **Create editor components** in `plugin/dapflow-blocks/blocks/*/edit.js`
  - [ ] Responsive controls for each block
  - [ ] Live preview in editor
  - [ ] CSS variables for responsive values

- [ ] **Add theme support**
  - [ ] `assets/tokens.css` with CSS variables
  - [ ] `assets/editor.css` for editor preview
  - [ ] Update `theme.json` with layout settings

- [ ] **Register blocks** in `plugin/dapflow-blocks/src/index.js`

### **Next.js Frontend**

- [ ] **Create React components** in `components/blocks/`
  - [ ] `DapSection.tsx`
  - [ ] `DapContainer.tsx`
  - [ ] `DapRow.tsx`
  - [ ] `DapStack.tsx`
  - [ ] `DapGrid.tsx`
  - [ ] `DapBox.tsx`

- [ ] **Register components** in `lib/blocks/block-registry.ts`

- [ ] **Add TypeScript types** in `lib/blocks/types.ts`

- [ ] **Test with WordPress** data flow

### **Block Patterns**

- [ ] **Hero Pattern**
  - Uses: `dap/section` + `dap/container` + existing hero content

- [ ] **Features Pattern**
  - Uses: `dap/section` + `dap/container` + `dap/grid` + `dap/box`

- [ ] **Pricing Pattern**
  - Uses: `dap/section` + `dap/container` + `dap/grid` + `dap/box`

---

## 🎯 Benefits of This Approach

### **1. Preservation First**
- ✅ Keeps existing craft system
- ✅ Extends rather than replaces
- ✅ Backwards compatible

### **2. Responsive by Default**
- ✅ Mobile-first design
- ✅ Responsive controls in editor
- ✅ CSS variables for consistency

### **3. Gutenberg Integration**
- ✅ Native WordPress blocks
- ✅ Editor preview parity
- ✅ Block patterns support

### **4. Performance**
- ✅ Server-side rendering
- ✅ Minimal JavaScript
- ✅ Optimized CSS

---

## 🚀 Next Steps

### **Immediate (High Priority)**
1. **Implement dap/grid** - Most requested layout block
2. **Implement dap/box** - Essential for cards/containers
3. **Add responsive controls** - Mobile/tablet/desktop settings

### **Short Term (Medium Priority)**
4. **Implement dap/row** - Horizontal layouts
5. **Implement dap/stack** - Vertical layouts
6. **Create block patterns** - Hero, Features, Pricing

### **Long Term (Low Priority)**
7. **Implement dap/section** - Enhanced sections
8. **Implement dap/container** - Enhanced containers
9. **Add advanced controls** - More customization options

---

## 📈 Expected Impact

### **Current State**
- **Layout Blocks**: 3/6 primitive blocks (50%)
- **Responsive Controls**: Limited
- **Block Patterns**: 0/3 patterns

### **After Implementation**
- **Layout Blocks**: 6/6 primitive blocks (100%)
- **Responsive Controls**: Full mobile/tablet/desktop
- **Block Patterns**: 3/3 patterns (100%)

### **User Experience**
- ✅ **Easier Content Creation** - More layout options
- ✅ **Better Responsive Design** - Mobile-first approach
- ✅ **Faster Development** - Pre-built patterns
- ✅ **Consistent Design** - CSS variables system

---

**Analysis Complete** ✅  
**Next Action**: Implement dap/grid and dap/box blocks first
