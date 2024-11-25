/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.fitdoplnky.sk",
        port: "",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
