import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Menu } from "./Menu";
import { Tabs } from "./Tabs";
import { Toast, useToast } from "./Toast";
import { Button } from "./Button";

// Interaction primitives added for the diagram library / preview surfaces:
// an accessible anchored Menu, pill Tabs (tablist semantics), and an
// aria-live Toast. Grouped in one story module.

const meta: Meta = { title: "UI/Interaction primitives" };
export default meta;

export const AnchoredMenu: StoryObj = {
  render: function Story() {
    const [open, setOpen] = React.useState(false);
    const [at, setAt] = React.useState({ x: 120, y: 120 });
    const [last, setLast] = React.useState("—");
    return (
      <div style={{ padding: 48 }}>
        <Button
          onClick={(e: React.MouseEvent<HTMLElement>) => {
            const r = (e.currentTarget as HTMLElement).getBoundingClientRect();
            setAt({ x: r.left, y: r.bottom + 6 });
            setOpen(true);
          }}
        >
          Open menu
        </Button>
        <p style={{ marginTop: 12, fontSize: ".85rem" }}>Last action: {last}</p>
        <Menu
          open={open}
          x={at.x}
          y={at.y}
          label="Card actions"
          actions={[
            { id: "edit", label: "Open in editor" },
            { id: "json", label: "Copy JSON" },
            { id: "png", label: "Copy PNG", disabled: true },
            { id: "delete", label: "Delete", dividerBefore: true },
          ]}
          onAction={setLast}
          onClose={() => setOpen(false)}
        />
      </div>
    );
  },
};

export const PillTabs: StoryObj = {
  render: function Story() {
    const [active, setActive] = React.useState("preview");
    return (
      <div style={{ padding: 32 }}>
        <Tabs
          tabs={[
            { id: "preview", label: "Preview" },
            { id: "json", label: "JSON editor" },
          ]}
          active={active}
          onChange={setActive}
          label="Playground views"
          idBase="story"
        />
        <div
          role="tabpanel"
          id={`story-panel-${active}`}
          aria-labelledby={`story-tab-${active}`}
          style={{ marginTop: 16, fontSize: ".9rem" }}
        >
          Active panel: {active}
        </div>
      </div>
    );
  },
};

export const LiveToast: StoryObj = {
  render: function Story() {
    const toast = useToast();
    return (
      <div style={{ padding: 32 }}>
        <Button onClick={() => toast.show("JSON copied")}>Show toast</Button>
        <Toast message={toast.message} />
      </div>
    );
  },
};
