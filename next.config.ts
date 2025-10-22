import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      new URL(`${process.env.NEXT_WORDPRESS_URL}/wp-content/**`),
      new URL(`${process.env.NEXT_PUBLIC_WORDPRESS_URL}/wp-content/**`),
    ],
  },
  async redirects() {
    return [
      {
        source: "/admin",
        destination: `${process.env.NEXT_WORDPRESS_URL}/wp-admin`,
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
