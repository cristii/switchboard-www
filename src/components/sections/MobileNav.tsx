"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { primaryNav, isActiveRoute } from "@/lib/nav";
import { BookCall } from "./BookCall";

/**
 * Mobile-only hamburger navigation. Toggles a paper dropdown of the primary nav
 * below the sticky header. Closes on link tap, Escape, or a tap outside.
 * Hidden at md+ where the inline nav shows instead.
 */
export function MobileNav() {
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef<HTMLDivElement>(null);
  const pathname = usePathname() ?? "/";

  React.useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    const onDown = (e: PointerEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onDown);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onDown);
    };
  }, [open]);

  return (
    <div className="md:hidden" ref={ref}>
      <button
        type="button"
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
        aria-controls="mobile-nav"
        onClick={() => setOpen((v) => !v)}
        className="grid h-10 w-10 place-items-center rounded-[9px] border border-ink bg-white text-ink"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
        </svg>
      </button>

      {open && (
        <div
          id="mobile-nav"
          className="absolute inset-x-0 top-full z-50 border-b border-ink bg-paper shadow-pop"
        >
          <nav className="mx-auto flex max-w-content flex-col px-gutter py-1">
            {primaryNav.map((item) => {
              const active = isActiveRoute(item.href, pathname);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  aria-current={active ? "page" : undefined}
                  className={`flex items-center justify-between border-b border-line-soft py-[14px] font-display text-base font-semibold no-underline transition-colors last:border-0 ${
                    active ? "text-orange" : "text-ink hover:text-orange"
                  }`}
                >
                  <span>{item.label}</span>
                  {active && (
                    <span className="h-[8px] w-[8px] rounded-full bg-orange" aria-hidden="true" />
                  )}
                </Link>
              );
            })}
            <div className="py-4">
              <BookCall size="md" arrow onClick={() => setOpen(false)} style={{ width: "100%" }}>
                Book a 15-min call
              </BookCall>
            </div>
          </nav>
        </div>
      )}
    </div>
  );
}

export default MobileNav;
