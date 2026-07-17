import Link from "next/link";
import type { DotCMSNavigationItem } from "@dotcms/types";

/*
 * Site header component. Receives the nav items fetched from DotCMS and
 * optionally a logo image URL/alt text. Renders a sticky solid navy bar
 * with the brand on the left and the top-level navigation on the right.
 * Nested nav items (children) are intentionally not rendered yet.
 */

interface HeaderProps {
  navItems: DotCMSNavigationItem[];
  logo?: string;
  logoAlt?: string;
  currentPath?: string;
}

/* Strips the trailing slash so "/about/" and "/about" compare equal. */
function normalizePath(path: string): string {
  return path !== "/" && path.endsWith("/") ? path.slice(0, -1) : path;
}

export default function Header({
  navItems,
  logo,
  logoAlt = "Logo",
  currentPath = "/",
}: HeaderProps) {
  const activePath = normalizePath(currentPath);

  return (
    <header className="sticky top-0 z-50 bg-brand-900 shadow-md ring-1 ring-white/5">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-x-8 gap-y-2 px-4 py-3 sm:px-6">
        <Link
          href="/"
          className="flex shrink-0 items-center gap-2 transition-opacity hover:opacity-80"
        >
          {logo ? (
            /* Plain <img>: next/image needs the DotCMS host in remotePatterns. */
            // eslint-disable-next-line @next/next/no-img-element
            <img src={logo} alt={logoAlt} className="h-8 w-auto" />
          ) : (
            <span className="text-lg font-semibold tracking-tight text-white">
              dotCMS Starter
            </span>
          )}
        </Link>

        <nav aria-label="Main navigation">
          <ul className="flex flex-wrap items-center gap-x-1 gap-y-1">
            {navItems.map((item) => {
              const isActive = normalizePath(item.href) === activePath;

              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    target={item.target}
                    aria-current={isActive ? "page" : undefined}
                    className={`rounded-md px-3 py-1.5 text-sm font-semibold transition-colors ${
                      isActive
                        ? "bg-accent text-white shadow-sm"
                        : "text-slate-100 hover:bg-white/10 hover:text-white"
                    }`}
                  >
                    {item.title}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </header>
  );
}
