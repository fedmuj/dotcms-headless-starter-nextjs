# dotCMS Headless Starter — Next.js

Setup guide for running this frontend against a new dotCMS environment.

> Per-component implementation notes live in [COMPONENTS.md](./COMPONENTS.md).

## 1. Requirements on the dotCMS side

- A dotCMS instance **set up with the Travel Site Demo** content. The frontend
  depends on content types, containers and widget VTLs that ship with that
  demo — specifically the `Banner` content type, the `BannerCarousel` widget
  (whose widget code emits the headless JSON via
  `/application/vtl/carousel/banner-carousel-headless.vtl`), the Banner
  container, and the demo navigation tree.
- An **API token from a user with edit permissions** on the site. Read-only
  tokens work for the live site but make the UVE editor 404 on unpublished
  pages (working versions are permission-checked by dotCMS).

## 2. Frontend setup

```bash
pnpm install
```

Create `.env` in the project root:

```bash
NEXT_PUBLIC_DOTCMS_HOST=https://your-instance.dotcms.cloud
NEXT_PUBLIC_DOTCMS_AUTH_TOKEN=<API token, from a user with edit permissions>
NEXT_PUBLIC_DOTCMS_SITE_ID=<site identifier>
```

- Token: dotCMS → **Settings → Users → (user) → API Access Tokens**.
- Site id: dotCMS → **Settings → Sites → (your site)**.

Run the app:

```bash
pnpm dev   # http://localhost:3000
```

## 3. Push the FMCCard content type

The Travel Site Demo provides everything except `FMCCard` — that content type
is versioned in this repo (`dotcms-workspace/content-types/FMCCard.json`) and
is pushed with the dotCMS CLI.

Connect the CLI to your instance (one time):

```bash
pnpm exec dotcli config              # register the instance (API URL + name)
pnpm exec dotcli login -tk <token>   # or interactive: pnpm exec dotcli login
pnpm exec dotcli status              # verify user + active instance
```

Push the workspace:

```bash
pnpm cms:push:dry   # preview what would change — run this first
pnpm cms:push       # create/update the content types on the instance
```

> The push targets the CLI's **active** instance (`pnpm exec dotcli status`),
> not the one in `.env` — keep both pointed at the same environment.

After pushing, allow `FMCCard` in the container(s) where cards should be
placeable (container → accept types).

The **FMCCard ships with the Style Editor ("edit styles") configured**: when a
card is selected in the UVE editor, the Styles panel offers card orientation
(vertical/horizontal), image ratio, background (white / light gray / brand)
and title style (bold/italic). No dotCMS-side setup is needed — the schema is
registered by the frontend (`components/content-types/FMCCard.styles.ts`).

## 4. Configure UVE for localhost

To edit pages in dotCMS's Universal Visual Editor rendered by your local app:

1. dotCMS → **Settings → Apps → UVE - Universal Visual Editor** → select the
   site.
2. Set the configuration:

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

3. Keep `pnpm dev` running and open any page under **Site → Pages** — the
   editor loads the local app with live editing, inline text editing and the
   FMCCard Styles panel. The app forwards the editor's mode/language/persona
   parameters to the page fetch, so unpublished pages render in the editor
   (provided the token has edit permissions, see section 1).

## Troubleshooting

- **A block renders nothing** — content type variable doesn't match its key in
  `components/content-types/index.ts`.
- **Unpublished pages 404 in the editor** — the API token's user lacks edit
  permissions (dotCMS returns `PERMISSION_DENIED` for `EDIT_MODE`).
- **Carousel renders nothing** — check the `[BannerCarousel]` browser-console
  logs; the widget code must include `banner-carousel-headless.vtl` (it does
  in the Travel Site Demo).
- **`cms:push` hits the wrong instance** — `pnpm exec dotcli status`, then
  `pnpm exec dotcli instance -act <name>`.
