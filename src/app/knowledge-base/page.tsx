import type { Metadata } from "next";

import { KnowledgeBase } from "@/components/sections/KnowledgeBase";

export const metadata: Metadata = {
  title: "Knowledge Base",
  description:
    "Production patterns, engine references and copy-paste blueprints for n8n, Trigger.dev and AI workflows, the engineering docs behind every system Switchboard ships.",
};

export default function KnowledgeBasePage() {
  return <KnowledgeBase />;
}
