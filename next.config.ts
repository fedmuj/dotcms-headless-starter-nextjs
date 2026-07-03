import type { NextConfig } from "next";

const dotcmsHost =
  process.env.DOTCMS_HOST ?? process.env.NEXT_PUBLIC_DOTCMS_HOST ?? "";

const nextConfig: NextConfig = {
  /*
   * Proxies dotCMS asset requests (/dA/...) through this app so the browser
   * never needs the dotCMS host — it stays a server-only env var. The image
   * loader (utils/imageLoader.ts) emits relative /dA/ URLs that land here.
   */
  async rewrites() {
    return [
      {
        source: "/dA/:path*",
        destination: `${dotcmsHost}/dA/:path*`,
      },
    ];
  },
};

export default nextConfig;
