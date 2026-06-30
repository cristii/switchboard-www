import { Eyebrow, HandUnderline } from "@/components/ui";

const heading = "font-display font-extrabold tracking-tight";

const chip =
  "inline-flex items-center gap-2 rounded-[20px] border border-ink bg-white px-[14px] py-[6px] text-[.84rem] font-medium shadow-[3px_3px_0_rgba(var(--shadow-ink),0.08)]";

/** Minimal 6-arm line snowflake. Decorative. */
function Snowflake({ size = 16 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.4}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {[0, 60, 120, 180, 240, 300].map((a) => (
        <g key={a} transform={`rotate(${a} 12 12)`}>
          <line x1="12" y1="12" x2="12" y2="2.5" />
          <line x1="12" y1="6" x2="9.6" y2="4.2" />
          <line x1="12" y1="6" x2="14.4" y2="4.2" />
        </g>
      ))}
    </svg>
  );
}

/** Minimal line-art snowboard with two bindings. Decorative. */
function boardGlyph(size = 22, color = "var(--ink)") {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={1.7}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <g transform="rotate(35 12 12)">
        <rect x="9.4" y="2.4" width="5.2" height="19.2" rx="2.6" />
        <line x1="9.4" y1="9" x2="14.6" y2="9" />
        <line x1="9.4" y1="15" x2="14.6" y2="15" />
      </g>
    </svg>
  );
}

function pinGlyph(color: string) {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M12 21s-7-6-7-11a7 7 0 0 1 14 0c0 5-7 11-7 11z" />
      <circle cx="12" cy="10" r="2.5" />
    </svg>
  );
}

/** Tiling snow-capped mountain ridge (line-art) that grounds the band. */
function MountainRidge({ id }: { id: string }) {
  return (
    <div aria-hidden="true">
      <svg width="100%" height="70" className="block">
        <defs>
          <pattern id={id} width="200" height="70" patternUnits="userSpaceOnUse">
            {/* back ridge */}
            <path d="M0 66 L34 38 L74 66 L124 30 L176 66 L200 66 L200 70 L0 70 Z" fill="#ffffff" opacity="0.45" />
            <path
              d="M0 66 L34 38 L74 66 L124 30 L176 66"
              fill="none"
              stroke="color-mix(in srgb, var(--ink) 28%, transparent)"
              strokeWidth="1.2"
              strokeLinejoin="round"
            />
            {/* front ridge (snow-filled) */}
            <path d="M0 66 L50 18 L100 66 L150 30 L200 66 L200 70 L0 70 Z" fill="#ffffff" opacity="0.94" />
            <path d="M0 66 L50 18 L100 66 L150 30 L200 66" fill="none" stroke="var(--ink)" strokeWidth="1.5" strokeLinejoin="round" />
          </pattern>
        </defs>
        <rect width="100%" height="70" fill={`url(#${id})`} />
      </svg>
    </div>
  );
}

/* Scattered drifting flakes, baked timings for a calm, non-uniform fall. */
const flakes = [
  { l: 6, s: 14, d: 18, delay: -2 },
  { l: 18, s: 10, d: 22, delay: -9 },
  { l: 31, s: 18, d: 15, delay: -5 },
  { l: 44, s: 12, d: 20, delay: -13 },
  { l: 57, s: 16, d: 17, delay: -7 },
  { l: 70, s: 11, d: 23, delay: -3 },
  { l: 82, s: 15, d: 16, delay: -11 },
  { l: 92, s: 13, d: 21, delay: -6 },
];

/**
 * "On the mountain", a playful-but-professional band about the snowboarding
 * hobby for the About page. On-brand paper-and-ink with minimalist line-art
 * motifs: drifting snowflakes, a snow-capped mountain ridge and a snowboard
 * tag. The photo (Straja, Carpathians) is shown uncropped at its full ratio.
 */
export function SnowboardBand() {
  return (
    <section
      className="relative overflow-hidden border-y border-ink"
      style={{
        background:
          "linear-gradient(180deg, color-mix(in srgb, #3b5168 8%, var(--paper)) 0%, var(--paper) 58%)",
      }}
    >
      {/* drifting snow (decorative, behind content) */}
      <div className="pointer-events-none absolute inset-0 z-0 text-ink">
        {flakes.map((f, i) => (
          <span
            key={i}
            className="absolute"
            style={{
              left: `${f.l}%`,
              top: 0,
              animation: `sb-snow-fall ${f.d}s linear ${f.delay}s infinite`,
            }}
          >
            <Snowflake size={f.s} />
          </span>
        ))}
      </div>

      <div className="relative z-10 mx-auto grid max-w-content items-center gap-12 px-gutter pb-12 pt-16 lg:grid-cols-[.85fr_1.15fr]">
        {/* Photo */}
        <div className="relative mx-auto w-full max-w-[420px]">
          <div className="relative rounded-[18px] border-2 border-ink bg-white p-3 shadow-raised transition-transform hover:-translate-y-1">
            <div
              className="absolute -left-3 -top-3 z-[3] flex items-center gap-[6px] rounded-[8px] border-[1.5px] border-ink bg-amber px-[10px] py-[5px] font-hand text-[1.12rem] font-semibold shadow-[3px_3px_0_rgba(var(--shadow-ink),0.18)]"
              style={{ transform: "rotate(-5deg)" }}
            >
              {boardGlyph(18, "var(--ink)")}
              Straja
            </div>
            <img
              src="/snowboarding-straja.jpg"
              alt="Cristi snowboarding a rail on a bluebird day in Straja, in the Carpathian mountains"
              className="block h-auto w-full rounded-[12px] border border-ink"
            />
            <div className="mt-3 pb-1 text-center font-hand text-[1.2rem] text-ink-soft">
              ↳ Straja · Carpathian Mountains
            </div>
          </div>
        </div>

        {/* Copy */}
        <div>
          <div className="mb-4 flex items-center gap-[10px]">
            <span className="text-orange">
              <Snowflake size={17} />
            </span>
            <Eyebrow>On the mountain</Eyebrow>
            <span className="text-ink-soft">{boardGlyph(18, "var(--ink)")}</span>
          </div>

          <h2 className={`${heading} max-w-[15em] text-[clamp(1.8rem,3.2vw,2.6rem)] leading-[1.06]`}>
            Come winter, I trade pipelines for{" "}
            <span className="text-orange">
              <HandUnderline>powder.</HandUnderline>
            </span>
          </h2>
          <p className="mb-[14px] mt-4 max-w-[34em] text-lead leading-[1.6] text-ink-body">
            When the season turns, you will find me in Straja, high in the Carpathian mountains,
            swapping my keyboard for a snowboard for a few days.
          </p>
          <p className="mb-7 max-w-[34em] text-[1.04rem] leading-[1.6] text-ink-body">
            Turns out landing a clean rail and shipping a clean workflow run on the same instinct:
            read the line, commit early, and stay loose for the exact moment something tries to throw
            you off.
          </p>

          <div className="flex flex-wrap items-center gap-[10px]">
            <span className={chip}>
              {pinGlyph("var(--orange)")}
              Straja, Carpathians
            </span>
            <span className={chip}>
              {boardGlyph(15, "var(--orange)")}
              Park &amp; rails
            </span>
            <span className="font-hand text-[1.3rem] text-ink">↳ first chair, every time</span>
          </div>
        </div>
      </div>

      <div className="relative z-[1]">
        <MountainRidge id="sb-ridge" />
      </div>
    </section>
  );
}

export default SnowboardBand;
