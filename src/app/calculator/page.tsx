import type { Metadata } from "next";

import { Eyebrow, HandUnderline, Icon, Section } from "@/components/ui";
import { Calculator } from "@/components/sections/Calculator";

import chartIcon from "@/assets/icons/chart.svg";

export const metadata: Metadata = {
  title: "Cost calculator",
  description:
    "Estimate your automation cost in 60 seconds. Build your workflow, watch the price update, transparent infrastructure and AI costs, no hidden API bills.",
};

const heading = "font-display font-extrabold tracking-tight";

export default function CalculatorPage() {
  return (
    <>
      {/* ============ HERO ============ */}
      <Section id="top" py="48px" width="1240px" innerStyle={{ textAlign: "center" }}>
        <div className="mb-3 inline-flex items-center gap-[9px]">
          <Icon src={chartIcon} color="var(--orange)" size={17} />
          <Eyebrow>Cost calculator</Eyebrow>
        </div>
        <h1 className={`${heading} mx-auto max-w-[15em] text-hero text-ink`}>
          Estimate your automation cost in{" "}
          <span className="text-orange">
            <HandUnderline>60 seconds.</HandUnderline>
          </span>
        </h1>
        <p className="mx-auto my-[18px] max-w-[32em] text-lead text-ink-body">
          Build your workflow on the left, watch the price update on the right. Transparent
          infrastructure &amp; AI costs, no hidden API bills, no surprises.
        </p>
        <div className="inline-flex flex-wrap items-center justify-center gap-[14px] text-[.86rem] text-ink-soft">
          <span className="inline-flex items-center gap-[7px]">
            <span className="inline-block h-2 w-2 rounded-full bg-green" />
            Typical client spends <b className="text-ink">$30–$120/mo</b>
          </span>
          <span className="inline-flex items-center gap-[7px] rounded-[20px] border border-ink bg-white px-[11px] py-1 font-display text-[.74rem] font-bold uppercase tracking-[.04em]">
            Built with n8n
          </span>
        </div>
      </Section>

      {/* ============ CALCULATOR ============ */}
      <Section id="calc" py="24px" width="1240px" style={{ paddingBottom: "70px" }}>
        <Calculator />
      </Section>
    </>
  );
}
