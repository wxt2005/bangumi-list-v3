const path = require('path');

/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${
          process.env.API_HOST || 'http://localhost:3001'
        }/api/:path*`,
      },
    ];
  },
  webpack(config, { defaultLoaders }) {
    config.module.rules.push({
      test: /\.(ts|tsx)$/,
      include: [path.resolve(__dirname, '../shared')],
      use: [defaultLoaders.babel],
    });
    config.module.rules.push({
      test: /\.svg$/,
      use: [
        {
          loader: '@svgr/webpack',
          options: {
            dimensions: false,
          },
        },
      ],
    });
    return config;
  },
  reactStrictMode: true,
};

module.exports = nextConfig;
