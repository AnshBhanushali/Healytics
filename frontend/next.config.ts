/** next.config.js **/
/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Optional: skip TS errors too (if you have TS errors beyond lint)
    ignoreBuildErrors: true,
  },
};

module.exports = nextConfig;
