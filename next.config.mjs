/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains: [
            "lh3.googleusercontent.com",
        ]
    }, 
    experimental: {
        allowedDevOrigins: [
            "https://e3603bcffc45.ngrok-free.app"
        ]
    },
};

export default nextConfig;
