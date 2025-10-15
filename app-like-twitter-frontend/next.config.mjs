/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["127.0.0.1", "yourdomain.com"],
  },
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ["@svgr/webpack"],
    });
    return config;
  },
  async rewrites() {
    return [
      {
        source: '/u/password/reset/confirm/:uid/:token',
        destination: '/reset-confirm/:uid/:token',
      },
    ];
  },
};

export default nextConfig;
