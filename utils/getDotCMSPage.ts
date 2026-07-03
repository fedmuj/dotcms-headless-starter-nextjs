import { cache } from "react";
import { dotCMSClient } from "./dotCMSClient";
import { DotCMSPageRequestParams } from "@dotcms/types";
import { DotCMSPageContent } from "@/types/page";

/*
 * Fetches a DotCMS page by its URL path. `options` takes the SDK's page
 * request params (graphql queries, plus UVE context like mode/languageId —
 * see buildPageRequestParams). Wrapped in React's cache() so the same
 * path is only fetched once per server request — safe to call from multiple
 * components in the same render. Returns undefined on error (caller shows 404).
 */
export const getDotCMSPage = cache(
  async (path: string, options?: DotCMSPageRequestParams) => {
    try {
      const pageData = await dotCMSClient.page.get<{
        content: DotCMSPageContent;
      }>(path, options);
      return pageData;
    } catch (e) {
      console.error("ERROR FETCHING PAGE: ", (e as Error).message);
    }
  },
);

/* Page modes the dotCMS backend accepts (UVE_MODE enum values). */
const VALID_MODES = ["EDIT_MODE", "PREVIEW_MODE", "LIVE"];

/*
 * Maps the query params the UVE editor appends to the iframe URL onto the
 * SDK's page request params. Without this, every fetch defaults to LIVE mode
 * and unpublished (working-only) pages 404 inside the editor.
 *
 * Gated by ENABLE_UVE_MODE (server-only env var): unless it is "true", all
 * editor params are ignored and every request renders LIVE. Keep it unset in
 * production so visitors can't read working content via ?mode=EDIT_MODE.
 */
export function buildPageRequestParams(
  searchParams: Record<string, string | string[] | undefined>,
): DotCMSPageRequestParams {
  if (process.env.ENABLE_UVE_MODE !== "true") return {};

  const first = (v: string | string[] | undefined) =>
    Array.isArray(v) ? v[0] : v;

  const mode = first(searchParams["mode"]);
  const languageId = first(searchParams["language_id"]);
  const personaId = first(searchParams["com.dotmarketing.persona.id"]);
  const variantName = first(searchParams["variantName"]);
  const publishDate = first(searchParams["publishDate"]);

  return {
    ...(mode && VALID_MODES.includes(mode)
      ? { mode: mode as DotCMSPageRequestParams["mode"] }
      : {}),
    ...(languageId ? { languageId } : {}),
    ...(personaId ? { personaId } : {}),
    ...(variantName ? { variantName } : {}),
    ...(publishDate ? { publishDate } : {}),
  };
}
