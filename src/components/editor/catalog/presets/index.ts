// Ready-made templates surfaced in the toolbar's Templates picker.

import type { Diagram } from "../../state/types";
import { mvpSampleDiagram, branchingSampleDiagram } from "../../sampleDiagram";
import { n8nSampleDiagram } from "./n8n";
import { scoutsLeadsDiagram } from "./architecture";
import { awsWebHostingDiagram } from "./aws";
import { servicesFlowDiagram } from "./servicesFlow";
import { architectureDeviceDiagram } from "./architectureDevices";

export interface PresetEntry {
  id: string;
  label: string;
  diagram: Diagram;
}

// New, well-typeset examples first; the earlier templates are kept as "(old)".
export const PRESETS: PresetEntry[] = [
  { id: "service-flow", label: "Service flow (clean)", diagram: servicesFlowDiagram },
  { id: "architecture-devices", label: "Architecture (devices)", diagram: architectureDeviceDiagram },
  { id: "n8n", label: "n8n workflow (old)", diagram: n8nSampleDiagram },
  { id: "architecture", label: "Scouts / Leads system (old)", diagram: scoutsLeadsDiagram },
  { id: "aws", label: "AWS web hosting (old)", diagram: awsWebHostingDiagram },
  { id: "branching", label: "Branching demo (old)", diagram: branchingSampleDiagram },
  { id: "starter", label: "Starter (old)", diagram: mvpSampleDiagram },
];

export { n8nSampleDiagram } from "./n8n";
export { scoutsLeadsDiagram } from "./architecture";
export { awsWebHostingDiagram } from "./aws";
export { servicesFlowDiagram } from "./servicesFlow";
export { architectureDeviceDiagram } from "./architectureDevices";
export {
  buildPillarDiagram,
  opsPillarDiagram,
  leadRoutingPillarDiagram,
  backOfficePillarDiagram,
  customerExpPillarDiagram,
} from "./pillarFlow";
export type { PillarStage } from "./pillarFlow";
export {
  buildProcessFlow,
  buildProcessNode,
  processFlowDiagram,
  processStepDiagrams,
} from "./processFlow";
