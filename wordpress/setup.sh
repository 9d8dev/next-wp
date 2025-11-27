#!/bin/bash
set -e

# Wait for database to be ready
until wp db check --allow-root 2>/dev/null; do
  echo "Waiting for database..."
  sleep 3
done

# Check if WordPress is already installed
if ! wp core is-installed --allow-root 2>/dev/null; then
  echo "Installing WordPress..."

  wp core install \
    --url="${WORDPRESS_URL:-http://localhost}" \
    --title="${WORDPRESS_TITLE:-My WordPress Site}" \
    --admin_user="${WORDPRESS_ADMIN_USER:-admin}" \
    --admin_password="${WORDPRESS_ADMIN_PASSWORD:-changeme}" \
    --admin_email="${WORDPRESS_ADMIN_EMAIL:-admin@example.com}" \
    --skip-email \
    --allow-root

  echo "WordPress installed successfully!"
fi

# Activate the revalidation plugin if not already active
if ! wp plugin is-active next-revalidate --allow-root 2>/dev/null; then
  echo "Activating Next.js Revalidation plugin..."
  wp plugin activate next-revalidate --allow-root
fi

# Activate the headless theme
current_theme=$(wp theme list --status=active --field=name --allow-root 2>/dev/null)
if [ "$current_theme" != "nextjs-headless" ]; then
  echo "Activating Next.js Headless theme..."
  wp theme activate nextjs-headless --allow-root
fi

# Configure the plugin if NEXTJS_URL is set
if [ -n "$NEXTJS_URL" ]; then
  echo "Configuring Next.js Revalidation plugin..."
  wp option update next_revalidate_settings "{\"nextjs_url\":\"${NEXTJS_URL}\",\"webhook_secret\":\"${WORDPRESS_WEBHOOK_SECRET:-}\",\"enable_notifications\":false,\"cooldown\":2}" --format=json --allow-root
  echo "Plugin configured with Next.js URL: $NEXTJS_URL"
fi

echo "WordPress setup complete!"
