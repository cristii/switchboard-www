"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo, ThemeToggle } from "@/components/ui";
import { primaryNav, routeName, isActiveRoute } from "@/lib/nav";
import { useTheme } from "@/lib/useTheme";
import { BookCall } from "./BookCall";
import { MobileNav } from "./MobileNav";

/**
 * Sticky site header: translucent paper bar with a hard ink underline. The
 * primary nav (inline at md+, a hamburger dropdown below) highlights the active
 * route. On mobile the wordmark collapses to the connector mark and the current
 * page name sits centered in the bar so your location is always visible.
 */
export function SiteHeader() {
  const pathname = usePathname() ?? "/";
  const current = routeName(pathname);
  const isHome = pathname === "/";
  const { theme, toggle } = useTheme();

  return (
    <header className="sticky top-0 z-50 border-b border-ink bg-[color-mix(in_srgb,var(--paper)_82%,transparent)] backdrop-blur-[6px]">
      <div className="relative mx-auto flex h-[70px] max-w-content items-center justify-between gap-5 px-gutter">
        <Link
          href="/"
          aria-label="Switchboard AI Systems, home"
          className="text-ink no-underline"
        >
          {/* On mobile the wordmark collapses to the mark off the home page so the
              current-page badge can sit centered; the home page keeps the full
              brand lockup. Desktop always shows the wordmark. */}
          <span className="md:hidden">
            <Logo wordmark={isHome} />
          </span>
          <span className="hidden md:inline-flex">
            <Logo />
          </span>
        </Link>

        {/* Current page name, centered in the bar (mobile only, off the home page). */}
        {current && !isHome && (
          <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 md:hidden">
            <span className="inline-flex items-center gap-[7px] rounded-full border border-ink bg-white px-[13px] py-[5px] font-display text-[.8rem] font-bold tracking-tight text-ink shadow-[2px_2px_0_rgba(var(--shadow-ink),0.12)]">
              <span className="h-[7px] w-[7px] rounded-full bg-orange" />
              {current}
            </span>
          </div>
        )}

        <nav className="hidden items-center gap-[30px] font-display text-sm font-semibold md:flex">
          {primaryNav.map((item) => {
            const active = isActiveRoute(item.href, pathname);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={`relative no-underline transition-colors ${
                  active
                    ? "text-orange after:absolute after:-bottom-[6px] after:left-0 after:h-[2px] after:w-full after:rounded-full after:bg-orange after:content-['']"
                    : "text-ink hover:text-orange"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-3">
          <div className="hidden md:block">
            <ThemeToggle theme={theme} onToggle={toggle} />
          </div>
          <div className="hidden md:block">
            <BookCall size="sm" arrow>
              Book a 15-min call
            </BookCall>
          </div>
          <MobileNav />
        </div>
      </div>
    </header>
  );
}

export default SiteHeader;
