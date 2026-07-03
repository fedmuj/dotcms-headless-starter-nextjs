# Component Notes

Implementation notes for the components in this frontend. For environment
setup (dotCMS instance, CLI push, UVE configuration) see the
[README](./README.md).

Content-type components are registered in
`components/content-types/index.ts`; the map key must match the content
type's **variable** name exactly, or the block silently renders nothing.

| dotCMS content type (variable) | React component |
| --- | --- |
| `Banner` | `components/content-types/Banner.tsx` |
| `BannerCarousel` | `components/content-types/BannerCarousel.tsx` |
| `FMCCard` | `components/content-types/FMCCard.tsx` |

## Header (`components/Header.tsx`)

Sticky translucent bar (backdrop blur + hairline border) with the brand slot
on the left and the top-level navigation on the right. No content type — the
menu comes from the dotCMS Navigation API (`DotNavigation` GraphQL query,
depth 2, in `utils/queries.ts`); items appear when marked **Show on Menu** in
dotCMS. Renders when the template layout's *header* area is enabled. The
active link is highlighted via the `currentPath` prop passed from the page.
Zero client JS (server component); nested nav children are not rendered.

## Banner (`components/content-types/Banner.tsx`)

Rounded hero card: image fills the card behind a dark gradient scrim; title,
caption and CTA sit bottom-left. Uses the `Banner` content type from the
Travel Site Demo.

- `title`, `caption`, `buttonText` are inline-editable in UVE
  (`DotCMSEditableText`). The caption wrapper is a `<div>` on purpose — the
  editor mounts a TinyMCE `<div>` and a `<p>` parent would break hydration.
- `textColor` is applied as an inline style (editor-picked hex values can't be
  Tailwind classes).
- Images go through `utils/imageLoader.ts` → dotCMS `/dA/` resize API.
- Only `title` is required: missing image → gradient fallback; missing link →
  no button; missing buttonText → "Learn More".

## Banner Carousel (`components/content-types/BannerCarousel.tsx`)

Client component rendering related Banner contentlets as slides, with glass
prev/next arrows, dot indicators and wrap-around. No autoplay. Each slide
reuses the Banner component.

Data source subtlety: the Page API returns the `banners` relationship as
**identifier strings only** (the SDK exposes no `depth` option), so the
component falls back to the JSON emitted by the widget's VTL
(`widgetCodeJSON.banners` — title, image, caption, link, buttonText per
slide). Consequences of the fallback path:

- Slides have no `textColor` and no `identifier`/`inode`, so slide text is not
  inline-editable; editors use the widget's UVE dialog instead.
- Debug logging is enabled: check the browser console for `[BannerCarousel]`
  lines showing what data arrived and which source was used.

`widgetTitle` is treated as the widget's internal label and not rendered.

## FMCCard (`components/content-types/FMCCard.tsx`)

White content card: image top (16:10 by default), title, description, CTA.
Grid-friendly (equal height, button pinned to the bottom edge). `title`,
`description` and `buttonText` are inline-editable; `description` preserves
textarea line breaks.

**Edit styles (Style Editor) are configured** in
`components/content-types/FMCCard.styles.ts` and registered via
`useStyleEditorSchemas` in `views/Page.tsx`. Selecting a card in UVE opens a
Styles panel with:

- **Card orientation** — vertical, or horizontal (image left at 2/5 width).
- **Image ratio** — 16:10, 16:9, or square.
- **Background** — white, light gray, or brand (dark blue; text and button
  treatments adapt automatically for contrast).
- **Title style** — bold and/or italic.

Selections arrive on the contentlet as `dotStyleProperties` and are applied at
render time — no code changes needed per card. Keep any new option values that
are Tailwind classes as literal strings in the schema file, since Tailwind
only generates classes it sees in source.

## Footer (`components/Footer.tsx`)

Dark counterpart to the header: brand + tagline, the same top-level dotCMS nav
in a column grid, and a copyright bar with the current year. Server component,
no client JS. Renders when the template layout's *footer* area is enabled.
