import Link from "next/link";
import { Logo } from "@/components/ui";
import { footerColumns, socialLinks } from "@/lib/nav";

const iconBox =
  "grid h-10 w-10 place-items-center rounded-[10px] border border-on-dark-line-2 text-on-dark transition-colors hover:bg-on-dark-line";

const svgProps = {
  width: 18,
  height: 18,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeLinecap: "round",
  strokeLinejoin: "round",
} as const;

/**
 * The dark "ink" footer: brand blurb + social, four link columns, an oversized
 * ghost wordmark, and the bottom bar. Ported from Site Footer.dc.html; links
 * resolve to the real Next routes (see src/lib/nav.ts).
 */
export function SiteFooter() {
  return (
    <footer className="overflow-hidden border-t border-black bg-dark text-on-dark">
      <div className="mx-auto max-w-content px-gutter pt-16">
        <div className="grid gap-x-7 gap-y-10 md:grid-cols-[1.6fr_1fr_1fr_1fr_1fr]">
          {/* brand */}
          <div className="max-w-[24em]">
            <Link
              href="/"
              aria-label="Switchboard AI Systems, home"
              className="inline-flex text-on-dark no-underline"
            >
              <Logo />
            </Link>
            <p className="mt-[22px] font-display text-[1.5rem] font-bold leading-[1.1] tracking-tight">
              I build it.
              <br />
              <span className="text-orange">You scale it.</span>
            </p>
            <p className="mb-[22px] mt-4 text-base leading-[1.6] text-on-dark-strong">
              Custom automation and AI chatbots that handle the grunt work, built,
              connected and maintained from Bucharest.
            </p>
            <div className="flex gap-[10px]">
              <a href={socialLinks.email} aria-label="Email" className={iconBox}>
                <svg {...svgProps} strokeWidth={1.8}>
                  <rect x="3" y="5" width="18" height="14" rx="2" />
                  <path d="M3 7l9 6 9-6" />
                </svg>
              </a>
              <a
                href={socialLinks.telegram}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Telegram"
                className={iconBox}
              >
                <svg {...svgProps} strokeWidth={1.8}>
                  <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
                </svg>
              </a>
              <a
                href={socialLinks.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className={iconBox}
              >
                <svg {...svgProps} strokeWidth={1.8}>
                  <rect x="3" y="3" width="18" height="18" rx="3" />
                  <path d="M7 10v7" />
                  <path d="M7 7v.01" />
                  <path d="M11 17v-4a2 2 0 0 1 4 0v4" />
                  <path d="M11 17v-7" />
                </svg>
              </a>
              <a
                href={socialLinks.github}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
                className={iconBox}
              >
                <svg {...svgProps} strokeWidth={1.7}>
                  <path d="M9 19c-4 1.4-4-2-6-2.5M15 22v-3.9a3.4 3.4 0 0 0-.9-2.6c3-.3 6.1-1.5 6.1-6.6a5.1 5.1 0 0 0-1.4-3.6 4.8 4.8 0 0 0-.1-3.6s-1.2-.4-3.8 1.4a13 13 0 0 0-6.8 0C4.5 1.8 3.3 2.2 3.3 2.2a4.8 4.8 0 0 0-.1 3.6A5.1 5.1 0 0 0 1.8 9.4c0 5 3.1 6.3 6 6.6a3.4 3.4 0 0 0-.9 2.6V22" />
                </svg>
              </a>
            </div>
          </div>

          {/* link columns */}
          {footerColumns.map((col) => (
            <div key={col.heading}>
              <div className="mb-4 font-display text-eyebrow font-bold uppercase text-on-dark-faint">
                {col.heading}
              </div>
              <div className="flex flex-col gap-[11px]">
                {col.links.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="text-on-dark no-underline transition-colors hover:text-orange"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* oversized ghost wordmark */}
        <div
          aria-hidden="true"
          className="mb-[-10px] mt-[46px] select-none whitespace-nowrap font-display text-[9.6rem] font-extrabold leading-[.82] tracking-[-.04em] text-[color-mix(in_srgb,var(--on-dark)_6%,transparent)]"
        >
          Switchboard
        </div>
      </div>

      {/* bottom bar */}
      <div className="border-t border-on-dark-line">
        <div className="mx-auto flex max-w-content flex-wrap items-center justify-between gap-[14px] px-gutter py-5 text-sm text-on-dark-muted">
          <span>© 2026 Switchboard AI Systems, All rights reserved.</span>
          <span className="font-display text-[.7rem] font-semibold uppercase tracking-[.18em]">
            Built · Connected · Maintained, from Bucharest
          </span>
        </div>
      </div>
    </footer>
  );
}

export default SiteFooter;
