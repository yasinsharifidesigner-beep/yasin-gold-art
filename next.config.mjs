/** @type {import('next').NextConfig} */
const pages = process.env.GITHUB_PAGES === 'true';
const nextConfig = {
  ...(pages
    ? {
        output: 'export',
        trailingSlash: true,
        basePath: '/yasin-gold-art',
        assetPrefix: '/yasin-gold-art/',
      }
    : {}),
  images: { unoptimized: true },
};
export default nextConfig;
