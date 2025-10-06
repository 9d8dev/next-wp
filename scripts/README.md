# Block Generator CLI

**Automated tool for creating new Gutenberg blocks**

---

## What It Does

The Block Generator CLI automates the creation of new blocks by generating all necessary files:

- ✅ WordPress block files (block.json, edit.js, index.js, style.scss)
- ✅ Next.js React component with TypeScript
- ✅ TypeScript type definitions
- ✅ Block registry updates
- ✅ Plugin entry updates

**Time Savings**: Manual process (30-60 min) → CLI (5-10 min) = **70-80% faster!**

---

## Usage

### Basic Command

```bash
npm run generate-block
```

### Interactive Prompts

The CLI will ask you for:

1. **Block name** (kebab-case): `call-to-action`
2. **Block title**: `Call to Action`
3. **Block description**: `Prominent call-to-action section`
4. **Block icon** (dashicons): `megaphone`
5. **Keywords**: `cta, call, action, conversion`
6. **Attributes**: Define fields one by one

---

## Example Session

```bash
$ npm run generate-block

🎨 DapFlow Block Generator

Block name (kebab-case): call-to-action
Block title: Call to Action
Block description: Prominent call-to-action section with button
Block icon (dashicons): megaphone
Keywords (comma-separated): cta, call, action

📝 Define block attributes:

  Attribute name: title
  Attribute label: Title
  Attribute type: string
  Default value: Ready to get started?
  ✓ Attribute added

  Attribute name: description
  Attribute label: Description
  Attribute type: string
  Default value: Join thousands of users today
  ✓ Attribute added

  Attribute name: buttonText
  Attribute label: Button Text
  Attribute type: string
  Default value: Get Started
  ✓ Attribute added

  Attribute name: buttonUrl
  Attribute label: Button URL
  Attribute type: url
  Default value: #
  ✓ Attribute added

  Attribute name: bgColor
  Attribute label: Background Color
  Attribute type: string
  Default value: bg-primary
  ✓ Attribute added

  Attribute name: (press Enter to finish)

🔨 Generating files...

✓ Created: plugin/dapflow-blocks/blocks/call-to-action/block.json
✓ Created: plugin/dapflow-blocks/blocks/call-to-action/edit.js
✓ Created: plugin/dapflow-blocks/blocks/call-to-action/index.js
✓ Created: plugin/dapflow-blocks/blocks/call-to-action/style.scss
✓ Created: components/blocks/CallToAction.tsx
✓ Updated: lib/blocks/types.ts
✓ Updated: lib/blocks/block-registry.ts
✓ Updated: plugin/dapflow-blocks/src/index.js

🎉 Block generated successfully!

Next steps:
1. Customize the component: components/blocks/CallToAction.tsx
2. Customize editor controls: plugin/dapflow-blocks/blocks/call-to-action/edit.js
3. Build plugin: cd plugin/dapflow-blocks && npm run build
4. Test in WordPress editor
```

---

## Attribute Types

When defining attributes, you can use:

| Type | Description | Example Default |
|------|-------------|----------------|
| `string` | Text input | `"Hello World"` |
| `number` | Numeric input | `42` |
| `boolean` | Toggle switch | `true` or `false` |
| `url` | URL input | `"https://example.com"` |

---

## What Gets Generated

### 1. WordPress Block Files

**plugin/dapflow-blocks/blocks/[block-name]/**

```
├── block.json       # Block metadata & attributes
├── edit.js          # Editor UI with InspectorControls
├── index.js         # Block registration
└── style.scss       # Editor preview styles
```

### 2. Next.js Component

**components/blocks/[BlockName].tsx**

```typescript
import { Section, Container } from '@/components/craft';
import { Button } from '@/components/ui/button';

export interface CallToActionProps {
  title: string;
  description: string;
  buttonText: string;
  buttonUrl: string;
  bgColor?: string;
}

export function CallToAction({ 
  title, 
  description, 
  buttonText, 
  buttonUrl, 
  bgColor = 'bg-primary' 
}: CallToActionProps) {
  return (
    <Section className={bgColor}>
      <Container>
        <h2>{title}</h2>
        <p>{description}</p>
        <Button href={buttonUrl}>{buttonText}</Button>
      </Container>
    </Section>
  );
}
```

### 3. Type Definitions

**lib/blocks/types.ts** (automatically appended)

```typescript
export interface CallToActionBlockAttributes {
  title: string;
  description: string;
  buttonText: string;
  buttonUrl: string;
  bgColor?: string;
}
```

### 4. Registry Update

**lib/blocks/block-registry.ts** (automatically updated)

```typescript
import { CallToAction } from '@/components/blocks/CallToAction';

export const BLOCK_COMPONENTS = {
  'dapflow/hero': Hero,
  'dapflow/call-to-action': CallToAction,  // ← Added automatically
  // ...
};
```

### 5. Plugin Entry Update

**plugin/dapflow-blocks/src/index.js** (automatically updated)

```javascript
import '../blocks/hero/index.js';
import '../blocks/call-to-action/index.js';  // ← Added automatically
```

---

## After Generation

### Step 1: Customize Component

Edit `components/blocks/[BlockName].tsx`:

```typescript
// Add your custom styling
// Use shadcn/ui components
// Add interactions
// Make it match your design system
```

### Step 2: Customize Editor UI

Edit `plugin/dapflow-blocks/blocks/[block-name]/edit.js`:

```javascript
// Add more InspectorControls
// Improve preview display
// Add validation
// Add better UX
```

### Step 3: Build Plugin

```bash
cd plugin/dapflow-blocks
npm run build
```

### Step 4: Test in WordPress

1. Refresh WordPress editor
2. Click "+" to add block
3. Search for your block
4. Insert and test!

---

## Common Attribute Patterns

### Text Content

```
Attribute name: title
Attribute label: Title
Attribute type: string
Default value: Your Title Here
```

### Button with Link

```
Attribute name: buttonText
Attribute label: Button Text
Attribute type: string
Default value: Click Me

Attribute name: buttonUrl
Attribute label: Button URL
Attribute type: url
Default value: #
```

### Image

```
Attribute name: imageUrl
Attribute label: Image URL
Attribute type: url
Default value: https://via.placeholder.com/800x600

Attribute name: imageAlt
Attribute label: Image Alt Text
Attribute type: string
Default value: Image description
```

### Colors

```
Attribute name: bgColor
Attribute label: Background Color
Attribute type: string
Default value: bg-primary

Attribute name: textColor
Attribute label: Text Color
Attribute type: string
Default value: text-white
```

### Toggle

```
Attribute name: showIcon
Attribute label: Show Icon
Attribute type: boolean
Default value: true
```

---

## Tips & Best Practices

### Naming Conventions

- **Block name**: Use kebab-case (`call-to-action`, `feature-grid`)
- **Block title**: Use Title Case (`Call to Action`, `Feature Grid`)
- **Attribute names**: Use camelCase (`buttonText`, `bgColor`)

### Attribute Organization

Group related attributes:
1. Main content (title, subtitle, description)
2. CTAs (buttons, links)
3. Media (images, videos)
4. Styling (colors, layouts)
5. Toggles (show/hide features)

### Start Simple

Begin with basic attributes:
- Title
- Description
- One button
- One color

You can always add more later!

### Use Sensible Defaults

Provide good default values so the block looks decent immediately:
- ✅ `"Ready to get started?"` (helpful)
- ❌ `""` (empty, not helpful)

---

## Troubleshooting

### CLI won't run

```bash
# Make sure you're in project root
cd /path/to/DapFlow

# Run command
npm run generate-block
```

### Files not generated

Check that directories exist:
```bash
ls plugin/dapflow-blocks/blocks/
ls components/blocks/
ls lib/blocks/
```

### Build errors after generation

```bash
# Rebuild plugin
cd plugin/dapflow-blocks
rm -rf node_modules build
npm install
npm run build
```

### Block doesn't appear in WordPress

1. Build plugin: `npm run build`
2. Hard refresh editor (Cmd+Shift+R)
3. Check browser console for errors
4. Check `block.json` is valid JSON

---

## Advanced Usage

### Modify Generated Files

The CLI creates **starting templates**. You should customize:

- Component styling and layout
- Editor preview appearance
- Add more sophisticated controls
- Add validation
- Add conditional logic

### Create Variations

Generate a base block, then create variations:
```bash
npm run generate-block  # Create "hero"
# Copy and modify for "hero-split", "hero-centered", etc.
```

---

## Examples

### CTA Block

```
Block name: cta
Block title: Call to Action
Attributes: title, description, buttonText, buttonUrl, bgColor
```

### Feature Grid Block

```
Block name: features
Block title: Features Grid
Attributes: title, subtitle, columns (number), features (will need custom handling)
```

### Testimonial Block

```
Block name: testimonial
Block title: Testimonial
Attributes: quote, author, role, company, avatarUrl
```

### Pricing Block

```
Block name: pricing
Block title: Pricing Table
Attributes: planName, price, period, features, buttonText, buttonUrl, highlight (boolean)
```

---

## Next Steps

1. **Generate your first block**: `npm run generate-block`
2. **Customize the component**: Make it match your design
3. **Test thoroughly**: In WordPress editor and frontend
4. **Create more blocks**: Build your block library!

---

## Support

Questions or issues? Check:
- [Feature Spec](.context/features/gutenberg_blocks.md)
- [Getting Started](.context/GETTING_STARTED_BLOCKS.md)
- [Hero Block Example](components/blocks/Hero.tsx)

---

**Happy block building!** 🎨

