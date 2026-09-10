/** @type {import('next').NextConfig} */
const isStatic = process.env.NEXT_PUBLIC_STATIC === 'true';
// For GitHub Pages project sites the app is served under /<repo>. The deploy
// workflow sets NEXT_PUBLIC_BASE_PATH to "/<repo>" automatically.
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';

const nextConfig = {
  reactStrictMode: true,
  // Load Google Fonts at runtime via the <link> in app/layout.js instead of
  // Next inlining them at build time (keeps builds working on restricted networks).
  optimizeFonts: false,

  // Static, backend-free build for GitHub Pages (NEXT_PUBLIC_STATIC=true).
  ...(isStatic
    ? {
        output: 'export',
        trailingSlash: true,
        basePath: basePath || undefined,
        assetPrefix: basePath ? `${basePath}/` : undefined,
        images: { unoptimized: true },
      }
    : {}),
};

module.exports = nextConfig;
