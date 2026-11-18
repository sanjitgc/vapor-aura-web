import type { NextConfig } from "next";

// No redirects for /locations, /products or /contact: they are real pages now, each with its own
// title and canonical, so search engines can rank them instead of folding them into the home page.
const nextConfig: NextConfig = {
  poweredByHeader: false,
  async redirects() {
    return [
      // The nearby-city pages live at /smoke-shop/<city>; their list is on /locations
      { source: "/smoke-shop", destination: "/locations", permanent: true },
    ];
  },
};

export default nextConfig;
