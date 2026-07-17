"use client";

import Link from "next/link";
import { DotCMSEditableText } from "@dotcms/react";
import type { DotCMSBasicContentlet } from "@dotcms/types";

/*
 * CoverTier content type — a pricing card for an insurance cover tier:
 * optional highlight badge, title, prominent price, WYSIWYG description and
 * a CTA button. Sized by its container so three tiers form a pricing row
 * when placed in a multi-column layout row, and stack in a single column.
 * The tier with tierOrder "1" carries the page's #cover anchor (the hero
 * CTAs link to it); scroll-mt clears the sticky header.
 */

interface CoverTierProps extends DotCMSBasicContentlet {
  title: string;
  priceText: string;
  badgeText?: string;
  /* WYSIWYG field — arrives as an HTML string. */
  description?: string;
  buttonText?: string;
  link?: string;
  /* Text field ("1"-based); drives ordering and the #cover anchor. */
  tierOrder?: string;
}

export default function CoverTier(contentlet: CoverTierProps) {
  const { title, priceText, badgeText, description, buttonText, link, tierOrder } =
    contentlet;
  const highlighted = Boolean(badgeText);

  return (
    <article
      id={tierOrder === "1" ? "cover" : undefined}
      className={`relative my-6 flex h-full flex-col gap-3 rounded-xl bg-white p-6 shadow-sm scroll-mt-24 transition-shadow hover:shadow-md ${
        highlighted ? "ring-2 ring-accent" : "ring-1 ring-slate-200"
      }`}
    >
      {badgeText && (
        <span className="absolute -top-3 left-6 rounded-full bg-accent px-3 py-1 text-xs font-semibold text-white shadow-sm">
          <DotCMSEditableText
            contentlet={contentlet}
            fieldName="badgeText"
            mode="plain"
            format="text"
          />
        </span>
      )}

      <h2 className="text-lg font-semibold tracking-tight text-brand-900">
        <DotCMSEditableText
          contentlet={contentlet}
          fieldName="title"
          mode="plain"
          format="text"
        />
      </h2>

      <div className="text-3xl font-bold tracking-tight text-brand-900">
        <DotCMSEditableText
          contentlet={contentlet}
          fieldName="priceText"
          mode="plain"
          format="text"
        />
      </div>

      {description && (
        <div
          className="text-sm/relaxed text-slate-600 [&_p]:m-0"
          dangerouslySetInnerHTML={{ __html: description }}
        />
      )}

      {link && (
        <Link
          href={link}
          className={`mt-auto inline-flex w-fit items-center rounded-md px-4 py-2 text-sm font-semibold transition-colors ${
            highlighted
              ? "bg-accent text-white hover:bg-accent-600"
              : "bg-brand-800 text-white hover:bg-brand-700"
          }`}
        >
          {buttonText || "Get a quote"}
        </Link>
      )}
    </article>
  );
}
