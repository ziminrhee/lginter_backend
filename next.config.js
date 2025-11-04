/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  devIndicators: false,
  compiler: { styledComponents: true },
  output: 'standalone',
  outputFileTracingRoot: __dirname,
};

module.exports = nextConfig;

