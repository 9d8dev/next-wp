# Dynamic WordPress Menu System

**Feature Version**: 1.0.0  
**Implementation Date**: October 6, 2025  
**Status**: ✅ Implemented, Pending Deployment  
**Owner**: DapFlow Team

---

## Feature Specification

### Purpose
Enable dynamic header navigation that pulls menu data from WordPress backend, allowing non-technical users to manage site navigation through the WordPress admin interface.

### Goals
1. ✅ WordPress admin can create/edit menus without code changes
2. ✅ Support nested dropdown menus
3. ✅ Mobile-responsive with slide-out menu
4. ✅ Integrate with existing design system (Tailwind, shadcn/ui)
5. ✅ Type-safe with TypeScript
6. ✅ Server-side rendering for SEO and performance

---

## Technical Architecture

### Component Structure

```
┌─────────────────────────────────────────┐
│  WordPress Admin (Menu Builder)         │
│  - Create menus                          │
│  - Organize items                        │
│  - Nest items for dropdowns              │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│  WordPress REST API Extension            │
│  (class-menu-api.php)                    │
│  - /wp-json/wp/v2/menus/{slug}           │
│  - Returns hierarchical menu data        │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│  Next.js API Client                      │
│  (lib/wordpress-menu.ts)                 │
│  - getPrimaryMenu()                      │
│  - buildMenuTree()                       │
│  - Caching: 1 hour                       │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│  Server Component                        │
│  (components/nav/dynamic-header.tsx)     │
│  - Fetches menu data                     │
│  - Passes to client component            │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│  Client Component                        │
│  (components/nav/header.tsx)             │
│  - Renders navigation                    │
│  - Handles interactions (mobile, dropdown)│
│  - Uses Headless UI                      │
└─────────────────────────────────────────┘
```

---

## Implementation Details

### WordPress Plugin Extension

**File**: `plugin/dapflow-blocks/includes/class-menu-api.php`

**Endpoints**:
- `GET /wp-json/wp/v2/menus` - List all menus
- `GET /wp-json/wp/v2/menus/{slug}` - Get menu by slug
- `GET /wp-json/wp/v2/menus/id/{id}` - Get menu by ID

**Response Format**:
```php
[
  'id' => 1,
  'name' => 'Primary Menu',
  'slug' => 'primary',
  'items' => [
    [
      'id' => 123,
      'title' => 'Home',
      'url' => 'https://dapflow.com',
      'target' => '_self',
      'parent' => 0,
      'children' => [],
      'description' => '',
      'icon' => '',
      'order' => 1,
    ]
  ]
]
```

### Next.js Menu Client

**File**: `lib/wordpress-menu.ts`

**Functions**:
- `getMenu(slug)` - Fetch any menu by slug
- `getPrimaryMenu()` - Fetch primary navigation
- `getFooterMenu()` - Fetch footer menu
- `buildMenuTree(items)` - Convert flat array to hierarchical tree

**Caching**: 1 hour via Next.js `revalidate`

### Header Components

**Server Component**: `components/nav/dynamic-header.tsx`
- Fetches menu data
- Passes to client component
- No interactivity needed here

**Client Component**: `components/nav/header.tsx`
- Renders navigation UI
- Handles state (mobile menu open/close)
- Implements Headless UI components:
  - `Popover` for desktop dropdowns
  - `Dialog` for mobile slide-out menu
  - `Disclosure` for mobile dropdowns

---

## UI/UX Design

### Desktop Header
- Logo on left
- Menu items in center
- Theme toggle on right
- Dropdown menus with smooth transitions
- Hover states with color changes

### Mobile Header
- Hamburger menu button
- Slide-out panel from right
- Collapsible dropdowns
- Full-height overlay
- Close button

### Design System Integration
- **Tailwind CSS**: All styling
- **Headless UI**: Accessible components
- **craft**: Layout containers (Section, Container)
- **Theme**: Respects light/dark mode

---

## Menu Structure in WordPress

### Simple Menu (No Dropdowns)
```
- Home
- About
- Blog
- Contact
```

### Menu with Dropdowns
```
- Home
- Products ▼
  - Analytics
  - Security
  - Integrations
- Features
- Company ▼
  - About Us
  - Careers
  - Contact
```

### How to Create Dropdown
1. Add parent item (e.g., "Products")
2. Add child items (e.g., "Analytics")
3. **Drag child item to the right** to nest under parent
4. Child items will appear in dropdown

---

## Type Definitions

```typescript
interface MenuItem {
  id: number
  title: string
  url: string
  target: '_self' | '_blank'
  classes: string[]
  children?: MenuItem[]
  icon?: string
  description?: string
}

interface Menu {
  id: number
  name: string
  slug: string
  items: MenuItem[]
}
```

---

## Caching Strategy

### Next.js (Frontend)
- **Revalidate**: Every 1 hour (3600 seconds)
- **Strategy**: Incremental Static Regeneration (ISR)
- **Cache**: Server-side fetch cache

### Invalidation
Menus update automatically after 1 hour, or:
1. Use Next.js revalidate API: `/api/revalidate?secret=...`
2. Deploy new build
3. Clear Next.js cache manually

---

## Performance

- **Initial Load**: Menu fetched on server-side (no client delay)
- **Subsequent Loads**: Cached for 1 hour
- **Bundle Size**: ~15KB (Headless UI + icons)
- **Interactive**: Only mobile menu and dropdowns use client JS

---

## Accessibility

✅ **Keyboard Navigation**: Full keyboard support via Headless UI  
✅ **Screen Readers**: Proper ARIA labels and roles  
✅ **Focus Management**: Automatic focus handling  
✅ **Mobile**: Touch-friendly tap targets  
✅ **Semantic HTML**: Proper `<nav>`, `<header>` tags  

---

## Security

- **REST API**: Public endpoint (read-only)
- **Permissions**: `__return_true` (public access)
- **Sanitization**: All inputs sanitized
- **XSS Protection**: WordPress escapes all output
- **HTTPS**: All API calls over SSL

---

## Testing Checklist

### WordPress Admin
- [ ] Create menu in WordPress admin
- [ ] Add top-level items
- [ ] Add nested items (dropdowns)
- [ ] Add descriptions to dropdown items
- [ ] Assign menu to "Primary" location
- [ ] Save menu

### API Verification
- [ ] Test `/wp-json/wp/v2/menus/primary` endpoint
- [ ] Verify JSON response structure
- [ ] Check all menu items present
- [ ] Verify nested items (parent field)

### Frontend (Next.js)
- [ ] Desktop: Menu items display correctly
- [ ] Desktop: Dropdowns work on hover/click
- [ ] Desktop: Links navigate correctly
- [ ] Mobile: Hamburger menu opens
- [ ] Mobile: Menu items display
- [ ] Mobile: Dropdowns expand/collapse
- [ ] Mobile: Links navigate and close menu
- [ ] Theme toggle works
- [ ] Dark mode styling correct

### Responsive Design
- [ ] Test on desktop (1920px+)
- [ ] Test on tablet (768px - 1024px)
- [ ] Test on mobile (375px - 767px)
- [ ] Verify breakpoints work correctly

---

## Future Enhancements

### Phase 2
1. **Icon Support**: Add icons to menu items
2. **Mega Menu**: Support for 2D grid dropdowns
3. **Search**: Add search bar in header
4. **CTA Button**: Configurable call-to-action button
5. **User Menu**: Account/profile dropdown

### Phase 3
1. **Menu Caching**: Advanced caching strategies
2. **Analytics**: Track menu interactions
3. **A/B Testing**: Test different menu layouts
4. **Personalization**: Show different menus per user
5. **Multi-Language**: Support for i18n menus

---

## Maintenance

### When Menu Changes
- Changes appear on frontend after 1 hour (cache TTL)
- Or force revalidation via API

### When Adding Menu Locations
1. Register location in WordPress theme
2. Create `getLocationMenu()` function in `lib/wordpress-menu.ts`
3. Create new header/footer component
4. Use in layout

### When Updating Styles
- Edit `components/nav/header.tsx`
- Changes deploy automatically via Vercel

---

## Related Documentation

- [MENU_SYSTEM.md](../../MENU_SYSTEM.md) - Deployment guide
- [ADR-2025-001](../decisions/ADR-2025-001-gutenberg-block-system.md) - Block system architecture
- [WordPress Menus](https://wordpress.org/documentation/article/appearance-menus-screen/) - Official docs

---

## Questions & Answers

**Q: Can I have multiple menus?**  
A: Yes! Create multiple menus in WordPress and fetch them with different slugs.

**Q: How do I add icons?**  
A: Use custom fields in WordPress or update the Header component to map item classes to icons.

**Q: Can I style individual menu items?**  
A: Yes! Use the "CSS Classes" field in WordPress menu editor, then add CSS in `globals.css`.

**Q: How do I force menu refresh?**  
A: Call `/api/revalidate?secret=YOUR_SECRET` or wait for 1-hour cache to expire.

**Q: Can I use this for footer menus?**  
A: Yes! Call `getFooterMenu()` and create a `DynamicFooter` component.

---

**Status**: ✅ Feature Complete, Ready for Deployment

