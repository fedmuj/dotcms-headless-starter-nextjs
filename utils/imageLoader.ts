/*
 * Custom image loader for Next.js <Image> — routes image requests through
 * the DotCMS asset API (/dA/) which supports on-the-fly resizing.
 * Pass this as the `loader` prop on <Image> for any DotCMS-hosted image.
 * The width parameter maps to DotCMS's /{width}w resizing suffix.
 *
 * Returns a relative /dA/ URL: the browser requests this app's own origin and
 * the rewrite in next.config.ts proxies it to the dotCMS host server-side, so
 * the host doesn't need to be a NEXT_PUBLIC_ env var.
 */
const ImageLoader = ({ src, width = 250 }: { src: string; width: number }) => {
  /* If src already contains /dA/ it's a full asset path; otherwise prepend it. */
  const imageSRC = src.includes("/dA/") ? src : `/dA/${src}`;
  return `${imageSRC}/${width}w`;
};

export default ImageLoader;
