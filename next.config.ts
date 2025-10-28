import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Output as standalone SPA (client-side only)
  // Note: Headers work in dev mode but not in static export
  // For production (static export), configure headers at hosting level via vercel.json
  output: "export",

  // Disable image optimization for static export
  images: {
    unoptimized: true,
  },

  // Headers for SharedArrayBuffer support (required by FFMPEG.wasm)
  // These work in development mode (npm run dev)
  // For production static exports, use vercel.json or hosting-specific config
  headers: async () => {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Cross-Origin-Opener-Policy",
            value: "same-origin",
          },
          {
            key: "Cross-Origin-Embedder-Policy",
            value: "require-corp",
          },
          {
            key: "Cross-Origin-Resource-Policy",
            value: "cross-origin",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
