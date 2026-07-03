"use client";

import Image from "next/image";
import Link from "next/link";
import { DotCMSEditableText } from "@dotcms/react";
import type { DotCMSBasicContentlet } from "@dotcms/types";
import ImageLoader from "@/utils/imageLoader";

/*
 * FMCCard content type — a white content card: image on top, title,
 * description and a CTA button below. Sized by its container so it works in
 * any dotCMS layout column/grid; equal-height when siblings use a grid.
 * Text fields render through DotCMSEditableText (inline-editable in UVE).
 */

interface FMCCardProps extends DotCMSBasicContentlet {
  title: string;
  description?: string;
  buttonText?: string;
  link?: string;
  /* DotCMS image field: an asset path string or an object with the asset id. */
  image?: string | { idPath?: string; identifier?: string };
}

function resolveImageSrc(image: FMCCardProps["image"]): string | undefined {
  if (!image) return undefined;
  if (typeof image === "string") return image;
  return image.idPath ?? image.identifier;
}

/*
 * Style Editor selections (see FMCCard.styles.ts) arrive as
 * dotStyleProperties keyed by field id. checkboxGroup values may be a
 * Record<key, boolean> or an array of checked keys — normalize both.
 */
function resolveStyles(styles: Record<string, unknown> = {}) {
  const checked = (value: unknown, key: string) =>
    Array.isArray(value)
      ? value.includes(key)
      : Boolean((value as Record<string, boolean>)?.[key]);

  const background = (styles["background"] as string) ?? "bg-white";
  const titleStyle = styles["title-style"];
  return {
    horizontal: styles["orientation"] === "horizontal",
    imageRatio: (styles["image-ratio"] as string) ?? "aspect-[16/10]",
    background,
    /* Dark backgrounds bring their own text color; let text inherit it. */
    darkBackground: background.includes("text-white"),
    titleBold: checked(titleStyle, "bold"),
    titleItalic: checked(titleStyle, "italic"),
  };
}

export default function FMCCard(contentlet: FMCCardProps) {
  const { title, description, buttonText, link, image } = contentlet;
  const imageSrc = resolveImageSrc(image);
  const styles = resolveStyles(contentlet.dotStyleProperties);

  return (
    <article
      className={`group my-6 flex h-full overflow-hidden rounded-2xl ring-1 ring-gray-200/70 transition-shadow hover:shadow-lg ${styles.background} ${
        styles.horizontal ? "flex-col sm:flex-row" : "flex-col"
      }`}
    >
      {imageSrc && (
        <div
          className={`relative overflow-hidden ${styles.imageRatio} ${
            styles.horizontal ? "sm:aspect-auto sm:w-2/5 sm:shrink-0" : ""
          }`}
        >
          <Image
            src={imageSrc}
            alt={title}
            loader={ImageLoader}
            fill
            sizes="(max-width: 640px) 100vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>
      )}

      <div className="flex flex-1 flex-col gap-2 p-6">
        <h2
          className={`text-xl tracking-tight ${
            styles.titleBold ? "font-bold" : "font-semibold"
          } ${styles.titleItalic ? "italic" : ""} ${
            styles.darkBackground ? "" : "text-gray-900"
          }`}
        >
          <DotCMSEditableText
            contentlet={contentlet}
            fieldName="title"
            mode="plain"
            format="text"
          />
        </h2>
        {/* div, not p: in UVE edit mode DotCMSEditableText mounts a TinyMCE
            <div>, which the HTML parser would eject from a <p>. */}
        {description && (
          <div
            className={`whitespace-pre-line text-sm/relaxed ${
              styles.darkBackground ? "opacity-85" : "text-gray-600"
            }`}
          >
            <DotCMSEditableText
              contentlet={contentlet}
              fieldName="description"
              mode="plain"
              format="text"
            />
          </div>
        )}
        {link && (
          <Link
            href={link}
            className={`mt-auto inline-flex w-fit items-center rounded-md px-4 py-2 text-sm font-medium transition-colors ${
              styles.darkBackground
                ? "border border-white/25 bg-white/15 text-white backdrop-blur-md hover:bg-white/30"
                : "bg-gray-900 text-white hover:bg-gray-700"
            }`}
          >
            {buttonText ? (
              <DotCMSEditableText
                contentlet={contentlet}
                fieldName="buttonText"
                mode="plain"
                format="text"
              />
            ) : (
              "Learn More"
            )}
          </Link>
        )}
      </div>
    </article>
  );
}
