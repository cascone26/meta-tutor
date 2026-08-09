import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ['@anthropic-ai/sdk'],
  async redirects() {
    return [
      { source: "/latin", destination: "/rca/first-form-latin-6", permanent: true },
      { source: "/latin/:path*", destination: "/rca/first-form-latin-6", permanent: true },
      { source: "/hub", destination: "/", permanent: true },
    ];
  },
};

export default nextConfig;
