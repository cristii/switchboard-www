import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Analytics } from "@vercel/analytics/react";

import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Switchboard AI Systems",
    template: "%s · Switchboard AI Systems",
  },
  description:
    "AI chatbots and workflow automation (n8n, Trigger.dev) for small teams — by Cristi Șatcovschi.",
};

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
