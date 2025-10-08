import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      new URL(`${process.env.WORDPRESS_URL}/wp-content/**`),
      new URL(`https://sysblok.ru/wp-content/**`),
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
  output: "standalone",
};

export default nextConfig;
