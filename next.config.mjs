/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "windpress.wpenginepowered.com",
        port: "",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
