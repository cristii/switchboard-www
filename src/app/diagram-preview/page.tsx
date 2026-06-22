import type { Metadata } from "next";
import { Eyebrow, Section } from "@/components/ui";
import { PreviewPlayground } from "./PreviewPlayground";

// Editor-scoped tokens so --editor-* resolve for the embedded preview.
import "../../components/editor/theme/editor-tokens.css";

export const metadata: Metadata = {
  title: "Diagram Preview Playground (WIP)",
  description:
    "Author isometric workflow / architecture diagrams and preview them live — tweak appearance and camera.",
  robots: { index: false, follow: false },
};

const heading = "font-display font-extrabold tracking-tight";

export default function DiagramPreviewPage() {
  return (
    <>
      <Section id="top" py="40px" width="1240px">
        <Eyebrow>Resources · WIP</Eyebrow>
        <h1 className={`${heading} mt-3 max-w-[16em] text-h2 text-ink`}>Diagram preview playground</h1>
        <p className="mt-3 max-w-[44em] text-base text-ink-soft">
          Edit the diagram JSON (or the appearance toggles) on the left and watch the read-only preview
          update live. The same preview embeds across the site — Work, About, the home page — to showcase
          workflows, AI chatbots and system architectures.
        </p>
      </Section>
      <Section id="play" py="8px" width="1240px">
        <PreviewPlayground />
      </Section>
    </>
  );
}
