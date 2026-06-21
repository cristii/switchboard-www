// The full multi-tier "Scouts / Leads" architecture from the brief — the
// showcase for advanced diagrams: multi-channel trigger → command parser →
// fan-out (command flows / AI router / free chat) → unified router → lead
// engine → fan-out flows → a grouped "AI Processing Layer" → database → output
// automations → commission engine → scout dashboard. Exercises branching,
// merging, a group container, labels and a dashed (async) edge.

import type { Diagram } from "../../state/types";

export const scoutsLeadsDiagram: Diagram = {
  version: 1,
  nodes: [
    { id: "scouts", kind: "trigger", label: "Scouts (Users)", sublabel: "Slack / Telegram", x: 0, y: -16 },
    { id: "mct", kind: "trigger", label: "Multi-Channel Trigger", sublabel: "Slack / Telegram bot", x: 0, y: -13 },
    { id: "parser", kind: "action", label: "Command Parser", sublabel: "/help, /update…", x: 0, y: -10 },

    { id: "cflows", kind: "logic", label: "Command Flows", sublabel: "/training, /payments", x: -5.5, y: -7 },
    { id: "router", kind: "ai", label: "AI Intent Router", x: 0, y: -7 },
    { id: "freechat", kind: "action", label: "Free Chat Input", sublabel: "“lead replied”", x: 5.5, y: -7 },

    { id: "uar", kind: "merge", label: "Unified Action Router", x: 0, y: -4 },
    { id: "lhe", kind: "action", label: "Lead Handling Engine", x: 0, y: -1 },

    { id: "newlead", kind: "action", label: "New Lead Flow", sublabel: "/newlead", x: -5.5, y: 2 },
    { id: "update", kind: "action", label: "Lead Update Flow", sublabel: "/update", x: 0, y: 2 },
    { id: "status", kind: "action", label: "Status / Queries", sublabel: "/leads, /status", x: 5.5, y: 2 },

    { id: "ai_layer", kind: "group", label: "AI Processing Layer", x: 0, y: 5.5, width: 9.4, depth: 2.6 },
    { id: "scam", kind: "ai", label: "Scam Detection", x: -3.1, y: 5.5, parentId: "ai_layer" },
    { id: "scoring", kind: "ai", label: "Lead Scoring", x: 0, y: 5.5, parentId: "ai_layer" },
    { id: "structuring", kind: "ai", label: "Response Structuring", x: 3.1, y: 5.5, parentId: "ai_layer" },

    { id: "db", kind: "database", label: "Database", sublabel: "Airtable / Supabase", x: 0, y: 9 },

    { id: "stage", kind: "action", label: "Stage Automation", x: -5.5, y: 12 },
    { id: "email", kind: "output", label: "Email Notifications", x: 0, y: 12 },
    { id: "alerts", kind: "output", label: "Internal Alerts", x: 5.5, y: 12 },

    { id: "commission", kind: "action", label: "Commission Engine", sublabel: "40% on won", x: 0, y: 15 },
    { id: "dashboard", kind: "output", label: "Scout Payment Dashboard", sublabel: "/payments", x: 0, y: 18 },
  ],
  edges: [
    { id: "a1", source: "scouts", target: "mct" },
    { id: "a2", source: "mct", target: "parser" },
    { id: "a3", source: "parser", target: "cflows" },
    { id: "a4", source: "parser", target: "router", label: "intent" },
    { id: "a5", source: "parser", target: "freechat" },
    { id: "a6", source: "cflows", target: "uar" },
    { id: "a7", source: "router", target: "uar" },
    { id: "a8", source: "freechat", target: "uar" },
    { id: "a9", source: "uar", target: "lhe" },
    { id: "a10", source: "lhe", target: "newlead" },
    { id: "a11", source: "lhe", target: "update" },
    { id: "a12", source: "lhe", target: "status" },
    { id: "a13", source: "newlead", target: "scam" },
    { id: "a14", source: "update", target: "scoring" },
    { id: "a15", source: "status", target: "structuring" },
    { id: "a16", source: "scam", target: "db" },
    { id: "a17", source: "scoring", target: "db" },
    { id: "a18", source: "structuring", target: "db" },
    { id: "a19", source: "db", target: "stage" },
    { id: "a20", source: "db", target: "email" },
    { id: "a21", source: "db", target: "alerts", label: "hot leads", style: "dashed" },
    { id: "a22", source: "stage", target: "commission" },
    { id: "a23", source: "email", target: "commission" },
    { id: "a24", source: "alerts", target: "commission" },
    { id: "a25", source: "commission", target: "dashboard" },
  ],
};
