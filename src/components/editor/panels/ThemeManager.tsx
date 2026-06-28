"use client";

// Theme manager pane: edits the active ThemeSpec live — background, grid, multiple
// coloured lights (+positions), camera (ortho/perspective + FOV/zoom/direction),
// shadows, node materials (incl. transparency), connector width/colour, and 3D
// text defaults. Create / duplicate / rename / reset / delete; import + export
// JSON (paste a generated theme, or copy one to commit to theme/themes/). Editor-
// token styled + Tailwind-free. See docs/themes/CREATING_THEMES.md.

import * as React from "react";
import { Field } from "../primitives/Field";
import { Select } from "../primitives/Select";
import { NodeGlyph } from "../icons/NodeGlyph";
import type { ThemeManagerApi } from "../theme/useThemeManager";
import type { LightSpec, ThemeSpec } from "../theme/themeSpec";
import type { NodeColorRole } from "../state/types";

const heading: React.CSSProperties = {
  fontFamily: "var(--font-display, sans-serif)",
  fontWeight: 700,
  fontSize: "0.7rem",
  textTransform: "uppercase",
  letterSpacing: "0.1em",
  color: "var(--editor-text-muted)",
  margin: 0,
};

const sectionLabel: React.CSSProperties = {
  fontFamily: "var(--font-display, sans-serif)",
  fontWeight: 700,
  fontSize: "0.58rem",
  textTransform: "uppercase",
  letterSpacing: "0.1em",
  color: "var(--editor-text-muted)",
  margin: "0 0 8px",
};

const rowLabel: React.CSSProperties = {
  fontFamily: "var(--font-body, sans-serif)",
  fontSize: "0.74rem",
  color: "var(--editor-text)",
};

const btn: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  gap: 5,
  padding: "6px 9px",
  borderRadius: 8,
  border: "1.5px solid var(--editor-border-soft)",
  background: "var(--editor-surface-2)",
  color: "var(--editor-text)",
  fontFamily: "var(--font-display, sans-serif)",
  fontWeight: 700,
  fontSize: "0.68rem",
  textTransform: "uppercase",
  letterSpacing: "0.04em",
  cursor: "pointer",
};

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ borderTop: "1.5px solid var(--editor-border-soft)", padding: "12px 0" }}>
      <div style={sectionLabel}>{title}</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>{children}</div>
    </div>
  );
}

function ColorRow({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <label style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
      <span style={rowLabel}>{label}</span>
      <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
        <span style={{ fontFamily: "var(--font-mono, monospace)", fontSize: "0.66rem", color: "var(--editor-text-muted)" }}>
          {value}
        </span>
        <input
          type="color"
          value={/^#[0-9a-fA-F]{6}$/.test(value) ? value : "#000000"}
          onChange={(e) => onChange(e.currentTarget.value)}
          style={{ width: 28, height: 22, padding: 0, border: "1.5px solid var(--editor-border-soft)", borderRadius: 6, background: "none", cursor: "pointer" }}
          aria-label={label}
        />
      </span>
    </label>
  );
}

function RangeRow({
  label,
  value,
  min,
  max,
  step,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (v: number) => void;
}) {
  return (
    <label style={{ display: "block" }}>
      <span style={{ display: "flex", justifyContent: "space-between", ...rowLabel }}>
        <span>{label}</span>
        <span style={{ fontFamily: "var(--font-mono, monospace)", fontSize: "0.66rem", color: "var(--editor-text-muted)" }}>
          {Number.isInteger(value) ? value : value.toFixed(2)}
        </span>
      </span>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.currentTarget.value))}
        style={{ width: "100%", accentColor: "var(--editor-accent)" }}
      />
    </label>
  );
}

function CheckRow({ label, value, onChange }: { label: string; value: boolean; onChange: (v: boolean) => void }) {
  return (
    <label style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8, cursor: "pointer" }}>
      <span style={rowLabel}>{label}</span>
      <input type="checkbox" checked={value} onChange={(e) => onChange(e.currentTarget.checked)} style={{ accentColor: "var(--editor-accent)" }} />
    </label>
  );
}

function Vec3Row({ label, value, onChange }: { label: string; value: [number, number, number]; onChange: (v: [number, number, number]) => void }) {
  const cell: React.CSSProperties = {
    width: "100%",
    boxSizing: "border-box",
    padding: "4px 6px",
    borderRadius: 6,
    border: "1.5px solid var(--editor-border-soft)",
    background: "var(--editor-surface-2)",
    color: "var(--editor-text)",
    fontFamily: "var(--font-mono, monospace)",
    fontSize: "0.72rem",
  };
  return (
    <div>
      <div style={{ ...rowLabel, marginBottom: 4 }}>{label}</div>
      <div style={{ display: "flex", gap: 6 }}>
        {([0, 1, 2] as const).map((i) => (
          <input
            key={i}
            type="number"
            step={0.5}
            defaultValue={value[i]}
            onBlur={(e) => {
              const next = [...value] as [number, number, number];
              next[i] = Number(e.currentTarget.value);
              onChange(next);
            }}
            style={cell}
            aria-label={`${label} ${"xyz"[i]}`}
          />
        ))}
      </div>
    </div>
  );
}

const COLOR_ROLES: NodeColorRole[] = ["orange", "green", "violet", "amber", "ink"];

function newLight(type: LightSpec["type"], id: string): LightSpec {
  switch (type) {
    case "ambient":
      return { id, type, color: "#ffffff", intensity: 0.4 };
    case "hemisphere":
      return { id, type, sky: "#ffffff", ground: "#888888", intensity: 0.5 };
    case "point":
      return { id, type, color: "#ffffff", intensity: 0.6, position: [0, 12, 0], distance: 40 };
    default:
      return { id, type: "directional", color: "#ffffff", intensity: 1, position: [12, 22, 10], castShadow: false };
  }
}

export interface ThemeManagerProps {
  manager: ThemeManagerApi;
  onClose?: () => void;
  className?: string;
  style?: React.CSSProperties;
}

export function ThemeManager({ manager, onClose, className, style }: ThemeManagerProps) {
  const { spec, themes, themeId, patch } = manager;
  const [io, setIo] = React.useState("");
  const [ioError, setIoError] = React.useState<string | null>(null);

  const container: React.CSSProperties = {
    background: "var(--editor-surface)",
    color: "var(--editor-text)",
    overflowY: "auto",
    padding: "14px 14px 24px",
    ...style,
  };

  const setLight = (i: number, mutate: (l: LightSpec) => void) =>
    patch((d) => mutate(d.lights[i]));

  return (
    <div className={className} style={container}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
        <h3 style={heading}>Theme manager</h3>
        {onClose ? (
          <button type="button" onClick={onClose} aria-label="Close theme manager" style={{ ...btn, padding: 6 }}>
            <NodeGlyph name="close" size={14} />
          </button>
        ) : null}
      </div>

      {/* Theme picker + lifecycle */}
      <Select
        label="Active theme"
        value={themeId}
        options={themes.map((t) => ({ value: t.id, label: t.builtIn ? `${t.name}` : `${t.name} ·` }))}
        onChange={(v) => manager.setThemeId(v)}
      />
      <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 8 }}>
        <button type="button" style={btn} onClick={() => manager.createTheme("New theme")}>
          <NodeGlyph name="plus" size={13} /> New
        </button>
        <button type="button" style={btn} onClick={() => manager.duplicateTheme()}>
          Duplicate
        </button>
        <button type="button" style={btn} onClick={() => manager.resetToBuiltIn()}>
          <NodeGlyph name="reset" size={13} /> Reset
        </button>
        <button type="button" style={btn} onClick={() => manager.deleteTheme()}>
          <NodeGlyph name="trash" size={13} /> Delete
        </button>
      </div>
      <div style={{ marginTop: 8 }}>
        <Field key={`name-${themeId}`} label="Name" defaultValue={spec.name} onCommit={(v) => v.trim() && manager.renameTheme(v.trim())} />
      </div>

      <Section title="Background">
        <Select
          label="Type"
          value={spec.background.type}
          options={[
            { value: "radial", label: "Radial gradient" },
            { value: "flat", label: "Flat" },
          ]}
          onChange={(v) => patch((d) => (d.background.type = v as ThemeSpec["background"]["type"]))}
        />
        <ColorRow label="Base" value={spec.background.color} onChange={(v) => patch((d) => (d.background.color = v))} />
        <ColorRow label="Centre" value={spec.background.colorHi ?? spec.background.color} onChange={(v) => patch((d) => (d.background.colorHi = v))} />
      </Section>

      <Section title="Grid">
        <CheckRow label="Show grid" value={spec.grid.show} onChange={(v) => patch((d) => (d.grid.show = v))} />
        <ColorRow label="Lines" value={spec.grid.color} onChange={(v) => patch((d) => (d.grid.color = v))} />
        <ColorRow label="Section lines" value={spec.grid.sectionColor} onChange={(v) => patch((d) => (d.grid.sectionColor = v))} />
        <RangeRow label="Opacity" value={spec.grid.opacity ?? 0.6} min={0} max={1} step={0.05} onChange={(v) => patch((d) => (d.grid.opacity = v))} />
      </Section>

      <Section title="Camera">
        <Select
          label="Kind"
          value={spec.camera.kind}
          options={[
            { value: "orthographic", label: "Orthographic (isometric)" },
            { value: "perspective", label: "Perspective" },
          ]}
          onChange={(v) => patch((d) => (d.camera.kind = v as ThemeSpec["camera"]["kind"]))}
        />
        {spec.camera.kind === "orthographic" ? (
          <RangeRow label="Zoom" value={spec.camera.zoom ?? 38} min={8} max={120} step={1} onChange={(v) => patch((d) => (d.camera.zoom = v))} />
        ) : (
          <>
            <RangeRow label="Field of view" value={spec.camera.fov ?? 35} min={15} max={90} step={1} onChange={(v) => patch((d) => (d.camera.fov = v))} />
            <RangeRow label="Distance" value={spec.camera.distance ?? 52} min={20} max={160} step={1} onChange={(v) => patch((d) => (d.camera.distance = v))} />
          </>
        )}
        <Vec3Row label="View direction" value={spec.camera.isoDir ?? [1, 1, 1]} onChange={(v) => patch((d) => (d.camera.isoDir = v))} />
      </Section>

      <Section title="Shadows">
        <CheckRow label="Cast shadows" value={spec.shadow.enabled} onChange={(v) => patch((d) => (d.shadow.enabled = v))} />
        <RangeRow label="Opacity" value={spec.shadow.opacity} min={0} max={1} step={0.02} onChange={(v) => patch((d) => (d.shadow.opacity = v))} />
        <RangeRow label="Softness" value={spec.shadow.radius} min={0} max={20} step={0.5} onChange={(v) => patch((d) => (d.shadow.radius = v))} />
      </Section>

      <Section title="Lights">
        {spec.lights.map((l, i) => (
          <div key={l.id} style={{ border: "1.5px solid var(--editor-border-soft)", borderRadius: 8, padding: 8, display: "flex", flexDirection: "column", gap: 6 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span style={{ ...rowLabel, fontWeight: 700, textTransform: "capitalize" }}>{l.type}</span>
              <button type="button" aria-label="Remove light" style={{ ...btn, padding: 5 }} onClick={() => patch((d) => d.lights.splice(i, 1))}>
                <NodeGlyph name="trash" size={12} />
              </button>
            </div>
            {l.type === "hemisphere" ? (
              <>
                <ColorRow label="Sky" value={l.sky} onChange={(v) => setLight(i, (x) => x.type === "hemisphere" && (x.sky = v))} />
                <ColorRow label="Ground" value={l.ground} onChange={(v) => setLight(i, (x) => x.type === "hemisphere" && (x.ground = v))} />
              </>
            ) : (
              <ColorRow label="Colour" value={l.color} onChange={(v) => setLight(i, (x) => x.type !== "hemisphere" && (x.color = v))} />
            )}
            <RangeRow label="Intensity" value={l.intensity} min={0} max={3} step={0.05} onChange={(v) => setLight(i, (x) => (x.intensity = v))} />
            {l.type === "directional" || l.type === "point" ? (
              <Vec3Row label="Position" value={l.position} onChange={(v) => setLight(i, (x) => (x.type === "directional" || x.type === "point") && (x.position = v))} />
            ) : null}
            {l.type === "directional" ? (
              <CheckRow label="Casts shadow" value={!!l.castShadow} onChange={(v) => setLight(i, (x) => x.type === "directional" && (x.castShadow = v))} />
            ) : null}
          </div>
        ))}
        <AddLight onAdd={(type) => patch((d) => d.lights.push(newLight(type, `l${Date.now() % 100000}`)))} />
      </Section>

      <Section title="Nodes">
        <RangeRow label="Opacity" value={spec.nodes.opacity} min={0.1} max={1} step={0.02} onChange={(v) => patch((d) => (d.nodes.opacity = v))} />
        <RangeRow label="Roughness" value={spec.nodes.roughness ?? 0.42} min={0} max={1} step={0.02} onChange={(v) => patch((d) => (d.nodes.roughness = v))} />
        <RangeRow label="Metalness" value={spec.nodes.metalness ?? 0.06} min={0} max={1} step={0.02} onChange={(v) => patch((d) => (d.nodes.metalness = v))} />
        <RangeRow label="Glow" value={spec.nodes.emissive} min={0} max={1} step={0.02} onChange={(v) => patch((d) => (d.nodes.emissive = v))} />
        {COLOR_ROLES.map((role) => (
          <ColorRow key={role} label={role} value={spec.nodes.colors[role]} onChange={(v) => patch((d) => (d.nodes.colors[role] = v))} />
        ))}
        <ColorRow label="Selection" value={spec.nodes.selection} onChange={(v) => patch((d) => (d.nodes.selection = v))} />
        <ColorRow label="Paper (notes)" value={spec.nodes.paper} onChange={(v) => patch((d) => (d.nodes.paper = v))} />
      </Section>

      <Section title="Connectors">
        <ColorRow label="Colour" value={spec.edges.color} onChange={(v) => patch((d) => (d.edges.color = v))} />
        <ColorRow label="Data flow" value={spec.edges.flow} onChange={(v) => patch((d) => (d.edges.flow = v))} />
        <RangeRow label="Line width" value={spec.edges.width} min={0.5} max={12} step={0.5} onChange={(v) => patch((d) => (d.edges.width = v))} />
        <RangeRow label="Width (selected)" value={spec.edges.widthSelected} min={0.5} max={14} step={0.5} onChange={(v) => patch((d) => (d.edges.widthSelected = v))} />
        <RangeRow label="Arrow size" value={spec.edges.arrowSize} min={0.5} max={4} step={0.1} onChange={(v) => patch((d) => (d.edges.arrowSize = v))} />
        <Select
          label="Connector style"
          value={spec.edges.connector}
          options={[
            { value: "line", label: "Line" },
            { value: "tube", label: "Tube" },
            { value: "ribbonArrow", label: "Ribbon arrow" },
          ]}
          onChange={(v) => patch((d) => (d.edges.connector = v as ThemeSpec["edges"]["connector"]))}
        />
      </Section>

      <Section title="Labels &amp; text">
        <Select
          label="Label presentation"
          value={spec.text.mode ?? "3d"}
          options={[
            { value: "3d", label: "3D hovering (in-canvas)" },
            { value: "dom", label: "Flat chips (DOM)" },
          ]}
          onChange={(v) => patch((d) => (d.text.mode = v as "3d" | "dom"))}
        />
        <ColorRow label="Colour" value={spec.text.color} onChange={(v) => patch((d) => (d.text.color = v))} />
        <RangeRow label="Opacity" value={spec.text.opacity} min={0.1} max={1} step={0.02} onChange={(v) => patch((d) => (d.text.opacity = v))} />
        <RangeRow label="Size" value={spec.text.size} min={0.2} max={2} step={0.05} onChange={(v) => patch((d) => (d.text.size = v))} />
        <Select
          label="Default orientation"
          value={spec.text.orientation}
          options={[
            { value: "billboard", label: "Billboard (faces camera)" },
            { value: "ground", label: "Ground (flat)" },
            { value: "uprightX", label: "Upright · X plane" },
            { value: "uprightZ", label: "Upright · Z plane" },
          ]}
          onChange={(v) => patch((d) => (d.text.orientation = v as ThemeSpec["text"]["orientation"]))}
        />
        <Field key={`font-${themeId}`} label="Font URL (optional)" defaultValue={spec.text.font ?? ""} placeholder="https://…/font.woff" onCommit={(v) => patch((d) => (d.text.font = v.trim() || undefined))} />
      </Section>

      <Section title="Export / import">
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          <button
            type="button"
            style={btn}
            onClick={() => {
              const json = manager.exportThemeJson();
              setIo(json);
              setIoError(null);
              try {
                navigator.clipboard?.writeText(json);
              } catch {
                /* ignore */
              }
            }}
          >
            <NodeGlyph name="download" size={13} /> Export JSON
          </button>
          <button
            type="button"
            style={btn}
            onClick={() => {
              const err = manager.importThemeJson(io);
              setIoError(err);
            }}
          >
            Apply JSON
          </button>
        </div>
        <textarea
          value={io}
          onChange={(e) => setIo(e.currentTarget.value)}
          spellCheck={false}
          placeholder="Paste a ThemeSpec JSON here, then Apply — or Export to copy this theme to commit into theme/themes/."
          style={{
            width: "100%",
            boxSizing: "border-box",
            minHeight: 120,
            resize: "vertical",
            padding: 8,
            borderRadius: 8,
            border: `1.5px solid ${ioError ? "var(--editor-accent)" : "var(--editor-border-soft)"}`,
            background: "var(--editor-surface-2)",
            color: "var(--editor-text)",
            fontFamily: "var(--font-mono, monospace)",
            fontSize: "0.68rem",
            lineHeight: 1.5,
          }}
          aria-label="Theme JSON"
        />
        {ioError ? <span style={{ ...rowLabel, color: "var(--editor-accent)", fontSize: "0.7rem" }}>⚠ {ioError}</span> : null}
        <span style={{ ...rowLabel, color: "var(--editor-text-muted)", fontSize: "0.68rem" }}>
          Edits autosave to this browser. To ship a theme to everyone, Export and commit it into
          <code style={{ fontFamily: "var(--font-mono, monospace)" }}> theme/themes/</code>.
        </span>
      </Section>
    </div>
  );
}

function AddLight({ onAdd }: { onAdd: (type: LightSpec["type"]) => void }) {
  return (
    <Select
      label="Add light"
      value=""
      options={[
        { value: "", label: "Add a light…" },
        { value: "ambient", label: "Ambient" },
        { value: "hemisphere", label: "Hemisphere" },
        { value: "directional", label: "Directional" },
        { value: "point", label: "Point" },
      ]}
      onChange={(v) => v && onAdd(v as LightSpec["type"])}
    />
  );
}

export default ThemeManager;
