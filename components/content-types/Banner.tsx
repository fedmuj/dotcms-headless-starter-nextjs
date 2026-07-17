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
      className="relative my-6 flex min-h-[420px] items-end overflow-hidden rounded-xl bg-gradient-to-br from-brand-800 to-brand-600 ring-1 ring-brand-900/10 sm:min-h-[520px]"
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
      {/* Lighter navy scrim — the text panel now carries legibility, so let
          more of the image show through. */}
      <div className="absolute inset-0 bg-gradient-to-t from-brand-900/55 via-brand-900/15 to-transparent" />

      {/* Frosted navy panel behind the copy — lifts the text off the image
          and gives the hero a more deliberate, branded composition. */}
      <div className="relative m-5 flex max-w-xl flex-col items-start gap-3 rounded-xl bg-brand-900/70 p-6 ring-1 ring-white/10 backdrop-blur-sm sm:m-8 sm:p-8">
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
            className="mt-2 rounded-md bg-accent px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-accent-600"
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
