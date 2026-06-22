// Ready-made templates surfaced in the toolbar's Templates picker.

import type { Diagram } from "../../state/types";
import { mvpSampleDiagram, branchingSampleDiagram } from "../../sampleDiagram";
import { n8nSampleDiagram } from "./n8n";
import { scoutsLeadsDiagram } from "./architecture";
import { awsWebHostingDiagram } from "./aws";

export interface PresetEntry {
  id: string;
  label: string;
  diagram: Diagram;
}

export const PRESETS: PresetEntry[] = [
  { id: "n8n", label: "n8n workflow", diagram: n8nSampleDiagram },
  { id: "architecture", label: "Scouts / Leads system", diagram: scoutsLeadsDiagram },
  { id: "aws", label: "AWS web hosting", diagram: awsWebHostingDiagram },
  { id: "branching", label: "Branching demo", diagram: branchingSampleDiagram },
  { id: "starter", label: "Starter", diagram: mvpSampleDiagram },
];

export { n8nSampleDiagram } from "./n8n";
export { scoutsLeadsDiagram } from "./architecture";
export { awsWebHostingDiagram } from "./aws";
