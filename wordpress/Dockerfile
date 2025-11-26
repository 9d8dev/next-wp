FROM wordpress:latest

# Install WP-CLI
RUN curl -O https://raw.githubusercontent.com/wp-cli/builds/gh-pages/phar/wp-cli.phar \
    && chmod +x wp-cli.phar \
    && mv wp-cli.phar /usr/local/bin/wp

# Copy the revalidation plugin
COPY next-revalidate /var/www/html/wp-content/plugins/next-revalidate

# Copy the setup scripts
COPY setup.sh /usr/local/bin/setup-wordpress.sh
COPY entrypoint.sh /usr/local/bin/custom-entrypoint.sh
RUN chmod +x /usr/local/bin/setup-wordpress.sh /usr/local/bin/custom-entrypoint.sh

ENTRYPOINT ["/usr/local/bin/custom-entrypoint.sh"]
CMD ["apache2-foreground"]
