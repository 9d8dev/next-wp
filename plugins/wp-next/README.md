# WP Next

A WordPress plugin for seamless WordPress to Next.js headless integration.

**Author:** [phucbm](https://github.com/phucbm)
**Version:** 1.0.0
**License:** GPLv2 or later

## Overview

WP Next simplifies the integration between WordPress and Next.js headless applications by providing:

1. **Custom REST API Endpoint Management** - Switch to a custom REST API endpoint URL
2. **Public Data Exposure Routes** - Create custom REST endpoints to expose selected site information
3. **Reactive Admin Interface** - User-friendly settings with real-time previews powered by Alpine.js

## Features

### General Settings Tab

- Toggle to use custom REST API endpoint
- Configure custom endpoint URL (e.g., `https://api.example.com`)
- Real-time preview of active endpoint

### Custom Routes Tab

- Enable/disable custom data exposure routes
- Customize route path (defaults to `/wp-json/wp-next/site-info`)
- Select which site data to expose:
  - **Title** - Site name
  - **Description** - Site tagline
  - **Favicon** - Site icon URL (from WordPress site icon or `/favicon.ico`)
  - **Language** - Site locale
  - **Timezone** - Site timezone

## Installation

1. Upload the `wp-next` folder to `/wp-content/plugins/`
2. Activate via WordPress Plugins menu
3. Configure via Admin > WP Next

## Configuration

### Basic Setup

1. Navigate to **Admin Dashboard > WP Next**
2. Choose between two tabs: **General** and **Custom Routes**

### General Settings

```
Endpoint Configuration
├── [Toggle] Use Custom REST API Endpoint
├── [Input] Custom Endpoint URL (conditional)
└── [Preview] Current active endpoint
```

### Custom Routes

```
Custom Route Configuration
├── [Toggle] Enable Custom Route Data Exposure
├── [Input] Route Path
├── [Checkboxes] Select data to expose
│   ├── ☐ Title
│   ├── ☐ Description
│   ├── ☐ Favicon
│   ├── ☐ Language
│   └── ☐ Timezone
└── [Preview] Endpoint & response structure
```

## Usage

### Example API Response

With custom route enabled at `/wp-json/wp-next/site-info` with title and favicon exposed:

```bash
GET /wp-json/wp-next/site-info
```

```json
{
  "title": "My Blog",
  "favicon": "https://example.com/wp-content/uploads/2024/01/favicon.png"
}
```

### Using in Next.js

```typescript
// lib/wordpress.ts
const getSiteInfo = async () => {
  const endpoint = process.env.NEXT_PUBLIC_WP_NEXT_ENDPOINT ||
    `${process.env.WORDPRESS_URL}/wp-json/wp-next/site-info`;

  const response = await fetch(endpoint);
  return response.json();
};
```

## Architecture

### Directory Structure

```
wp-next/
├── wp-next.php                          # Plugin entry point
├── includes/
│   ├── class-wp-next.php               # Main orchestrator
│   ├── class-settings.php              # Settings manager
│   ├── class-validators.php            # Input validation
│   ├── admin/
│   │   ├── class-admin-page.php        # Admin interface
│   │   └── tabs/
│   │       ├── class-tab-general.php
│   │       └── class-tab-custom-routes.php
│   └── rest-api/
│       └── class-custom-routes.php     # REST endpoint handler
└── assets/
    ├── admin.js                        # Alpine.js logic
    └── admin.css                       # Styles
```

### Key Classes

**WP_Next_Settings** - Settings manager with dot-notation support
```php
WP_Next_Settings::get('enable_custom_routes');
WP_Next_Settings::get('expose_data.title');
WP_Next_Settings::get_endpoint(); // Get active endpoint
```

**WP_Next_Validators** - Input validation and sanitization
```php
WP_Next_Validators::sanitize_settings($input);
WP_Next_Validators::validate_endpoint($url);
```

**WP_Next_Custom_Routes** - REST API endpoint registration and handling
```php
WP_Next_Custom_Routes::register_routes();
WP_Next_Custom_Routes::get_site_info();
```

## Extending the Plugin

To add a new settings tab:

1. Create a new tab class in `includes/admin/tabs/class-tab-*.php`
2. Implement the required methods:
   ```php
   public function get_id()      // Tab ID
   public function get_label()   // Display label
   public function render($settings) // Render HTML
   ```
3. Instantiate in `WP_Next_Admin_Page::init_tabs()`

Example:

```php
class WP_Next_Tab_Advanced {
    public function get_id() { return 'advanced'; }
    public function get_label() { return 'Advanced'; }
    public function render($settings) {
        // Render tab content with form fields
    }
}
```

## Data Storage

All settings are stored in a single WordPress option:

```php
option_name: 'wp_next_settings'
option_value: {
    'use_custom_endpoint': boolean,
    'custom_endpoint': string,
    'enable_custom_routes': boolean,
    'custom_route_path': string,
    'expose_data': {
        'title': boolean,
        'description': boolean,
        'favicon': boolean,
        'language': boolean,
        'timezone': boolean
    }
}
```

## FAQ

**Q: Is the custom route public?**
A: Yes, the custom route is public and requires no authentication.

**Q: Can I change the route path?**
A: Yes, you can customize it in the Custom Routes tab. Must start with `/`.

**Q: Where does the favicon come from?**
A: From WordPress Site Icon (Settings > Site Icon) or falls back to `/favicon.ico`.

**Q: Can I disable specific data fields?**
A: Yes, uncheck the fields you don't want to expose.

## License

GPLv2 or later

## Support

For issues and feature requests, visit [phucbm on GitHub](https://github.com/phucbm)