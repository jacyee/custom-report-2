import type { NextConfig } from "next";

const isStaticExport = process.env.STATIC_EXPORT === 'true';

const nextConfig: NextConfig = {
  ...(isStaticExport
    ? { output: 'export' as const, images: { unoptimized: true } }
    : { serverExternalPackages: ['puppeteer'] }
  ),
  basePath: process.env.NEXT_PUBLIC_BASE_PATH || '',
};

export default nextConfig;
