import type { ReactNode } from "react";
import { Eyebrow, Icon, Section, type IconSource } from "@/components/ui";

const display = "font-display";
const heading = "font-display font-extrabold tracking-tight";

/** Paragraph class for legal prose (use on <p> inside section bodies). */
export const legalP = "mb-7 text-[1.04rem] leading-[1.72] text-ink-body";

/** Inline link inside legal prose. */
export function LegalLink({
  href,
  children,
  external,
}: {
  href: string;
  children: ReactNode;
  external?: boolean;
}) {
  return (
    <a
      href={href}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      className="border-b-2 border-[color-mix(in_srgb,var(--orange)_30%,transparent)] font-semibold text-orange no-underline hover:border-orange"
    >
      {children}
    </a>
  );
}

/** Icon-bulleted list used in a couple of legal sections. */
export function LegalBullets({
  items,
}: {
  items: { icon: IconSource; color?: string; children: ReactNode }[];
}) {
  return (
    <ul className="mb-7 flex list-none flex-col gap-3 p-0">
      {items.map((it, i) => (
        <li key={i} className="flex gap-[11px]">
          <Icon src={it.icon} color={it.color ?? "var(--green)"} size={20} style={{ marginTop: 2 }} />
          <span className="text-[1.04rem] leading-[1.6] text-ink-body">{it.children}</span>
        </li>
      ))}
    </ul>
  );
}

export interface LegalSection {
  id: string;
  heading: string;
  body: ReactNode;
}

export interface LegalPageProps {
  title: string;
  lead: string;
  summary: ReactNode;
  sections: LegalSection[];
  disclaimer: ReactNode;
  /** "Last updated" label. @default "June 2026" */
  updated?: string;
}

/**
 * Shared legal-document layout (Privacy / Terms): an alt-band hero with a
 * last-updated chip, a sticky table of contents, and the prose article with a
 * plain-English summary callout and a counsel disclaimer.
 */
export function LegalPage({ title, lead, summary, sections, disclaimer, updated = "June 2026" }: LegalPageProps) {
  return (
    <>
      {/* Hero */}
      <Section tone="alt" py="52px" style={{ borderBottom: "1.5px solid var(--ink)" }}>
        <Eyebrow>Legal</Eyebrow>
        <h1 className={`${heading} mb-[14px] mt-3 text-[clamp(2.1rem,4.4vw,3.2rem)] leading-[1.04]`}>{title}</h1>
        <p className="m-0 max-w-[42em] text-lead text-ink-body">{lead}</p>
        <div className="mt-5 inline-flex items-center gap-2 rounded-[20px] border border-ink bg-white px-[14px] py-[6px] text-[.82rem] font-medium shadow-[3px_3px_0_rgba(var(--shadow-ink),0.08)]">
          <span className="h-[7px] w-[7px] rounded-full bg-green" />
          Last updated · {updated}
        </div>
      </Section>

      {/* Body */}
      <Section py="54px">
        <div className="grid items-start gap-[54px] lg:grid-cols-[230px_1fr]">
          {/* TOC */}
          <aside className="hidden lg:sticky lg:top-[92px] lg:block">
            <div className={`${display} mb-3 text-[.72rem] font-bold uppercase tracking-[.12em] text-ink-soft`}>
              On this page
            </div>
            <nav className="flex flex-col">
              {sections.map((s) => (
                <a
                  key={s.id}
                  href={`#${s.id}`}
                  className="border-l-2 border-[color-mix(in_srgb,var(--ink)_16%,transparent)] py-[7px] pl-[14px] text-[.88rem] leading-[1.35] text-ink-soft no-underline transition-colors hover:text-ink"
                >
                  {s.heading}
                </a>
              ))}
            </nav>
          </aside>

          {/* Article */}
          <article className="max-w-[720px]">
            <p className="mb-[30px] rounded-[12px] border border-ink bg-white px-[18px] py-4 text-[.94rem] text-ink-soft shadow-[4px_4px_0_rgba(var(--shadow-ink),0.08)]">
              {summary}
            </p>

            {sections.map((s) => (
              <section key={s.id}>
                <h2 id={s.id} className={`${heading} mb-3 scroll-mt-[92px] text-[1.5rem]`}>
                  {s.heading}
                </h2>
                {s.body}
              </section>
            ))}

            <p className="m-0 border-l-[3px] border-[color-mix(in_srgb,var(--ink)_30%,transparent)] bg-[color-mix(in_srgb,var(--ink)_4%,transparent)] px-4 py-[14px] text-[.9rem] italic text-ink-soft">
              {disclaimer}
            </p>
          </article>
        </div>
      </Section>
    </>
  );
}

export default LegalPage;
