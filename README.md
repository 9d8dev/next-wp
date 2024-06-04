# Next.js Starter for Wordpress Headless CMS

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2F9d8dev%2Fnext-wp&env=WORDPRESS_URL,WORDPRESS_HOSTNAME&envDescription=Add%20Wordpress%20URL%20with%20Rest%20API%20enabled%20(ie.%20https%3A%2F%2Fwp.example.com)%20abd%20the%20hostname%20for%20Image%20rendering%20in%20Next%20JS%20(ie.%20wp.example.com)&project-name=next-wp&repository-name=next-wp&demo-title=Next%20JS%20and%20WordPress%20Starter&demo-url=https%3A%2F%2Fwp.9d8.dev)

- `lib/wordpress.ts` -> Functions for fetching WordPress CMS via Rest API
- `lib/wordpress.d.ts` -> Type declarations for WP Rest API
- `components/posts/post-card.tsx` -> Component and styling for posts
- `app/posts/filter.tsx` -> Component for handling filtering of posts

Two `env` variables are required to be set in `.env.local` file:

```bash
WORDPRESS_URL="https://wordpress.com"
WORDPRESS_HOSTNAME="wordpress.com"
```

You can find the exampple of `.env.local` file in the `.env.example` file.
