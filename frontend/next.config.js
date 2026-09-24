/** @type {import('next').NextConfig} */
// NEXT_PUBLIC_STATIC=true always (there's no backend left — see lib/api.js),
// but `output: 'export'` itself is only turned on for an actual production
// build/start, never for `next dev`. `next dev` sets NODE_ENV=development
// automatically, so this line alone tells the two apart. Without this,
// `next dev` enforces export-mode's stricter rules (e.g. requiring
// generateStaticParams to already be fully resolved) and throws
// "missing exported function generateStaticParams()" on dynamic routes.
const isStatic = process.env.NEXT_PUBLIC_STATIC === 'true' && process.env.NODE_ENV === 'production';
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
