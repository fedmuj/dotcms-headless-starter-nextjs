"use client";

import { useState } from "react";
import type { DotCMSBasicContentlet } from "@dotcms/types";
import Banner from "./Banner";

/*
 * Banner Carousel widget — renders its related Banner contentlets as slides
 * with prev/next arrows and dot indicators (no autoplay). Each slide is the
 * Banner component itself, so inline editing and image handling come free.
 * widgetTitle is the widget's internal label and is intentionally not shown.
 */

/* Shape emitted by the widget's banner-carousel-headless.vtl code. */
interface WidgetCodeBanner {
  title: string;
  image?: string;
  caption?: string;
  link?: string | null;
  buttonText?: string | null;
}

interface BannerCarouselProps extends DotCMSBasicContentlet {
  widgetTitle?: string;
  /*
   * Relationship field. The page API returns it as bare identifier strings
   * (no `depth` option in this SDK), so it's only usable when hydrated.
   */
  banners?: DotCMSBasicContentlet[] | DotCMSBasicContentlet | string[];
  /* Widget-code output: the hydrated banner data the VTL emits for headless. */
  widgetCodeJSON?: { banners?: WidgetCodeBanner[] };
}

/*
 * Prefer hydrated contentlets from the relationship field; fall back to the
 * widgetCodeJSON payload, normalized to the props Banner expects.
 */
function toSlides(contentlet: BannerCarouselProps): DotCMSBasicContentlet[] {
  const { banners, widgetCodeJSON } = contentlet;

  /* Step 1 — normalize the relationship field to an array. */
  const list = Array.isArray(banners) ? banners : banners ? [banners] : [];
  console.log(
    `[BannerCarousel:toSlides] step 1 normalize: banners field is ${
      Array.isArray(banners) ? "an array" : banners ? "a single value" : "absent"
    } -> ${list.length} entr${list.length === 1 ? "y" : "ies"}`,
  );

  /* Step 2 — keep only hydrated contentlet objects; identifiers are dropped. */
  const related = list.filter(
    (b): b is DotCMSBasicContentlet => typeof b === "object" && b !== null,
  );
  const dropped = list.filter((b) => typeof b !== "object" || b === null);
  console.log(
    `[BannerCarousel:toSlides] step 2 filter: ${related.length} hydrated contentlet(s), ${dropped.length} dropped`,
    dropped.length > 0 ? { droppedIdentifiers: dropped } : "",
  );

  /* Step 3 — hydrated relationship wins. */
  if (related.length > 0) {
    console.log(
      "[BannerCarousel:toSlides] step 3: using hydrated relationship contentlets",
      related.map((b) => ({ identifier: b.identifier, title: b.title })),
    );
    return related;
  }

  /* Step 4 — fall back to the widget-code JSON emitted by the VTL. */
  const fromWidgetCode = widgetCodeJSON?.banners ?? [];
  console.log(
    `[BannerCarousel:toSlides] step 4 fallback: widgetCodeJSON.banners has ${fromWidgetCode.length} entr${fromWidgetCode.length === 1 ? "y" : "ies"}`,
    fromWidgetCode,
  );

  return fromWidgetCode.map(
    (b) =>
      ({
        title: b.title,
        image: b.image,
        caption: b.caption ?? undefined,
        link: b.link ?? undefined,
        buttonText: b.buttonText ?? undefined,
      }) as unknown as DotCMSBasicContentlet,
  );
}

export default function BannerCarousel(contentlet: BannerCarouselProps) {
  const slides = toSlides(contentlet);
  const [current, setCurrent] = useState(0);

  /* Debug logging — remove once the widget renders correctly. */
  console.log("[BannerCarousel] raw banners field:", contentlet.banners);
  console.log(
    `[BannerCarousel] renderable slides: ${slides.length}`,
    slides.map((s) => s.title),
  );

  if (slides.length === 0) {
    console.warn(
      "[BannerCarousel] no renderable slides — rendering nothing. banners:",
      contentlet.banners,
      "widgetCodeJSON:",
      contentlet.widgetCodeJSON,
    );
    return null;
  }
  if (slides.length === 1) return <Banner {...slides[0]} />;

  const goTo = (index: number) =>
    setCurrent((index + slides.length) % slides.length);

  return (
    <section aria-roledescription="carousel" aria-label="Banner carousel">
      <div className="relative">
        <div className="overflow-hidden rounded-xl">
          <div
            className="flex transition-transform duration-500 ease-out"
            style={{ transform: `translateX(-${current * 100}%)` }}
          >
            {slides.map((slide, i) => (
              <div
                key={slide.identifier ?? i}
                className="w-full shrink-0"
                aria-hidden={i !== current}
              >
                <Banner {...slide} />
              </div>
            ))}
          </div>
        </div>

        <button
          type="button"
          aria-label="Previous slide"
          onClick={() => goTo(current - 1)}
          className="absolute left-3 top-1/2 flex size-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-brand-900/40 text-white backdrop-blur-md transition-colors hover:bg-accent"
        >
          <svg viewBox="0 0 20 20" fill="currentColor" className="size-5">
            <path
              fillRule="evenodd"
              d="M12.79 5.23a.75.75 0 0 1-.02 1.06L8.832 10l3.938 3.71a.75.75 0 1 1-1.04 1.08l-4.5-4.25a.75.75 0 0 1 0-1.08l4.5-4.25a.75.75 0 0 1 1.06.02Z"
              clipRule="evenodd"
            />
          </svg>
        </button>
        <button
          type="button"
          aria-label="Next slide"
          onClick={() => goTo(current + 1)}
          className="absolute right-3 top-1/2 flex size-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-brand-900/40 text-white backdrop-blur-md transition-colors hover:bg-accent"
        >
          <svg viewBox="0 0 20 20" fill="currentColor" className="size-5">
            <path
              fillRule="evenodd"
              d="M7.21 14.77a.75.75 0 0 1 .02-1.06L11.168 10 7.23 6.29a.75.75 0 1 1 1.04-1.08l4.5 4.25a.75.75 0 0 1 0 1.08l-4.5 4.25a.75.75 0 0 1-1.06-.02Z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </div>

      <div className="flex justify-center gap-2 pb-2">
        {slides.map((slide, i) => (
          <button
            key={slide.identifier ?? i}
            type="button"
            aria-label={`Go to slide ${i + 1}`}
            aria-current={i === current}
            onClick={() => goTo(i)}
            className={`h-2.5 rounded-full transition-all ${
              i === current
                ? "w-6 bg-accent"
                : "w-2.5 bg-slate-300 hover:bg-slate-400"
            }`}
          />
        ))}
      </div>
    </section>
  );
}
