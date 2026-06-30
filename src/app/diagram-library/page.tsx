import type { Metadata } from "next";
import { Eyebrow, Section } from "@/components/ui";
import { DiagramLibraryGallery } from "@/components/sections/DiagramLibrary";
import { diagramTemplates, nodeComponents } from "@/lib/diagramLibrary";

// Editor-scoped tokens so --editor-* resolve for the embedded previews.
import "../../components/editor/theme/editor-tokens.css";

export const metadata: Metadata = {
  title: "Diagram Library",
  description:
    "A browsable library of isometric diagram components and templates — like a component library, but for workflow and architecture diagrams. Right-click any one to open it in the editor or copy its JSON.",
};

const heading = "font-display font-extrabold tracking-tight";

export default function DiagramLibraryPage() {
  return (
    <>
      <Section id="top" py="48px" width="1240px">
        <Eyebrow>Resources</Eyebrow>
        <h1 className={`${heading} mt-3 max-w-[15em] text-h2 text-ink`}>The diagram library.</h1>
        <p className="mt-4 max-w-[46em] text-lead text-ink-soft">
          A component library, but for diagrams. Browse ready-made isometric{" "}
          <strong className="text-ink">templates</strong> and the individual{" "}
          <strong className="text-ink">node components</strong> they&apos;re built from. Right-click
          (or long-press on mobile) any card to open it in the editor, copy its JSON, grab a PNG, or
          copy an embed snippet.
        </p>
      </Section>

      <Section id="templates" py="8px" width="1240px">
        <h2 className={`${heading} mb-1 text-[clamp(1.5rem,2.6vw,2rem)]`}>Templates</h2>
        <p className="mb-6 max-w-[44em] text-base text-ink-soft">
          Polished, ready-to-use diagrams. Open one in the editor, tweak it, then copy the JSON.
        </p>
        <DiagramLibraryGallery items={diagramTemplates} />
      </Section>

      <Section id="nodes" py="40px" width="1240px">
        <h2 className={`${heading} mb-1 text-[clamp(1.5rem,2.6vw,2rem)]`}>Node components</h2>
        <p className="mb-6 max-w-[44em] text-base text-ink-soft">
          The building blocks — platforms, node cards, devices, labels and connectors.
        </p>
        <DiagramLibraryGallery items={nodeComponents} />
      </Section>
    </>
  );
}
