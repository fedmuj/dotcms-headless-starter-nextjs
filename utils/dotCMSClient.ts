import { createDotCMSClient } from "@dotcms/client";

/*
 * Singleton DotCMS API client. Server-only — never import this from a client
 * component, it holds the API token. Environment variables (see README):
 *   DOTCMS_HOST       — base URL of the DotCMS instance
 *   DOTCMS_AUTH_TOKEN — API token for authentication
 *   DOTCMS_SITE_ID    — identifier of the site to serve content from
 * All are server-only on purpose (browser image requests reach dotCMS through
 * the /dA/ rewrite in next.config.ts, so nothing needs a NEXT_PUBLIC_ name).
 * The prefixed fallbacks support .env files from before the rename.
 */
export const dotCMSClient = createDotCMSClient({
  dotcmsUrl:
    process.env.DOTCMS_HOST ?? process.env.NEXT_PUBLIC_DOTCMS_HOST ?? "",
  authToken:
    process.env.DOTCMS_AUTH_TOKEN ??
    process.env.NEXT_PUBLIC_DOTCMS_AUTH_TOKEN ??
    "",
  siteId:
    process.env.DOTCMS_SITE_ID ?? process.env.NEXT_PUBLIC_DOTCMS_SITE_ID ?? "",
});
