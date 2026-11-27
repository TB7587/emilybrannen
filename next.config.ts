import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
    // Phone-first: most requests are for small widths.
    deviceSizes: [390, 640, 828, 1080, 1200],
    imageSizes: [96, 160, 240, 320],
  },
};

export default nextConfig;
