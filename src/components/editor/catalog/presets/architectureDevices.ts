// "Architecture (devices)" — the case-1/2 reference look in Switchboard colors:
// device nodes (browser / phone / monitor / laptop) around a server stack on a
// soft round platform ("zone"), connected by dashed corner-connect links, plus
// two bubble-tag arrows (a bubble label riding a bold arrow). Pair with the
// `blueprint` theme. Showcases Phase 6: device shapes, the disc platform, and
// bubble-tag arrows. See docs/IMPLEMENTATION_PLAN.md Phase 6.

import type { Diagram } from "../../state/types";

export const architectureDeviceDiagram: Diagram = {
  version: 1,
  nodes: [
    { id: "zone", kind: "group", label: "Core", x: 0, y: 0, width: 4.6, depth: 4.6, color: "#b45309", meta: { platform: "disc" } },
    { id: "db", kind: "serverStack", label: "Database", x: 0, y: 0, parentId: "zone" },
    { id: "web", kind: "browser", label: "Web app", x: -5.6, y: -3.2 },
    { id: "mob", kind: "phone", label: "Mobile", x: 5.6, y: -3.2 },
    { id: "dash", kind: "monitor", label: "Dashboard", x: -5.6, y: 3.2 },
    { id: "admin", kind: "laptop", label: "Admin", x: 5.6, y: 3.2 },
  ],
  edges: [
    { id: "a1", source: "web", target: "db", connector: "cornerConnect", routing: "orthogonal", style: "dashed" },
    { id: "a2", source: "mob", target: "db", connector: "cornerConnect", routing: "orthogonal", style: "dashed" },
    { id: "a3", source: "db", target: "dash", connector: "boldArrow", routing: "direct", label: "Transfer", meta: { labelStyle: "bubble" } },
    { id: "a4", source: "db", target: "admin", connector: "boldArrow", routing: "direct", label: "AI model", meta: { labelStyle: "bubble" } },
  ],
};
