import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // The OG image routes read the Cormorant Garamond files from assets/ at
  // runtime, so they must ship with those serverless functions.
  outputFileTracingIncludes: {
    '/i/**': ['./assets/**'],
    '/ig/**': ['./assets/**'],
  },
};

export default nextConfig;
