import Link from "next/link";
import type { DotCMSNavigationItem } from "@dotcms/types";

/*
 * Site footer component. Deep-navy counterpart to the header: brand and
 * tagline on the left, the top-level DotCMS nav on the right, and a hairline
 * bottom bar with the copyright. Server component — no client JS needed.
 */

interface FooterProps {
  navItems?: DotCMSNavigationItem[];
}

export default function Footer({ navItems = [] }: FooterProps) {
  return (
    <footer className="mt-12 bg-brand-900 text-slate-400">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-12 sm:flex-row sm:items-start sm:justify-between sm:px-6">
        <div className="max-w-xs">
          <Link
            href="/"
            className="text-lg font-semibold tracking-tight text-white transition-opacity hover:opacity-80"
          >
            dotCMS Starter
          </Link>
          <p className="mt-2 text-sm/relaxed">
            A headless starter built with Next.js, Tailwind CSS and dotCMS.
          </p>
        </div>

        {navItems.length > 0 && (
          <nav aria-label="Footer navigation">
            <ul className="grid grid-cols-2 gap-x-10 gap-y-2 sm:grid-cols-3">
              {navItems.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    target={item.target}
                    className="text-sm transition-colors hover:text-accent"
                  >
                    {item.title}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        )}
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-6xl flex-col gap-1 px-4 py-5 text-xs sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <p>
            © {new Date().getFullYear()} dotCMS Starter. All rights reserved.
          </p>
          <p>Built with Next.js &amp; dotCMS</p>
        </div>
      </div>
    </footer>
  );
}
