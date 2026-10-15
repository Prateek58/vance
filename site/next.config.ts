import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: '/candidate-hub',
        destination: '/jobs',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
