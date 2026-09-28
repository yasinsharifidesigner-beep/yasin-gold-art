/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  basePath: '/yasin-gold-art',
  assetPrefix: '/yasin-gold-art/',
  images: { unoptimized: true }
};

export default nextConfig;
