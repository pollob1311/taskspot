/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'www.cpagrip.com',
            },
            {
                protocol: 'https',
                hostname: 'static.cpagrip.com',
            },
            {
                protocol: 'http',
                hostname: 'www.cpagrip.com',
            },
        ],
    },
    experimental: {
        serverActions: {
            bodySizeLimit: '2mb',
        },
    },
};

export default nextConfig;