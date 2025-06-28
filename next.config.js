/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  basePath: process.env.NODE_ENV === 'production' ? '/graun' : '',
  assetPrefix: process.env.NODE_ENV === 'production' ? '/graun/' : '',
  images: {
    unoptimized: true
  }
}

module.exports = nextConfig
