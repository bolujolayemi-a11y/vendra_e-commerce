/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    // Keep this if you want to skip type checks for faster deploys
    ignoreBuildErrors: true, 
  },
  // Remove the eslint and experimental keys that caused the warnings
};

export default nextConfig;