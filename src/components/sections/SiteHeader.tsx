import Link from "next/link";
import { Button, Logo } from "@/components/ui";
import { bookingHref, primaryNav } from "@/lib/nav";

/**
 * Sticky site header: translucent paper bar with a hard ink underline, the
 * brand logo, primary nav (hidden on small screens, matching the references),
 * and the booking CTA. Ported from the landing-page header.
 */
export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-ink bg-[color-mix(in_srgb,var(--paper)_82%,transparent)] backdrop-blur-[6px]">
      <div className="mx-auto flex h-[70px] max-w-content items-center justify-between gap-5 px-gutter">
        <Link
          href="/"
          aria-label="Switchboard AI Systems — home"
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

        <Button href={bookingHref} size="sm" arrow>
          <span className="hidden sm:inline">Book a 15-min call</span>
          <span className="sm:hidden">Book a call</span>
        </Button>
      </div>
    </header>
  );
}

export default SiteHeader;
