"use client";

import { useState } from "react";
import type { DotCMSBasicContentlet } from "@dotcms/types";

/*
 * FAQ Widget — renders its related FAQ contentlets as an accordion (first
 * item open, one open at a time). Carries the page's #faq anchor.
 * Like BannerCarousel, the relationship field arrives as bare identifiers
 * from the page API, so the widget's faq-widget-headless.vtl emits the
 * hydrated question/answer pairs via widgetCodeJSON.
 */

interface FaqItem {
  identifier?: string;
  question?: string;
  /* WYSIWYG field — arrives as an HTML string. */
  answer?: string;
}

interface FaqWidgetProps extends DotCMSBasicContentlet {
  widgetTitle?: string;
  /* Relationship field: hydrated contentlets or bare identifier strings. */
  faq?: DotCMSBasicContentlet[] | DotCMSBasicContentlet | string[];
  /* Widget-code output: the hydrated FAQ data the VTL emits for headless. */
  widgetCodeJSON?: { widgetTitle?: string; faqs?: FaqItem[] };
}

/* Prefer hydrated relationship contentlets; fall back to widgetCodeJSON. */
function toItems(contentlet: FaqWidgetProps): FaqItem[] {
  const { faq, widgetCodeJSON } = contentlet;
  const list = Array.isArray(faq) ? faq : faq ? [faq] : [];
  const related = list.filter(
    (f): f is DotCMSBasicContentlet => typeof f === "object" && f !== null,
  );
  if (related.length > 0) {
    return related.map((f) => ({
      identifier: f.identifier,
      question: (f as FaqItem).question,
      answer: (f as FaqItem).answer,
    }));
  }
  return widgetCodeJSON?.faqs ?? [];
}

export default function FaqWidget(contentlet: FaqWidgetProps) {
  const items = toItems(contentlet);
  const [open, setOpen] = useState(0);

  if (items.length === 0) return null;

  return (
    <section id="faq" className="my-6 scroll-mt-24">
      {contentlet.widgetTitle && (
        <h2 className="mb-4 text-2xl font-bold tracking-tight text-brand-900">
          {contentlet.widgetTitle}
        </h2>
      )}
      <div className="divide-y divide-slate-200 overflow-hidden rounded-xl bg-white ring-1 ring-slate-200">
        {items.map((item, i) => (
          <div key={item.identifier ?? i}>
            <button
              type="button"
              aria-expanded={open === i}
              onClick={() => setOpen(open === i ? -1 : i)}
              className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left text-sm font-semibold text-brand-900 transition-colors hover:bg-slate-50"
            >
              {item.question}
              <svg
                viewBox="0 0 20 20"
                fill="currentColor"
                className={`size-5 shrink-0 text-accent transition-transform ${
                  open === i ? "rotate-180" : ""
                }`}
              >
                <path
                  fillRule="evenodd"
                  d="M5.23 7.21a.75.75 0 0 1 1.06.02L10 11.168l3.71-3.938a.75.75 0 1 1 1.08 1.04l-4.25 4.5a.75.75 0 0 1-1.08 0l-4.25-4.5a.75.75 0 0 1 .02-1.06Z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
            {open === i && item.answer && (
              <div
                className="px-5 pb-4 text-sm/relaxed text-slate-600 [&_p]:m-0"
                dangerouslySetInnerHTML={{ __html: item.answer }}
              />
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
