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
                source: "/manager",
                destination: `${process.env.WORDPRESS_LOGIN_URL}`,
                permanent: true,
            },
        ];
    },
};

export default nextConfig;
