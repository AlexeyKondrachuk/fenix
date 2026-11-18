import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      { source: "/sections/psychotherapist", destination: "/psyhoterapevt", permanent: true },
      { source: "/sections/child-psychology", destination: "/detskiy-psiholog", permanent: true },
      { source: "/sections/training", destination: "/treningi", permanent: true },
      { source: "/sections/group-training", destination: "/treningi", permanent: true },
      { source: "/sections/individual-training", destination: "/treningi", permanent: true },
      { source: "/sections/online-training", destination: "/treningi", permanent: true },
    ];
  },
  experimental: { serverActions: { bodySizeLimit: "6mb" } },
  allowedDevOrigins: ["playfully-systematic-tailorbird.cloudpub.ru"],
};

export default nextConfig;
