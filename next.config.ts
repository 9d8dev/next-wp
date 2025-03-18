import type { NextConfig } from "next";

// Parse the WordPress URL to get hostname and port
const wordpressUrl = new URL(process.env.WORDPRESS_URL || 'http://localhost:8884');
const hostname = wordpressUrl.hostname;
const port = wordpressUrl.port;
const protocol = wordpressUrl.protocol.replace(':', '') as 'http' | 'https';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol,
        hostname,
        port,
        pathname: "/**",
      },
    ],
  },
  async redirects() {
    return [
      {
        source: "/admin",
        destination: `${process.env.WORDPRESS_URL}/wp-admin`,
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
