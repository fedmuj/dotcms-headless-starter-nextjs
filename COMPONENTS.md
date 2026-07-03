# Enabling the Components — Header, Banner, Banner Carousel & FMCCard

This guide covers everything needed to get the four implemented components
rendering against your dotCMS instance: connecting the dotCMS CLI, pushing the
workspace (content types) to the instance, enabling each component, and
configuring the Universal Visual Editor (UVE) to preview/edit against
`localhost`.

## Prerequisites

1. Install dependencies:

   ```bash
   pnpm install
   ```

2. Create `.env` in the project root, pointing at your dotCMS instance:

   ```bash
   NEXT_PUBLIC_DOTCMS_HOST=https://your-instance.dotcms.cloud
   NEXT_PUBLIC_DOTCMS_AUTH_TOKEN=<API token from dotCMS>
   NEXT_PUBLIC_DOTCMS_SITE_ID=<site identifier>
   ```

   Generate the token in dotCMS under **Settings → Users → (your user) → API
   Access Tokens**. The site identifier is under **Settings → Sites → (your
   site)**.

3. Start the app:

   ```bash
   pnpm dev
   ```

   The site runs at `http://localhost:3000`.

## 1. Connect the dotCMS CLI to your instance

The CLI (`@dotcms/dotcli`) is a dev dependency — run it with `pnpm exec
dotcli`. One-time setup:

```bash
# Create the CLI config file (~/.dotcms/dot-service.yml) and register
# your instance (you'll be prompted for a name and the API URL):
pnpm exec dotcli config

# Log in to the active instance — token is the least interactive option:
pnpm exec dotcli login -tk <your-api-token>
# ...or interactively with user/password:
pnpm exec dotcli login

# Verify who you are and which instance is active:
pnpm exec dotcli status

# List / switch instances if you registered more than one:
pnpm exec dotcli instance
pnpm exec dotcli instance -act <instanceName>
```

## 2. Push the workspace to the instance

The repo contains a dotCLI workspace in `dotcms-workspace/` (marker file:
`.dot-workspace.yml`). It holds the content-type definitions the frontend
expects — notably `dotcms-workspace/content-types/FMCCard.json`.

`package.json` ships push/pull scripts:

```bash
# Preview what would change on the instance — always run this first:
pnpm cms:push:dry

# Push for real (creates/updates content types on the active instance):
pnpm cms:push

# Pull the instance state back into the workspace (after editing types
# in the dotCMS UI, so the JSON in git stays the source of truth):
pnpm cms:pull
```

> The push targets whichever instance is **active** in the CLI (`pnpm exec
> dotcli status` to check) — not the one in `.env`. Keep them pointed at the
> same instance.

## 3. Enable each component

Every component is already registered in the frontend's component map
(`components/content-types/index.ts`); the key must match the content type's
**variable** name exactly, or the block silently renders nothing:

| dotCMS content type (variable) | React component |
| --- | --- |
| `Banner` | `components/content-types/Banner.tsx` |
| `BannerCarousel` | `components/content-types/BannerCarousel.tsx` |
| `FMCCard` | `components/content-types/FMCCard.tsx` |

### Header

No content type needed. The header builds its menu from the dotCMS
**Navigation API** (`DotNavigation` GraphQL query, depth 2 — see
`utils/queries.ts`) and renders when the page template's layout has the
*header* area enabled.

- To add an item to the menu: mark the page/folder **Show on Menu** in dotCMS.
- To show/hide the header per template: toggle the header area in the
  template's layout designer.

### Banner

The `Banner` content type ships with the dotCMS demo starter (fields: `title`,
`caption`, `image`, `link`, `buttonText`, `textColor`, `layout`, `styles`).

1. Make sure a container accepts `Banner` (e.g. the demo's *Banner*
   container), and the container is in your page template.
2. Add a Banner contentlet to the page in UVE.
3. `title`, `caption` and `buttonText` are inline-editable in the editor
   (TinyMCE via `DotCMSEditableText`); the image is served through the dotCMS
   `/dA/` resize API (`utils/imageLoader.ts`).

### Banner Carousel

The `BannerCarousel` **widget** content type has a `banners` relationship to
Banner contentlets plus the standard widget fields.

Important: the Page API returns the `banners` relationship as **identifier
strings only** (the SDK's `page.get` exposes no `depth` option), so the
component falls back to the JSON the widget's VTL emits (`widgetCodeJSON`).
The widget code must therefore include the headless VTL, as the demo's does:

```velocity
#dotParse('/application/vtl/carousel/banner-carousel-headless.vtl')
```

That VTL emits `widgetCodeJSON.banners` (`title`, `image`, `caption`, `link`,
`buttonText` per slide) — that's what the carousel renders. To enable it:

1. Verify the content type's variable is exactly `BannerCarousel` and its
   widget code includes the headless VTL above.
2. Allow `BannerCarousel` in a container, place the widget on a page, and
   relate Banner contentlets to it.

Debug logging is currently enabled in the component — open the browser console
and look for `[BannerCarousel]` lines to see exactly what data arrived and
which source (relationship vs `widgetCodeJSON`) is being used.

### FMCCard

The `FMCCard` content type (fields: `title`, `description`, `image`, `link`,
`buttonText`) is **not** part of the demo starter — this is the one the
workspace push creates:

1. Run `pnpm cms:push:dry`, review, then `pnpm cms:push` (section 2 above).
2. In dotCMS, allow `FMCCard` in the container(s) where cards should live
   (container → *Content Types* / accept types).
3. Place FMCCard contentlets on a page.

FMCCard also registers a **Style Editor** schema
(`components/content-types/FMCCard.styles.ts`, registered in
`views/Page.tsx`). When you select a card in UVE, the Styles panel offers:
card orientation (vertical/horizontal), image ratio, background (white / light
gray / brand) and title style (bold/italic). Selections arrive on the
contentlet as `dotStyleProperties` — no code changes needed per card.

## 4. Configure UVE for localhost

To edit pages in dotCMS's Universal Visual Editor while it renders **this app
running locally**:

1. In dotCMS, go to **Settings → Apps → UVE - Universal Visual Editor**.
2. Select your site.
3. Set the configuration so all paths point at the local dev server:

   ```json
   {
     "config": [
       {
         "pattern": ".*",
         "url": "http://localhost:3000"
       }
     ]
   }
   ```

4. Save, then open any page under **Site → Pages**. The editor iframe now
   loads `http://localhost:3000/<page-path>` — you get live editing (block
   dialogs, inline text editing, the FMCCard Styles panel) against your local
   code, with instant reflection of frontend changes.

Requirements for this to work:

- `pnpm dev` must be running on port 3000.
- The `.env` host/token must point at the same dotCMS instance you're editing
  in, or page data won't load.
- The page renderer (`views/Page.tsx`) already wires `useEditableDotCMSPage`
  and `useStyleEditorSchemas`, so no extra frontend setup is needed.

## Troubleshooting

- **A block renders nothing** — the content type variable and the key in
  `components/content-types/index.ts` don't match, or (for the carousel) no
  usable banner data arrived; check the `[BannerCarousel]` console logs.
- **`cms:push` hits the wrong instance** — `pnpm exec dotcli status`, then
  `pnpm exec dotcli instance -act <name>`.
- **Images 404** — the asset lives on a different host than
  `NEXT_PUBLIC_DOTCMS_HOST`; the loader builds URLs against that host
  (`utils/imageLoader.ts`).
- **UVE shows a blank iframe** — dev server not running, or the UVE app URL
  doesn't match `http://localhost:3000` exactly (scheme and port included).
