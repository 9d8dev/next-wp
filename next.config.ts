// next.config.ts
import type {NextConfig} from "next";

const nextConfig: NextConfig = {
    images: {
        remotePatterns: [new URL(`${process.env.WORDPRESS_URL}/**`)],
        // unoptimized: process.env.NODE_ENV === "development",
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
