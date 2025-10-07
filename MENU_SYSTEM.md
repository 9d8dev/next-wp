# WordPress Menu System Integration

**Version**: 1.0.0  
**Date**: October 6, 2025  
**Status**: ✅ Ready to Deploy

---

## Overview

DapFlow now has a **dynamic header** that fetches menu data from WordPress, allowing you to manage navigation through the WordPress admin interface.

## Features

✅ **WordPress Admin Menu Management**: Create and edit menus in WordPress  
✅ **Headless UI Components**: Beautiful dropdowns with Headless UI  
✅ **Responsive Design**: Mobile-first with slide-out menu  
✅ **Dark Mode**: Theme toggle integrated  
✅ **Nested Menus**: Support for dropdown submenus  
✅ **Type-Safe**: Full TypeScript support  
✅ **Next.js Optimized**: Server-side rendering with caching  

---

## Architecture

```
WordPress Admin → Create Menu → REST API → Next.js → Render Header
```

### Data Flow

1. **Create Menu in WordPress** (`/wp-admin/nav-menus.php`)
2. **WordPress REST API** exposes menu data (`/wp-json/wp/v2/menus/primary`)
3. **Next.js fetches** menu data on server-side
4. **React components** render the header with menu items

---

## Files Created

### WordPress Plugin (Backend)
- `plugin/dapflow-blocks/includes/class-menu-api.php` - REST API for menus

### Next.js (Frontend)
- `lib/wordpress-menu.ts` - Menu API client
- `components/nav/header.tsx` - Header client component  
- `components/nav/dynamic-header.tsx` - Server component wrapper

### Modified
- `app/layout.tsx` - Uses DynamicHeader instead of static Nav
- `plugin/dapflow-blocks/dapflow-blocks.php` - Initializes menu API

---

## Deployment Steps

### 1. Deploy WordPress Plugin

The plugin has been updated with menu API support.

**Option A: Manual Upload**
```bash
# The zip is ready at:
plugin/dapflow-blocks-dist/dapflow-blocks-menu.zip

# Steps:
1. Go to https://cms.dapflow.com/wp-admin/plugins.php
2. Deactivate "DapFlow Blocks" (if active)
3. Delete the old plugin
4. Click "Add New Plugin" → "Upload Plugin"
5. Upload dapflow-blocks-menu.zip
6. Activate the plugin
```

**Option B: SSH/SCP**
```bash
# If you have SSH access:
scp plugin/dapflow-blocks-dist/dapflow-blocks-menu.zip user@host:~/
ssh user@host
unzip dapflow-blocks-menu.zip -d /path/to/wp-content/plugins/dapflow-blocks/
```

### 2. Create Menu in WordPress

1. Go to https://cms.dapflow.com/wp-admin/nav-menus.php
2. Create a new menu called "Primary Menu"
3. Add menu items (Pages, Custom Links, etc.)
4. For dropdown menus:
   - Add parent item (e.g., "Products")
   - Add child items and drag them under the parent
5. Assign menu to "Primary" location (or name it "primary")
6. Click "Save Menu"

### 3. Verify API Endpoint

Test the menu API:
```bash
curl https://cms.dapflow.com/wp-json/wp/v2/menus/primary
```

Expected response:
```json
{
  "id": 1,
  "name": "Primary Menu",
  "slug": "primary",
  "items": [
    {
      "id": 123,
      "title": "Home",
      "url": "https://dapflow.com",
      "target": "_self",
      "classes": [],
      "parent": 0,
      "description": "",
      "icon": "",
      "order": 1
    }
  ]
}
```

### 4. Deploy Next.js Frontend

The Next.js code is already in the `develop` branch and will auto-deploy to Vercel when you push.

```bash
git add .
git commit -m "feat: Add dynamic WordPress menu system"
git push origin develop
```

Vercel will automatically deploy to:
- **Staging**: https://stage.dapflow.com
- **Production**: (after merging to main)

---

## Usage in WordPress

### Creating a Simple Menu

1. **Add Top-Level Items**:
   - Home
   - About
   - Blog
   - Contact

2. **Add Dropdown Menu**:
   - Add "Products" as a parent
   - Add "Analytics", "Security", "Integrations" as children
   - Drag children to the right to nest them under "Products"

### Menu Item Options

Each menu item supports:
- **Title**: Display text
- **URL**: Link destination (internal or external)
- **Target**: `_self` (same window) or `_blank` (new tab)
- **CSS Classes**: Custom styling
- **Description**: Shown in dropdown (optional)

---

## Customization

### Changing Header Style

Edit `components/nav/header.tsx`:

```tsx
// Change colors
<header className="bg-gray-900"> // Your background color
  <nav className="mx-auto flex max-w-7xl"> // Your max width
```

### Adding Icons to Menu Items

Icons can be added via WordPress menu item meta fields. To enable:

1. Add custom field support in WordPress
2. Store icon name in `_menu_item_icon` meta
3. Update `components/nav/header.tsx` to render icons

### Customizing Dropdown Style

The dropdown uses Headless UI `PopoverPanel`:

```tsx
<PopoverPanel
  className="absolute ... rounded-3xl bg-background border" // Your styles
>
```

---

## API Endpoints

### Get All Menus
```
GET /wp-json/wp/v2/menus
```

Returns list of all registered menus.

### Get Menu by Slug
```
GET /wp-json/wp/v2/menus/{slug}
```

Examples:
- `/wp-json/wp/v2/menus/primary`
- `/wp-json/wp/v2/menus/footer`
- `/wp-json/wp/v2/menus/mobile`

### Get Menu by ID
```
GET /wp-json/wp/v2/menus/id/{id}
```

Example: `/wp-json/wp/v2/menus/id/2`

---

## TypeScript Types

```typescript
interface MenuItem {
  id: number
  title: string
  url: string
  target: string
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

## Caching

Menu data is cached for **1 hour** (3600 seconds):

```typescript
fetch(`${WP_API_URL}/wp/v2/menus/${slug}`, {
  next: { revalidate: 3600 }, // Cache for 1 hour
})
```

To force menu refresh:
1. Use the Next.js revalidate API
2. Or wait for cache to expire
3. Or deploy new build

---

## Troubleshooting

### Menu not showing
1. ✅ Check WordPress menu is created and saved
2. ✅ Verify menu slug is "primary" (or update `getPrimaryMenu()`)
3. ✅ Test API endpoint: `/wp-json/wp/v2/menus/primary`
4. ✅ Check browser console for errors
5. ✅ Verify plugin is activated in WordPress

### 404 Error on Menu API
1. ✅ Ensure WordPress plugin is uploaded and activated
2. ✅ Check permalink settings in WordPress (Settings → Permalinks)
3. ✅ Verify `.htaccess` allows REST API access

### Items not appearing
1. ✅ Check menu items are published (not draft)
2. ✅ Verify menu is assigned to a location
3. ✅ Check menu item URLs are correct

---

## Next Steps

### Immediate
1. Deploy WordPress plugin (`dapflow-blocks-menu.zip`)
2. Create "Primary Menu" in WordPress admin
3. Test menu API endpoint
4. Push code to GitHub (auto-deploy to Vercel)
5. Verify on staging site

### Future Enhancements
1. Add icons to menu items
2. Create footer dynamic menu
3. Add mega menu support
4. Implement menu search
5. Add keyboard navigation
6. Support for menu badges/labels

---

## References

- **Plugin Zip**: `plugin/dapflow-blocks-dist/dapflow-blocks-menu.zip`
- **WordPress Menus**: https://cms.dapflow.com/wp-admin/nav-menus.php
- **API Endpoint**: https://cms.dapflow.com/wp-json/wp/v2/menus/primary
- **Headless UI**: https://headlessui.com/
- **Heroicons**: https://heroicons.com/

---

**Ready to deploy!** 🚀

