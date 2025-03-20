/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    // See https://webpack.js.org/configuration/resolve/#resolvealias
    config.resolve.alias = {
      ...config.resolve.alias,
      sharp$: false,
      'onnxruntime-node$': false,
    };
    return config;
  },
  experimental: {
    outputFileTracingIncludes: {
      '/*': ['./cache/**/*'],
    },
  },
  async headers() {
    return [
      {
        source: '/(.*)', // Apply to all routes
        headers: [
          {
            key: 'Content-Security-Policy',
            value: "frame-ancestors 'self' localhost saleor-front-two.vercel.app;",
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
