// Connector registry: maps a ConnectorStyle to its renderer. OrthogonalEdge
// resolves the component by edge.connector ?? theme.connector.

import type { ComponentType } from "react";
import type { ConnectorStyle } from "../../../state/types";
import type { ConnectorProps } from "./types";
import { LineConnector } from "./LineConnector";
import { TubeConnector } from "./TubeConnector";
import { RibbonArrowConnector } from "./RibbonArrowConnector";
import { BoldArrow } from "./BoldArrow";
import { CornerConnect } from "./CornerConnect";

export const CONNECTORS: Record<ConnectorStyle, ComponentType<ConnectorProps>> = {
  line: LineConnector,
  tube: TubeConnector,
  ribbonArrow: RibbonArrowConnector,
  boldArrow: BoldArrow,
  cornerConnect: CornerConnect,
};

export type { ConnectorProps } from "./types";
