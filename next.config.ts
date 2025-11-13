import type {NextConfig} from "next";

const nextConfig: NextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: "http",
                hostname: `${process.env.WORDPRESS_HOSTNAME}`,
                port: "",
                pathname: "/**",
            },
            {
                protocol: "https",
                hostname: `${process.env.WORDPRESS_HOSTNAME}`,
                port: "",
                pathname: "/**",
            },
        ],
        unoptimized: process.env.NODE_ENV === 'development',
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
