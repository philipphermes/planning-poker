import type {NextConfig} from "next";

const nextConfig: NextConfig = {
    async rewrites() {
        return [
            {
                source: "/uploads/:path*",
                destination: "/public/uploads/:path*",
            },
        ];
    },
};

export default nextConfig;
