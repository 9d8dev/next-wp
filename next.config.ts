import type { NextConfig } from "next";

const wordpressHostname = process.env.WORDPRESS_HOSTNAME;
const wordpressUrl = process.env.WORDPRESS_URL;

const nextConfig: NextConfig = {
  output: "standalone",
  // Mirror WordPress permalinks, which use trailing slashes (e.g. /news/foo/).
  trailingSlash: true,
  // Limit build-time concurrency. The WordPress host returns 5xx when too many
  // static-generation workers hit it at once; fewer workers keeps builds
  // reliable (sitemap + pre-rendering) at the cost of slightly longer builds.
  experimental: {
    cpus: 2,
  },
  // Pin the workspace root to this project so Turbopack doesn't infer a
  // parent directory when multiple lockfiles exist on the machine.
  turbopack: {
    root: __dirname,
  },
  images: {
    remotePatterns: wordpressHostname
      ? [
          {
            protocol: "https",
            hostname: wordpressHostname,
            port: "",
            pathname: "/**",
          },
        ]
      : [],
  },
  async redirects() {
    if (!wordpressUrl) {
      return [];
    }
    return [
      {
        source: "/admin",
        destination: `${wordpressUrl}/wp-admin`,
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
