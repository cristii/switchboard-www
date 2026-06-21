import Link from "next/link";
import { Logo } from "@/components/ui";
import { primaryNav } from "@/lib/nav";
import { BookCall } from "./BookCall";
import { MobileNav } from "./MobileNav";

/**
 * Sticky site header: translucent paper bar with a hard ink underline, the
 * brand logo, primary nav (inline at md+, a hamburger dropdown below), and the
 * booking CTA. Ported from the landing-page header.
 */
export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-ink bg-[color-mix(in_srgb,var(--paper)_82%,transparent)] backdrop-blur-[6px]">
      <div className="mx-auto flex h-[70px] max-w-content items-center justify-between gap-5 px-gutter">
        <Link
          href="/"
          aria-label="Switchboard AI Systems, home"
          className="text-ink no-underline"
        >
          <Logo />
        </Link>

        <nav className="hidden items-center gap-[30px] font-display text-sm font-semibold md:flex">
          {primaryNav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-ink no-underline transition-colors hover:text-orange"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <BookCall size="sm" arrow>
            <span className="hidden sm:inline">Book a 15-min call</span>
            <span className="sm:hidden">Book a call</span>
          </BookCall>
          <MobileNav />
        </div>
      </div>
    </header>
  );
}

export default SiteHeader;
