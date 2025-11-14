=== WP Next ===
Contributors: phucbm
Tags: next.js, headless, wordpress, rest-api, custom-routes
Requires at least: 5.0
Tested up to: 6.4
Stable tag: 1.0.0
Requires PHP: 7.4
License: GPLv2 or later
License URI: https://www.gnu.org/licenses/gpl-2.0.html

Configure your WordPress site for seamless integration with Next.js headless projects.

== Description ==

WP Next is a WordPress plugin designed to simplify the integration between WordPress and Next.js headless applications. It provides an admin interface to manage custom REST API endpoints and expose public site information through configurable custom routes.

**Key Features:**

* Switch between default and custom REST API endpoints
* Create custom public data exposure endpoints
* Select which site information to expose (title, description, favicon, language, timezone)
* Automatic favicon detection from WordPress site icon
* Reactive admin interface with Alpine.js
* Modular, extensible code structure for easy customization

== Installation ==

1. Upload the `wp-next` folder to the `/wp-content/plugins/` directory
2. Activate the plugin through the 'Plugins' menu in WordPress
3. Go to Admin > WP Next to configure your settings

== Configuration ==

=== General Settings ===

1. Visit Admin > WP Next > General
2. Optionally enable "Use Custom REST API Endpoint"
3. If enabled, enter your custom endpoint URL
4. Click "Save Settings"

=== Custom Routes ===

1. Visit Admin > WP Next > Custom Routes
2. Enable "Enable Custom Route Data Exposure"
3. Optionally customize the route path (defaults to `/wp-json/wp-next/site-info`)
4. Select which data fields to expose:
   - Site Title
   - Site Description
   - Favicon URL
   - Language
   - Timezone
5. Click "Save Settings"

When enabled, the custom route becomes accessible as a public REST endpoint returning JSON with the selected fields.

== Frequently Asked Questions ==

= What is a custom REST API endpoint? =

A custom endpoint allows you to route all REST API calls to a different URL instead of the default WordPress REST API location.

= Is the custom route endpoint public? =

Yes, the custom route endpoint is public by default and requires no authentication. This makes it ideal for exposing basic site information to your Next.js frontend.

= Where does the favicon URL come from? =

The plugin first attempts to get the favicon from WordPress Site Icon settings. If not set, it falls back to `/favicon.ico`.

= Can I modify the exposed data programmatically? =

Yes, the settings are stored as WordPress options and can be modified via the Settings Manager class or WordPress hooks.

== Changelog ==

= 1.0.0 =
* Initial release
* Custom REST API endpoint switching
* Public custom routes for site data exposure
* Reactive admin UI with Alpine.js

== Upgrade Notice ==

= 1.0.0 =
Initial release of WP Next plugin.