// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    optimizeCss: false, // تعطيل lightningcss
  },
  compiler: {
    legacyDecorators: true,
  }
}

module.exports = nextConfig
