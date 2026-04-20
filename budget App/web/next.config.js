/** @type {import('next').NextConfig} */
const nextConfig = {
  // Static export so Capacitor can bundle the web assets into the native shell
  output: 'export',
  // Disable image optimization (not available in static export)
  images: { unoptimized: true },
  // Trailing slash ensures assets resolve correctly inside the WebView
  trailingSlash: true,
};

module.exports = nextConfig;
