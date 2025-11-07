// import type { NextConfig } from "next";

// const nextConfig: NextConfig = {
//   images: {
//     remotePatterns: [
//       new URL(`${process.env.NEXT_PUBLIC_WORDPRESS_URL}/wp-content/**`),
//     ],
//   },
//   async redirects() {
//     return [
//       {
//         source: "/admin",
//         destination: `${process.env.NEXT_PUBLIC_WORDPRESS_URL}/wp-admin`,
//         permanent: true,
//       },
//     ];
//   },
//   output: "standalone",
// };

// export default nextConfig;

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "sysblok.ru",
        pathname: "/wp-content/**",
      },
    ],
  },
  async redirects() {
    return [
      {
        source: "/admin",
        destination: `${
          process.env.WORDPRESS_URL || "https://sysblok.ru"
        }/wp-admin`,
        permanent: true,
      },
    ];
  },
  output: "standalone",
};

export default nextConfig;
