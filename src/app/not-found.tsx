import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui";

export const metadata: Metadata = {
  title: "Page not found",
};

const jumpLinks = [
  { label: "Services", href: "/services" },
  { label: "Process", href: "/process" },
  { label: "Pricing", href: "/pricing" },
  { label: "About", href: "/about" },
];

const illustrationCss = `
  @keyframes nfPacket { 0% { offset-distance:0%; opacity:0; } 12% { opacity:1; } 44% { opacity:1; } 50% { offset-distance:46%; opacity:0; } 100% { offset-distance:46%; opacity:0; } }
  @keyframes nfSpark { 0%,100% { opacity:.25; transform:scale(.85); } 50% { opacity:1; transform:scale(1.15); } }
  .nf-packet { offset-path: path('M0,0 H150'); animation: nfPacket 2.4s linear infinite; }
  .nf-spark { animation: nfSpark 1.3s ease-in-out infinite; transform-origin:center; }
`;

/** 404 page — ported from 404.dc.html; the header/footer come from the layout. */
export default function NotFound() {
  return (
    <section className="flex min-h-[60vh] items-center justify-center px-gutter py-14 text-center">
      <style>{illustrationCss}</style>
      <div className="max-w-[40em]">
        {/* broken-connection graphic */}
        <div className="mx-auto mb-[30px] flex w-[330px] max-w-full items-center justify-center">
          <svg
            width="330"
            height="120"
            viewBox="0 0 330 120"
            fill="none"
            className="max-w-full overflow-visible"
          >
            {/* left node */}
            <rect x="6" y="34" width="56" height="56" rx="14" fill="#fff" stroke="#15211F" strokeWidth="2" />
            <path d="M27 62h14M34 55v14" stroke="#15211F" strokeWidth="2" strokeLinecap="round" />
            <circle cx="62" cy="62" r="4.5" fill="#15211F" />
            {/* broken wire halves */}
            <path d="M70 62 H140" stroke="#15211F" strokeWidth="2" strokeDasharray="7 7" strokeLinecap="round" />
            <path d="M196 62 H262" stroke="#15211F" strokeWidth="2" strokeDasharray="7 7" strokeLinecap="round" />
            {/* frayed ends */}
            <path d="M140 62 l8 -7 M140 62 l8 7" stroke="#C12A2A" strokeWidth="2" strokeLinecap="round" />
            <path d="M196 62 l-8 -7 M196 62 l-8 7" stroke="#C12A2A" strokeWidth="2" strokeLinecap="round" />
            {/* moving packet that dies at the break */}
            <g style={{ transform: "translate(70px,62px)" }}>
              <circle className="nf-packet" r="5" fill="#B45309" />
            </g>
            {/* spark at break */}
            <g transform="translate(168 62)">
              <g className="nf-spark">
                <path d="M2 -14 L-4 0 L3 0 L-2 14 L9 -3 L2 -3 Z" fill="#FBBF24" stroke="#15211F" strokeWidth="1.4" strokeLinejoin="round" />
              </g>
            </g>
            {/* right node (error) */}
            <rect x="268" y="34" width="56" height="56" rx="14" fill="#fff" stroke="#15211F" strokeWidth="2" />
            <circle cx="268" cy="62" r="4.5" fill="#15211F" />
            <path d="M296 48 l11 19 h-22 z" fill="none" stroke="#C12A2A" strokeWidth="2" strokeLinejoin="round" />
            <path d="M296 56 v6" stroke="#C12A2A" strokeWidth="2" strokeLinecap="round" />
            <circle cx="296" cy="65.5" r=".9" fill="#C12A2A" />
          </svg>
        </div>

        <div className="font-display text-[5.5rem] font-extrabold leading-[.9] tracking-[-.04em] text-orange sm:text-[7rem]">
          404
        </div>

        <h1 className="mt-[14px] font-display text-[clamp(1.6rem,3.4vw,2.3rem)] font-extrabold leading-[1.1] tracking-tight text-ink">
          This node doesn&apos;t exist.
        </h1>
        <p className="mx-auto mt-4 max-w-[30em] text-[1.1rem] leading-[1.6] text-ink-body">
          The page you&apos;re after broke its connection — moved, renamed, or never wired
          up. Even my automations drop a packet now and then.
        </p>
        <p className="mt-[14px] font-hand text-[1.35rem] text-ink">
          ↳ let&apos;s route you back to something that works.
        </p>

        <div className="mt-[30px] flex flex-wrap items-center justify-center gap-[14px]">
          <Button href="/" size="lg" arrow>
            Back to home
          </Button>
          <Button href="/contact" variant="ghost" size="lg">
            Get in touch
          </Button>
        </div>

        {/* popular links */}
        <div className="mx-auto mt-10 max-w-[30em]">
          <div className="mb-3 font-display text-eyebrow font-bold uppercase text-ink-soft">
            Or jump to
          </div>
          <div className="flex flex-wrap justify-center gap-[9px]">
            {jumpLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-pill border border-ink bg-white px-[15px] py-[7px] text-sm font-semibold text-ink no-underline shadow-card"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
