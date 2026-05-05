/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  // This helps with the 'useSearchParams' bailout issue
  experimental: {
    missingSuspenseWithCSRBailout: false,
  },
};

export default nextConfig;