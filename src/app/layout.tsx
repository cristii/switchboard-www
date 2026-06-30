import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Analytics } from "@vercel/analytics/react";

import { SiteChrome } from "@/components/sections/SiteChrome";

import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
const description =
  "AI chatbots and workflow automation (n8n, Trigger.dev) for small teams, built, connected and maintained from Bucharest by Cristi Șatcovschi.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Switchboard AI Systems, AI chatbots & workflow automation",
    template: "%s · Switchboard AI Systems",
  },
  description,
  applicationName: "Switchboard AI Systems",
  authors: [{ name: "Cristi Șatcovschi" }],
  creator: "Cristi Șatcovschi",
  keywords: [
    "AI chatbots",
    "workflow automation",
    "n8n",
    "Trigger.dev",
    "lead generation",
    "Switchboard AI Systems",
  ],
  openGraph: {
    type: "website",
    siteName: "Switchboard AI Systems",
    title: "Switchboard AI Systems, AI chatbots & workflow automation",
    description,
    locale: "en",
    url: "/",
  },
  twitter: {
    card: "summary",
    title: "Switchboard AI Systems",
    description,
  },
  robots: { index: true, follow: true },
};

// Runs before first paint (in <head>, blocking) so the page never flashes the
// wrong theme. Reads the saved preference ("light"/"dark"); with none, follows
// the OS via prefers-color-scheme. Mirrors the key used by src/lib/useTheme.ts.
const themeBootstrap = `(function(){try{var t=localStorage.getItem("sb-theme");if(t!=="light"&&t!=="dark"){t=matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light";}document.documentElement.dataset.theme=t;}catch(e){document.documentElement.dataset.theme="light";}})();`;

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeBootstrap }} />
        {/* Browser UI colour; kept in sync with the active theme by useTheme. */}
        <meta name="theme-color" content="#E9E8DF" />
      </head>
      <body>
        <SiteChrome>{children}</SiteChrome>
        <Analytics />
      </body>
    </html>
  );
}
