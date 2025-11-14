import type {NextConfig} from "next";

const wpUrl = process.env.WORDPRESS_URL
    ? new URL(process.env.WORDPRESS_URL)
    : null;

const nextConfig: NextConfig = {
    images: {
        // use the URL instance directly — satisfies (URL | RemotePattern)[]
        remotePatterns: wpUrl ? [wpUrl] : [],
        unoptimized: process.env.NODE_ENV === "development",
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
