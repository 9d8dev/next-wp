# Next.js WordPress Revalidation Plugin

This plugin enables automatic revalidation of your Next.js site when content is changed in WordPress.

## Installation

1. Upload the `next-revalidate.zip` file through the WordPress admin plugin installer, or
2. Extract the `next-revalidate` folder to your `/wp-content/plugins/` directory
3. Activate the plugin through the WordPress admin interface
4. Go to Settings > Next.js Revalidation to configure your settings

## Configuration

### 1. WordPress Plugin Settings

After installing and activating the plugin:

1. Go to Settings > Next.js Revalidation in your WordPress admin
2. Enter your Next.js site URL (without trailing slash)
3. Create a secure webhook secret (a random string), you can use `openssl rand -base64 32` to generate one
4. Save your settings

### 2. Next.js Environment Variables

Add the webhook secret to your Next.js environment variables:

```bash
# .env.local
WORDPRESS_WEBHOOK_SECRET="your-secret-key-here"
```

## How It Works

1. When content in WordPress is created, updated, or deleted, the plugin sends a webhook to your Next.js API route
2. The webhook contains information about the content type (post, page, category, etc.) and ID
3. The Next.js API validates the request using the secret and revalidates the appropriate cache tags
4. Your Next.js site will fetch new content for the affected pages

## Features

- Automatic revalidation for posts, pages, categories, tags, and media
- Manual revalidation option through the admin interface
- Secure webhook communication with your Next.js site
- Optional admin notifications for revalidation events

## Troubleshooting

If revalidation isn't working:

1. Check that your Next.js URL is correct in the plugin settings
2. Verify the webhook secret matches in both WordPress and Next.js
3. Check your server logs for any errors in the API route
4. Enable notifications in the plugin settings to see revalidation status
