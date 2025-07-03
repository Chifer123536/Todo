/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    NEXT_PUBLIC_SERVER_URL: process.env.NEXT_PUBLIC_SERVER_URL,
    NEXT_PUBLIC_GOOGLE_RECAPTCHA_SITE_KEY:
      process.env.NEXT_PUBLIC_GOOGLE_RECAPTCHA_SITE_KEY
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com'
      },
      {
        protocol: 'https',
        hostname: 'avatars.yandex.net'
      }
    ]
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:4444/api/:path*'
      }
    ];
  }
};

export default nextConfig;
