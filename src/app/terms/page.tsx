import type { Metadata } from "next";

import { LegalPage, LegalLink, LegalBullets, legalP } from "@/components/sections/LegalPage";
import { socialLinks } from "@/lib/nav";

import checkIcon from "@/assets/icons/check.svg";

export const metadata: Metadata = {
  title: "Terms of Service",
  description:
    "The straightforward terms that govern working with Switchboard AI Systems and using this website, scope, payment, IP, warranties and liability.",
};

const email = <LegalLink href={socialLinks.email}>cristi.satcovschi@gmail.com</LegalLink>;

export default function TermsPage() {
  return (
    <LegalPage
      title="Terms of Service"
      lead="The straightforward terms that govern working with Switchboard AI Systems and using this website."
      summary={
        <>
          <b className="text-ink">The short version:</b> I build what we agree to, you pay as scoped,
          you own the working system, and neither of us is on the hook for things outside our control.
          The detail is below.
        </>
      }
      disclaimer="These terms are provided as a clear starting point and should be reviewed by qualified legal counsel before being relied upon for your specific situation."
      sections={[
        {
          id: "accept",
          heading: "1 · Acceptance",
          body: (
            <p className={legalP}>
              By using this website or engaging Switchboard AI Systems for a project, you agree to
              these terms. If you&apos;re agreeing on behalf of a company, you confirm you&apos;re
              authorised to do so. If you don&apos;t agree, please don&apos;t use the service.
            </p>
          ),
        },
        {
          id: "services",
          heading: "2 · The services",
          body: (
            <p className={legalP}>
              Switchboard AI Systems provides automation engineering, workflow architecture and AI
              chatbot development. The exact deliverables, timeline and price for any engagement are
              defined in a written proposal or scope agreed between us before work begins. That scope,
              together with these terms, forms our agreement.
            </p>
          ),
        },
        {
          id: "engagements",
          heading: "3 · Engagements & payment",
          body: (
            <>
              <p className="mb-[14px] text-[1.04rem] leading-[1.72] text-ink-body">
                Projects are quoted on a fixed-scope basis, typically across three tiers from $800.
                Unless agreed otherwise:
              </p>
              <LegalBullets
                items={[
                  { icon: checkIcon, children: "A deposit is due before work starts; the balance is due on go-live or per the milestones in your scope." },
                  { icon: checkIcon, children: "Work outside the agreed scope is quoted separately before it begins, no surprise invoices." },
                  { icon: checkIcon, children: "Third-party software, API and hosting costs are billed to and owned by you directly." },
                ]}
              />
            </>
          ),
        },
        {
          id: "ip",
          heading: "4 · Intellectual property",
          body: (
            <p className={legalP}>
              On full payment, you own the custom workflows, configurations and deliverables built for
              you. I retain the right to reuse general know-how, reusable building blocks and
              non-confidential techniques across other projects. Any pre-existing tools or libraries
              remain owned by their respective authors under their own licences.
            </p>
          ),
        },
        {
          id: "client",
          heading: "5 · Your responsibilities",
          body: (
            <p className={legalP}>
              To deliver on time I rely on you to provide timely access to the accounts, data and
              information a project needs, and to ensure you have the right to share them. You&apos;re
              responsible for the lawful use of the systems I build and for the content that flows
              through them once handed over.
            </p>
          ),
        },
        {
          id: "warranty",
          heading: "6 · Warranties & disclaimers",
          body: (
            <p className={legalP}>
              I build with care and stand behind my work, Growth and Custom builds include a defined
              monitoring window during which I fix workflow breakages caused by my build at no charge.
              Beyond that, the service is provided &ldquo;as is.&rdquo; Automations depend on
              third-party platforms I don&apos;t control; if a provider changes its API, pricing or
              availability, that&apos;s outside my warranty, though I&apos;m happy to quote a fix.
            </p>
          ),
        },
        {
          id: "liability",
          heading: "7 · Limitation of liability",
          body: (
            <p className={legalP}>
              To the maximum extent permitted by law, my total liability for any claim arising from an
              engagement is limited to the fees you paid for that engagement. I&apos;m not liable for
              indirect, incidental or consequential losses, including lost profits or data, arising
              from the use or inability to use the systems delivered.
            </p>
          ),
        },
        {
          id: "confidentiality",
          heading: "8 · Confidentiality",
          body: (
            <p className={legalP}>
              Anything you share that&apos;s marked or reasonably understood as confidential stays
              confidential. I won&apos;t disclose your business data, credentials or strategy, and
              I&apos;ll use it only to deliver your project. This survives the end of our engagement.
            </p>
          ),
        },
        {
          id: "law",
          heading: "9 · Governing law",
          body: (
            <p className={legalP}>
              These terms are governed by the laws of Romania, and any disputes will be handled by the
              competent courts of Bucharest, without prejudice to any mandatory consumer protections
              that apply to you.
            </p>
          ),
        },
        {
          id: "changes",
          heading: "10 · Changes",
          body: (
            <p className={legalP}>
              I may update these terms from time to time; the &ldquo;last updated&rdquo; date above
              always reflects the current version. Material changes won&apos;t affect a project already
              underway. Questions? Email {email}.
            </p>
          ),
        },
      ]}
    />
  );
}
