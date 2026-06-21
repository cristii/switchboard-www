import type { Metadata } from "next";

import { LegalPage, LegalLink, LegalBullets, legalP } from "@/components/sections/LegalPage";
import { socialLinks } from "@/lib/nav";

import mailIcon from "@/assets/icons/mail.svg";
import workflowIcon from "@/assets/icons/workflow.svg";
import chartIcon from "@/assets/icons/chart.svg";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "How Switchboard AI Systems collects, uses and protects your information, in plain language. GDPR data controller details, your rights, and contact.",
};

const email = <LegalLink href={socialLinks.email}>cristi.satcovschi@gmail.com</LegalLink>;

export default function PrivacyPage() {
  return (
    <LegalPage
      title="Privacy Policy"
      lead="How Switchboard AI Systems collects, uses and protects your information, in plain language, the same way I build everything else."
      summary={
        <>
          <b className="text-ink">Plain-English summary:</b> I collect only what I need to reply to
          you and deliver projects, I never sell your data, and you can ask me to delete it at any
          time. The detail is below.
        </>
      }
      disclaimer="This policy is provided as a clear starting point and should be reviewed by qualified legal counsel before being relied upon for your specific situation."
      sections={[
        {
          id: "who",
          heading: "Who I am",
          body: (
            <p className={legalP}>
              Switchboard AI Systems is the independent automation and AI practice of Cristi
              Șatcovschi, based in Bucharest, Romania. For the purposes of the EU General Data
              Protection Regulation (GDPR), I am the data controller for the information described
              here. You can reach me any time at {email}.
            </p>
          ),
        },
        {
          id: "collect",
          heading: "What I collect",
          body: (
            <>
              <p className="mb-[14px] text-[1.04rem] leading-[1.72] text-ink-body">
                I only collect information you choose to share or that is needed to run a project:
              </p>
              <LegalBullets
                items={[
                  {
                    icon: mailIcon,
                    color: "var(--orange)",
                    children: (
                      <>
                        <b className="text-ink">Contact details</b>, your name, email and anything
                        you write in the contact form or chat agent.
                      </>
                    ),
                  },
                  {
                    icon: workflowIcon,
                    color: "var(--orange)",
                    children: (
                      <>
                        <b className="text-ink">Project information</b>, the tools, processes and
                        access details you provide so I can build and connect your automations.
                      </>
                    ),
                  },
                  {
                    icon: chartIcon,
                    color: "var(--orange)",
                    children: (
                      <>
                        <b className="text-ink">Basic usage data</b>, anonymous analytics about how
                        this site is used, to keep it fast and working.
                      </>
                    ),
                  },
                ]}
              />
            </>
          ),
        },
        {
          id: "use",
          heading: "How I use it",
          body: (
            <>
              <p className={legalP}>
                Your information is used to respond to enquiries, scope and deliver projects, send
                invoices, and provide support. I do not sell, rent or trade your personal data, and I
                never use client data to train public AI models.
              </p>
              <p className={legalP}>
                When you talk to the AI intake agent, your messages are processed to draft a project
                scope and help me reply faster, nothing more.
              </p>
            </>
          ),
        },
        {
          id: "basis",
          heading: "Legal basis (GDPR)",
          body: (
            <p className={legalP}>
              I process your data under one of three lawful bases: your{" "}
              <b className="text-ink">consent</b> (when you contact me), the{" "}
              <b className="text-ink">performance of a contract</b> (when we work together on a
              project), and my <b className="text-ink">legitimate interest</b> in running and
              improving this service. Where consent is the basis, you can withdraw it at any time.
            </p>
          ),
        },
        {
          id: "tools",
          heading: "Third-party tools",
          body: (
            <>
              <p className="mb-[14px] text-[1.04rem] leading-[1.72] text-ink-body">
                Automation work means connecting trusted platforms. Depending on your project, your
                data may be processed by services such as n8n, Trigger.dev, OpenAI, Google Workspace
                and your own CRM or payment providers. Each acts as a processor under its own privacy
                terms, and I only connect the ones a project actually requires.
              </p>
              <p className={legalP}>
                Some processors may store data outside the EU; where that happens, I rely on their
                standard contractual clauses and equivalent safeguards.
              </p>
            </>
          ),
        },
        {
          id: "cookies",
          heading: "Cookies",
          body: (
            <p className={legalP}>
              This site uses only essential cookies and privacy-friendly analytics. I don&apos;t run
              advertising trackers or sell your browsing behaviour. You can block cookies in your
              browser without breaking the core of the site.
            </p>
          ),
        },
        {
          id: "retention",
          heading: "Data retention",
          body: (
            <p className={legalP}>
              I keep enquiry data only as long as needed to follow up, and project data for the
              duration of our engagement plus any period required for invoicing and legal
              obligations. After that, it&apos;s deleted or anonymised.
            </p>
          ),
        },
        {
          id: "rights",
          heading: "Your rights",
          body: (
            <p className={legalP}>
              Under GDPR you can ask to access, correct, export or delete your personal data, restrict
              or object to processing, and withdraw consent. To exercise any of these, just email me,
              no forms, no friction. You also have the right to complain to your local data protection
              authority.
            </p>
          ),
        },
        {
          id: "contact",
          heading: "Contact",
          body: (
            <p className={legalP}>
              Questions about privacy, or want your data removed? Email {email} or message{" "}
              <LegalLink href={socialLinks.telegram} external>
                @cristi_42
              </LegalLink>{" "}
              on Telegram.
            </p>
          ),
        },
      ]}
    />
  );
}
