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
                destination: `https://nextwp-cms.phucbm.com/wp-login.php?wp-next-hb-token=manager`,
                permanent: true,
            },
        ];
    },
};

export default nextConfig;
