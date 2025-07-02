const isProd = process.env.NODE_ENV === 'production';

const nextConfig = {
  env: {
    NEXT_PUBLIC_SERVER_URL: '/api',
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
    return isProd
      ? [
          {
            source: '/api/:path*',
            destination: 'https://api.todolist.chifer123536.ru/:path*'
          }
        ]
      : [
          {
            source: '/api/:path*',
            destination: 'http://localhost:4444/:path*'
          }
        ];
  }
};
