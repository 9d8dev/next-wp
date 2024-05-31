# Next.js Starter for Wordpress Headless CMS

- `lib/wordpress.ts` -> Functions for fetching WordPress CMS via Rest API
- `lib/wordpress.d.ts` -> Type declarations for WP Rest API

Two `env` variables are required to be set in `.env.local` file:

```bash
WORDPRESS_URL="https://wordpress.com"
WORDPRESS_HOSTNAME="wordpress.com"
```

You can find the exampple of `.env.local` file in the `.env.example` file.
