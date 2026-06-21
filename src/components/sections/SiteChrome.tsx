"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { SiteHeader } from "./SiteHeader";
import { SiteFooter } from "./SiteFooter";

// Routes that opt out of the site header/footer and render full-bleed. A nested
// layout can't remove the root layout's chrome in the App Router, so the choice
// is made here from the pathname. The Isometric Workflow Editor is full-screen.
const CHROMELESS_PREFIXES = ["/isometric-editor"];

function isChromeless(pathname: string | null): boolean {
  if (!pathname) return false;
  return CHROMELESS_PREFIXES.some((p) => pathname === p || pathname.startsWith(`${p}/`));
}

/**
 * Wraps page content with the standard header/footer, except on chromeless
 * routes (the full-screen editor), which render their own shell.
 */
export function SiteChrome({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  if (isChromeless(pathname)) {
    return <>{children}</>;
  }

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">{children}</main>
      <SiteFooter />
    </div>
  );
}

export default SiteChrome;
