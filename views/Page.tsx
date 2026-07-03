"use client";

import {
  DotCMSLayoutBody,
  useEditableDotCMSPage,
  useStyleEditorSchemas,
} from "@dotcms/react";
import type {
  DotCMSComposedPageResponse,
  DotCMSPageResponse,
} from "@dotcms/types";
import { pageComponents } from "@/components/content-types";
import { FMC_CARD_SCHEMA } from "@/components/content-types/FMCCard.styles";

/*
 * Client-side page renderer. Wraps the raw DotCMS page data with
 * useEditableDotCMSPage so the page becomes live-editable inside the DotCMS UVE
 * page editor (changes in the editor reflect instantly without a reload).
 * DotCMSLayoutBody reads the page layout and renders each content block using
 * the matching component from pageComponents.
 */

interface PageProps {
  pageContent: DotCMSComposedPageResponse<DotCMSPageResponse>;
}

export function Page({ pageContent }: PageProps) {
  const { pageAsset } = useEditableDotCMSPage(pageContent);

  /* Registers Style Editor forms with UVE (no-op outside the editor). */
  useStyleEditorSchemas([FMC_CARD_SCHEMA]);

  return (
    <main className="container mx-auto ">
      <DotCMSLayoutBody page={pageAsset} components={pageComponents} />
    </main>
  );
}
