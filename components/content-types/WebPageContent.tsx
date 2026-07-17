"use client";

import type { DotCMSBasicContentlet } from "@dotcms/types";

/*
 * Rich Text (webPageContent) content type — rendered as a muted small-print
 * block (legal copy, disclaimers). The body is a WYSIWYG field, so it
 * arrives as an HTML string and is rendered as-is.
 */

interface WebPageContentProps extends DotCMSBasicContentlet {
  title: string;
  body?: string;
}

export default function WebPageContent({ title, body }: WebPageContentProps) {
  return (
    <section className="my-6 rounded-xl bg-slate-50 p-5 ring-1 ring-slate-200">
      <h2 className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
        {title}
      </h2>
      {body && (
        <div
          className="text-xs/relaxed text-slate-500 [&_a]:underline [&_p]:m-0"
          dangerouslySetInnerHTML={{ __html: body }}
        />
      )}
    </section>
  );
}
