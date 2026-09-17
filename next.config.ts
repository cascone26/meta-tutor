import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ['@anthropic-ai/sdk'],
  async headers() {
    return [
      {
        source: "/stockfish/:path*",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
      {
        source: "/:path*.(png|jpg|jpeg|webp|svg|ico|woff|woff2)",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
    ];
  },
  async redirects() {
    return [
      { source: "/latin", destination: "/rca/first-form-latin-6", permanent: true },
      { source: "/latin/:path*", destination: "/rca/first-form-latin-6", permanent: true },
      { source: "/hub", destination: "/", permanent: true },
    ];
  },
};

export default nextConfig;
