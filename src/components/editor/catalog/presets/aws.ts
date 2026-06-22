// "Web Application Hosting" — the showcase for the `aws` theme (pair this diagram
// with defaultThemeId="aws" / config.theme="aws"). Demonstrates the new Step 2
// features: 3D in-canvas text (billboard title + a flat "VPC" ground label), a
// 3D edge label (uprightZ), a translucent orange group platform ("availability
// zone"), blue data stores via per-node colour, grey secondary links via per-edge
// colour, and thick orange primary flow from the theme. See docs/themes.

import type { Diagram } from "../../state/types";

export const awsWebHostingDiagram: Diagram = {
  version: 1,
  nodes: [
    { id: "title", kind: "text", label: "Web Application Hosting", x: 0, y: -7.5, color: "#3b3f46", meta: { orientation: "billboard", size: 0.72 } },
    { id: "users", kind: "trigger", label: "Users", x: 0, y: -4.8, color: "#ea7600" },
    { id: "dns", kind: "integration", label: "Route 53", sublabel: "DNS", x: 0, y: -2.4, color: "#ea7600" },
    { id: "lb", kind: "service", label: "Load Balancer", x: 0, y: 0 },

    { id: "az", kind: "group", label: "Availability Zone", x: 0, y: 3.4, width: 9, depth: 4, color: "#ea7600" },
    { id: "web", kind: "service", label: "Web Tier", x: -2.6, y: 2.6, parentId: "az" },
    { id: "app", kind: "service", label: "App Tier", x: -2.6, y: 4.4, parentId: "az" },
    { id: "rds", kind: "database", label: "RDS", sublabel: "Primary", x: 2.6, y: 2.6, parentId: "az", color: "#3b82f6" },
    { id: "cache", kind: "database", label: "Cache", sublabel: "Read replica", x: 2.6, y: 4.4, parentId: "az", color: "#3b82f6" },

    { id: "s3", kind: "queue", label: "S3 Assets", x: 0, y: 7.6 },
    { id: "vpc", kind: "text", label: "VPC", x: -5.4, y: 3.4, color: "#9aa0a6", meta: { orientation: "ground", size: 0.6 } },
  ],
  edges: [
    { id: "a1", source: "users", target: "dns", flow: "normal" },
    { id: "a2", source: "dns", target: "lb", flow: "normal" },
    { id: "a3", source: "lb", target: "web", flow: "normal" },
    { id: "a4", source: "web", target: "app" },
    { id: "a5", source: "app", target: "rds", color: "#9aa0a6" },
    { id: "a6", source: "app", target: "cache", color: "#9aa0a6" },
    { id: "a7", source: "app", target: "s3", label: "store", labelOrientation: "uprightZ" },
  ],
};
