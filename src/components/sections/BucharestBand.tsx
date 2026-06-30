import { Button, Eyebrow } from "@/components/ui";
import { socialLinks } from "@/lib/nav";

const heading = "font-display font-extrabold tracking-tight";

/** Romanian folk cross-stitch motif band (a tiling diamond chain). Decorative. */
function FolkStrip({ id }: { id: string }) {
  return (
    <div className="bg-paper-3" aria-hidden="true">
      {/* currentColor (= text-ink) for the diamond outline so it flips with the
          theme; the orange accents read from var(--orange) via inline style. */}
      <svg width="100%" height="22" className="block text-ink">
        <defs>
          <pattern id={id} width="36" height="22" patternUnits="userSpaceOnUse">
            <path d="M9 4 L15 11 L9 18 L3 11 Z" fill="none" stroke="currentColor" strokeWidth="1.3" />
            <path d="M27 4 L33 11 L27 18 L21 11 Z" fill="none" stroke="currentColor" strokeWidth="1.3" />
            <path d="M18 7.5 L21.5 11 L18 14.5 L14.5 11 Z" style={{ fill: "var(--orange)" }} />
            <path d="M0 7.5 L3.5 11 L0 14.5 L-3.5 11 Z" style={{ fill: "var(--orange)" }} />
            <path d="M36 7.5 L39.5 11 L36 14.5 L32.5 11 Z" style={{ fill: "var(--orange)" }} />
          </pattern>
        </defs>
        <rect width="100%" height="22" fill={`url(#${id})`} />
      </svg>
    </div>
  );
}

/** A nod to the Romanian tricolor, as a small tilted flag tag. */
function TricolorTag() {
  return (
    <div
      className="absolute -right-3 -top-3 z-[3] flex overflow-hidden rounded-[6px] border-[1.5px] border-ink shadow-[3px_3px_0_rgba(var(--shadow-ink),0.18)]"
      style={{ transform: "rotate(5deg)" }}
      aria-hidden="true"
    >
      <span className="h-7 w-[14px]" style={{ background: "#002B7F" }} />
      <span className="h-7 w-[14px]" style={{ background: "#FCD116" }} />
      <span className="h-7 w-[14px]" style={{ background: "#CE1126" }} />
    </div>
  );
}

/**
 * "Based in Bucharest?", a warm, local collaboration CTA for the About page.
 * On-brand paper-and-ink, with a Romanian folk cross-stitch border, a line-art
 * Arcul de Triumf and a tricolor flag tag: playful, but still professional.
 */
export function BucharestBand() {
  return (
    <section className="relative overflow-hidden border-y border-ink bg-paper-2">
      <FolkStrip id="sb-folk-top" />

      <div className="mx-auto grid max-w-content items-center gap-12 px-gutter py-14 lg:grid-cols-[1.1fr_.9fr]">
        {/* Copy */}
        <div>
          <div className="mb-4 flex items-center gap-[10px]">
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              className="text-orange"
              strokeWidth={1.8}
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M12 21s-7-6-7-11a7 7 0 0 1 14 0c0 5-7 11-7 11z" />
              <circle cx="12" cy="10" r="2.5" />
            </svg>
            <Eyebrow>Bucharest · România</Eyebrow>
            <span className="inline-flex items-center gap-1" aria-hidden="true">
              <span className="h-2 w-2 rounded-full" style={{ background: "#002B7F" }} />
              <span className="h-2 w-2 rounded-full" style={{ background: "#FCD116" }} />
              <span className="h-2 w-2 rounded-full" style={{ background: "#CE1126" }} />
            </span>
          </div>

          <h2 className={`${heading} max-w-[14em] text-[clamp(1.8rem,3.2vw,2.6rem)] leading-[1.06]`}>
            Based in Bucharest? Let&apos;s build something local.
          </h2>
          <p className="mb-7 mt-4 max-w-[34em] text-lead leading-[1.6] text-ink-body">
            If you&apos;re a Bucharest founder, agency or shop owner curious about a collaboration,
            drop me an email. I love building with people I can actually meet for a coffee.
          </p>
          <div className="flex flex-wrap items-center gap-4">
            <Button href={`${socialLinks.email}?subject=Bucharest%20collaboration`} arrow>
              Drop me an email
            </Button>
            <span className="font-hand text-[1.3rem] text-ink">↳ hai la o cafea</span>
          </div>
        </div>

        {/* Landmark */}
        <div className="flex justify-center lg:justify-end">
          <div className="relative w-full max-w-[320px] rounded-[18px] border-2 border-ink bg-white p-7 shadow-raised transition-transform hover:-translate-y-1">
            <TricolorTag />
            <svg
              viewBox="0 0 160 140"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.8}
              strokeLinecap="round"
              strokeLinejoin="round"
              className="mx-auto block h-auto w-full max-w-[240px] text-ink"
              role="img"
              aria-label="Line drawing of the Arcul de Triumf in Bucharest"
            >
              {/* ground + base platform */}
              <path d="M10 132 H150" />
              <path d="M26 132 v-6 H134 v6" />
              {/* attic block */}
              <rect x="42" y="16" width="76" height="20" rx="2" />
              <path d="M54 26 H106" />
              {/* main body */}
              <rect x="30" y="36" width="100" height="90" rx="2" />
              {/* cornice */}
              <path d="M30 52 H130" />
              {/* pilasters */}
              <path d="M48 52 V126 M112 52 V126" />
              {/* central archway */}
              <path d="M66 126 V88 a14 14 0 0 1 28 0 V126" />
              {/* keystone */}
              <path d="M80 74 v8" style={{ stroke: "var(--orange)" }} strokeWidth={2.2} />
            </svg>
            <div className="mt-3 text-center font-hand text-[1.2rem] text-ink-soft">
              Arcul de Triumf · București
            </div>
          </div>
        </div>
      </div>

      <FolkStrip id="sb-folk-bottom" />
    </section>
  );
}

export default BucharestBand;
