import type { NextConfig } from "next";

// No redirects for /locations, /products or /contact: they are real pages now, each with its own
// title and canonical, so search engines can rank them instead of folding them into the home page.
const nextConfig: NextConfig = {
  poweredByHeader: false,
};

export default nextConfig;
