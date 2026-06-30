// Data for /diagram-library — a browsable library of node "components" and diagram
// "templates", shadcn/Tailwind-Pro style. Each item is a PreviewDoc ({ config,
// diagram }) so it renders in DiagramPreview, copies as JSON, opens in the editor,
// and embeds elsewhere. Three-free (imported by the Server page): the presets are
// plain data and `config.theme` is a built-in theme id string.

import type { Diagram } from "@/components/editor/state/types";
import type { PreviewDoc } from "@/components/editor/preview/previewConfig";
import {
  servicesFlowDiagram,
  scoutsLeadsDiagram,
  awsWebHostingDiagram,
  n8nSampleDiagram,
  architectureDeviceDiagram,
  opsPillarDiagram,
  processFlowDiagram,
  aboutFlowDiagram,
  scoutFlowDiagram,
} from "@/components/editor/catalog/presets";

export interface LibraryItem {
  id: string;
  title: string;
  blurb: string;
  doc: PreviewDoc;
}

function doc(diagram: Diagram, theme: string): PreviewDoc {
  return {
    config: { theme, showGrid: true, showGround: true, showLabels: true, cameraMovable: true },
    diagram,
  };
}

const D = (nodes: Diagram["nodes"], edges: Diagram["edges"] = []): Diagram => ({ version: 1, nodes, edges });

/* ---------------- Templates (ready-made diagrams) ---------------- */

export const diagramTemplates: LibraryItem[] = [
  { id: "scout-n8n", title: "Referral scout chatbot (n8n)", blurb: "A full n8n workflow as textured node cards on grouped colour trays.", doc: doc(scoutFlowDiagram, "signal") },
  { id: "ops-pillar", title: "Capability pillar", blurb: "Input → processing → output, stacked slabs with tags and info cards.", doc: doc(opsPillarDiagram, "signal") },
  { id: "process-flow", title: "Process workflow", blurb: "A horizontal flow of dual-slab steps with floating bubble tags.", doc: doc(processFlowDiagram, "signal") },
  { id: "about-flow", title: "How-it-works flow", blurb: "Steps with a title tag above and a description card below each node.", doc: doc(aboutFlowDiagram, "signal") },
  { id: "services-flow", title: "Lead → AI → CRM flow", blurb: "A compact left-to-right automation flow on the blueprint theme.", doc: doc(servicesFlowDiagram, "blueprint") },
  { id: "aws-hosting", title: "AWS web hosting", blurb: "An AWS-style architecture: edge, compute, data and storage tiers.", doc: doc(awsWebHostingDiagram, "aws") },
  { id: "architecture-devices", title: "Device architecture", blurb: "Clients, services and datastores as 3D device models.", doc: doc(architectureDeviceDiagram, "blueprint") },
  { id: "n8n-sample", title: "n8n workflow (classic)", blurb: "A branching trigger → logic → action → output workflow.", doc: doc(n8nSampleDiagram, "dark") },
  { id: "scouts-leads", title: "Scouts & leads system", blurb: "A referral/lead pipeline architecture across layers.", doc: doc(scoutsLeadsDiagram, "blueprint") },
];

/* ---------------- Node components (single primitives) ---------------- */

export const nodeComponents: LibraryItem[] = [
  {
    id: "slab-platform",
    title: "Slab platform",
    blurb: 'group · meta.platform "slab" — double-layer rounded square.',
    doc: doc(D([{ id: "g", kind: "group", label: "", x: 0, y: 0, width: 5, depth: 5, height: 0.6, color: "#7a4ad4", meta: { platform: "slab" } }]), "signal"),
  },
  {
    id: "hex-platform",
    title: "Hex platform",
    blurb: 'group · meta.platform "hex" — double-layer rounded hexagon.',
    doc: doc(D([{ id: "g", kind: "group", label: "", x: 0, y: 0, width: 5, depth: 5, height: 0.7, color: "#2bac61", meta: { platform: "hex" } }]), "signal"),
  },
  {
    id: "node-card",
    title: "n8n node card + base tray",
    blurb: 'nodeCard (2D icon texture on a white slab) on a resizable colour "base".',
    doc: doc(
      D([
        { id: "b", kind: "group", label: "", x: 0, y: 0, width: 6.2, depth: 3.4, height: 0.4, color: "#b45309", meta: { platform: "base" } },
        { id: "c1", kind: "nodeCard", label: "", x: -1.4, y: 0, width: 2, depth: 2, height: 0.5, color: "#b45309", parentId: "b", meta: { icon: "webhook", elevation: 0.8 } },
        { id: "c2", kind: "nodeCard", label: "", x: 1.4, y: 0, width: 2, depth: 2, height: 0.5, color: "#b45309", parentId: "b", meta: { icon: "bot", elevation: 0.8 } },
      ]),
      "signal",
    ),
  },
  {
    id: "step-icon",
    title: "3D step icon",
    blurb: 'icon · meta.icon (gear / bars / check / spark / …) — a procedural 3D glyph.',
    doc: doc(D([{ id: "i", kind: "icon", label: "", x: 0, y: 0, width: 2.6, depth: 2.6, height: 2, color: "#e8801f", meta: { icon: "gear" } }]), "signal"),
  },
  {
    id: "database",
    title: "Database",
    blurb: "database — a cylinder datastore (Supabase / Airtable / Postgres).",
    doc: doc(D([{ id: "d", kind: "database", label: "Database", x: 0, y: 0 }]), "signal"),
  },
  {
    id: "device-monitor",
    title: "Device · monitor",
    blurb: "monitor — a dashboard / desktop screen model.",
    doc: doc(D([{ id: "m", kind: "monitor", label: "Dashboard", x: 0, y: 0 }]), "signal"),
  },
  {
    id: "device-server",
    title: "Device · server stack",
    blurb: "serverStack — a stacked server / datastore model.",
    doc: doc(D([{ id: "s", kind: "serverStack", label: "Servers", x: 0, y: 0 }]), "signal"),
  },
  {
    id: "tag-bubble",
    title: "Bubble tag",
    blurb: 'text · labelStyle "bubble" — a rounded pill label.',
    doc: doc(D([{ id: "t", kind: "text", label: "Bubble tag", x: 0, y: 0, meta: { labelStyle: "bubble", orientation: "billboard", size: 0.8, bold: true } }]), "signal"),
  },
  {
    id: "tag-tips",
    title: "Tips callout",
    blurb: 'text · labelStyle "tips" — a dark callout with a pointer.',
    doc: doc(D([{ id: "t", kind: "text", label: "Tips callout", x: 0, y: 0, meta: { labelStyle: "tips", orientation: "billboard", size: 0.8 } }]), "signal"),
  },
  {
    id: "tag-info",
    title: "Info card",
    blurb: 'text · labelStyle "info" — a card with a title + body.',
    doc: doc(D([{ id: "t", kind: "text", label: "Info card", sublabel: "Title plus a short\nbody of detail.", x: 0, y: 0, meta: { labelStyle: "info", orientation: "billboard", size: 0.7, sublabelSize: 0.48 } }]), "signal"),
  },
  {
    id: "connector-bold",
    title: "Bold arrow connector",
    blurb: "edge · connector boldArrow — a thick directional flow link.",
    doc: doc(
      D(
        [
          { id: "a", kind: "action", label: "A", x: -2.2, y: 0 },
          { id: "b", kind: "action", label: "B", x: 2.2, y: 0 },
        ],
        [{ id: "e", source: "a", target: "b", connector: "boldArrow", routing: "direct", flow: "normal" }],
      ),
      "blueprint",
    ),
  },
  {
    id: "connector-corner",
    title: "Corner-connect link",
    blurb: "edge · connector cornerConnect — a dashed bracketed link.",
    doc: doc(
      D(
        [
          { id: "a", kind: "action", label: "A", x: -2.2, y: -1 },
          { id: "b", kind: "action", label: "B", x: 2.2, y: 1 },
        ],
        [{ id: "e", source: "a", target: "b", connector: "cornerConnect", routing: "orthogonal", style: "dashed" }],
      ),
      "blueprint",
    ),
  },
];
