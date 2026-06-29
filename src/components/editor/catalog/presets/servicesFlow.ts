// The /services "systematic approach" workflow as an isometric scene:
//   New lead (input) → AI classification (processing) → CRM + Calendar (output).
// Laid out so the stages read as a SCREEN-HORIZONTAL row while staying in true
// isometric: in the (1,1,1) iso view a ground vector is horizontal on screen when
// worldX + worldZ = const, i.e. along diagram coords (t, −t). The two outputs sit
// at the same screen-x (so they're side-by-side with the row) and are offset along
// (1,1) to stack vertically on screen. Pair with the `blueprint` theme.
// Also surfaced as the "Service flow (clean)" template — a tidy, well-typeset
// example. See src/components/sections/SystematicApproachPreview.tsx.

import type { Diagram } from "../../state/types";

export const servicesFlowDiagram: Diagram = {
  version: 1,
  nodes: [
    { id: "lead", kind: "trigger", label: "New lead", sublabel: "form · call · DM", x: 4, y: -4, color: "#b45309" },
    { id: "ai", kind: "ai", label: "AI classification", sublabel: "intent + priority", x: 1, y: -1, color: "#6a4a8a" },
    { id: "crm", kind: "output", label: "CRM", x: -1.2, y: 3.6, color: "#3f7a4e" },
    { id: "cal", kind: "output", label: "Calendar", x: -3.6, y: 1.2, color: "#3f7a4e" },
  ],
  edges: [
    { id: "s1", source: "lead", target: "ai", connector: "boldArrow", routing: "direct", flow: "normal" },
    { id: "s2", source: "ai", target: "crm", connector: "boldArrow", routing: "direct" },
    { id: "s3", source: "ai", target: "cal", connector: "boldArrow", routing: "direct" },
  ],
};
