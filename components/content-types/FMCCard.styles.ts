import { defineStyleEditorSchema, styleEditorField } from "@dotcms/uve";

/*
 * Style Editor schema for the FMCCard content type. Registered with UVE via
 * useStyleEditorSchemas (see views/Page.tsx); editors get these controls in
 * the editor's Styles panel and the chosen values arrive on the contentlet
 * as `dotStyleProperties`, keyed by field id.
 *
 * Keep option values that are Tailwind classes as literal strings in this
 * file — Tailwind only generates classes it can see in the source code.
 */
export const FMC_CARD_SCHEMA = defineStyleEditorSchema({
  contentType: "FMCCard",
  sections: [
    {
      title: "Layout",
      fields: [
        styleEditorField.radio({
          id: "orientation",
          label: "Card orientation",
          options: [
            { label: "Vertical", value: "vertical" },
            { label: "Horizontal", value: "horizontal" },
          ],
        }),
        styleEditorField.dropdown({
          id: "image-ratio",
          label: "Image ratio",
          options: [
            { label: "Landscape (16:10)", value: "aspect-[16/10]" },
            { label: "Widescreen (16:9)", value: "aspect-video" },
            { label: "Square (1:1)", value: "aspect-square" },
          ],
        }),
      ],
    },
    {
      title: "Appearance",
      fields: [
        styleEditorField.dropdown({
          id: "background",
          label: "Background",
          options: [
            { label: "White", value: "bg-white" },
            { label: "Light gray", value: "bg-gray-100" },
            { label: "Brand", value: "bg-blue-900 text-white" },
          ],
        }),
        styleEditorField.checkboxGroup({
          id: "title-style",
          label: "Title style",
          options: [
            { label: "Bold", key: "bold" },
            { label: "Italic", key: "italic" },
          ],
        }),
      ],
    },
  ],
});
