"use client";

import Image from "next/image";
import Link from "next/link";
import { DotCMSEditableText } from "@dotcms/react";
import type { DotCMSBasicContentlet } from "@dotcms/types";
import ImageLoader from "@/utils/imageLoader";

/*
 * Banner content type — a rounded hero card. The image fills the card behind
 * a dark gradient scrim; title, caption and CTA button sit bottom-left.
 * Field contract mirrors the DotCMS "Banner" content type: only `title` is
 * required there, so every other field degrades gracefully when absent.
 * Text fields render through DotCMSEditableText: inline-editable inside the
 * UVE page editor, plain text on the live site.
 */

interface BannerProps extends DotCMSBasicContentlet {
  title: string;
  caption?: string;
  buttonText?: string;
  link?: string;
  /* Editor-picked CSS color for the overlay text (e.g. "#ffffff"). */
  textColor?: string;
  /* DotCMS image field: an asset path string or an object with the asset id. */
  image?: string | { idPath?: string; identifier?: string };
}

function resolveImageSrc(image: BannerProps["image"]): string | undefined {
  if (!image) return undefined;
  if (typeof image === "string") return image;
  return image.idPath ?? image.identifier;
}

export default function Banner(contentlet: BannerProps) {
  const { title, caption, buttonText, link, textColor, image } = contentlet;
  const imageSrc = resolveImageSrc(image);

  return (
    <section
      className="relative my-6 flex min-h-[420px] items-end overflow-hidden rounded-2xl bg-gradient-to-br from-gray-900 to-gray-700 ring-1 ring-gray-200/70 sm:min-h-[520px]"
      style={{ color: textColor || "#ffffff" }}
    >
      {imageSrc && (
        <Image
          src={imageSrc}
          alt={title}
          loader={ImageLoader}
          fill
          preload
          sizes="(max-width: 1152px) 100vw, 1152px"
          className="object-cover"
        />
      )}
      {/* Scrim keeps the overlay text readable regardless of the image. */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/25 to-transparent" />

      <div className="relative flex max-w-2xl flex-col items-start gap-3 p-6 sm:p-10">
        <h1 className="text-3xl font-bold tracking-tight sm:text-5xl">
          <DotCMSEditableText
            contentlet={contentlet}
            fieldName="title"
            mode="plain"
            format="text"
          />
        </h1>
        {/* div, not p: in UVE edit mode DotCMSEditableText mounts a TinyMCE
            <div>, which the HTML parser would eject from a <p>. */}
        {caption && (
          <div className="text-base/relaxed opacity-90 sm:text-lg/relaxed">
            <DotCMSEditableText
              contentlet={contentlet}
              fieldName="caption"
              mode="plain"
              format="text"
            />
          </div>
        )}
        {link && (
          <Link
            href={link}
            className="mt-2 rounded-md border border-white/25 bg-white/15 px-5 py-2.5 text-sm font-medium backdrop-blur-md transition-colors hover:bg-white/30"
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
    </section>
  );
}
