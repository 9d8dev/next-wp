# 🚀 Block Generator CLI - Quick Guide

**Generate new blocks in 5 minutes instead of 30-60 minutes!**

---

## Quick Start

```bash
# From project root
npm run generate-block
```

Follow the prompts, and your block is ready! ✨

---

## What You Need

Before running, decide:

1. **Block name** (e.g., `call-to-action`, `pricing`, `testimonial`)
2. **What content** it should have (title, description, buttons, etc.)
3. **What should be editable** (colors, toggles, etc.)

---

## Common Block Ideas

### Call to Action
```
Name: cta
Attributes:
- title (string)
- description (string)
- buttonText (string)
- buttonUrl (url)
- bgColor (string)
```

### Feature Grid
```
Name: features
Attributes:
- title (string)
- subtitle (string)
- columns (number)
```

### Testimonial
```
Name: testimonial
Attributes:
- quote (string)
- author (string)
- role (string)
- company (string)
- avatarUrl (url)
```

### Pricing Table
```
Name: pricing
Attributes:
- planName (string)
- price (number)
- period (string)
- buttonText (string)
- buttonUrl (url)
- highlight (boolean)
```

### Stats Section
```
Name: stats
Attributes:
- title (string)
- stat1Label (string)
- stat1Value (string)
- stat2Label (string)
- stat2Value (string)
```

---

## After Generation

### 1. Customize Component
File: `components/blocks/[BlockName].tsx`

Add:
- Your styling (Tailwind classes)
- shadcn/ui components
- Animations
- Complex layouts

### 2. Customize Editor
File: `plugin/dapflow-blocks/blocks/[block-name]/edit.js`

Add:
- More controls
- Better preview
- Validation
- Help text

### 3. Build & Test
```bash
cd plugin/dapflow-blocks
npm run build

# Then test in WordPress editor
```

---

## Pro Tips

### 1. Start Simple
Begin with 3-5 attributes. You can always add more!

### 2. Good Defaults
Provide helpful default values:
- ✅ `"Ready to get started?"` 
- ❌ `""`

### 3. Group Related Attributes
- Content first (title, description)
- Actions second (buttons, links)
- Styling last (colors, toggles)

### 4. Use Semantic Names
- ✅ `primaryCtaText` (clear)
- ❌ `btn1` (unclear)

---

## Workflow

```
Generate Block (5 min)
    ↓
Customize Component (10-15 min)
    ↓
Customize Editor (5-10 min)
    ↓
Build Plugin (1 min)
    ↓
Test in WordPress (5 min)
    ↓
Done! (Total: 25-35 min)
```

---

## Example: Add a CTA Block

```bash
$ npm run generate-block

Block name: cta
Block title: Call to Action
Block description: Prominent CTA section
Block icon: megaphone
Keywords: cta, call, action

Attributes:
  title → Title → string → "Ready to get started?"
  description → Description → string → "Join thousands of users"
  buttonText → Button Text → string → "Get Started"
  buttonUrl → Button URL → url → "#"
  bgColor → Background Color → string → "bg-primary"
  (Enter to finish)

✓ Generated!

Next:
1. Edit components/blocks/CallToAction.tsx
2. Build: cd plugin/dapflow-blocks && npm run build
3. Test in WordPress!
```

---

## Full Documentation

See [scripts/README.md](scripts/README.md) for complete details.

---

**Generate your next block in 5 minutes!** ⚡

