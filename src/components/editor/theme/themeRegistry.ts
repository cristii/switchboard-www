// Theme registry: the single place built-in (repo) themes and user (localStorage)
// themes are merged + resolved by id. Built-ins ship in the deploy; to make a user
// theme available to everyone, export its JSON from the Theme manager and drop a
// module into theme/themes/ + register it below (see docs/themes/CREATING_THEMES.md).

import { cloneThemeSpec, normalizeThemeSpec, type ThemeSpec } from "./themeSpec";
import { lightTheme } from "./themes/light";
import { darkTheme } from "./themes/dark";
import { awsTheme } from "./themes/aws";
import { blueprintTheme } from "./themes/blueprint";

/** Repo-shipped themes, in display order. Add a built-in by importing it here. */
export const BUILT_IN_THEMES: ThemeSpec[] = [lightTheme, darkTheme, awsTheme, blueprintTheme];

const BUILT_IN_BY_ID: Record<string, ThemeSpec> = Object.fromEntries(
  BUILT_IN_THEMES.map((t) => [t.id, t]),
);

export const USER_THEMES_KEY = "sb-editor-themes";

function isBrowser(): boolean {
  return typeof window !== "undefined";
}

/** Read the user theme map ({ id: ThemeSpec }) from localStorage, tolerant of
 *  malformed entries (each is normalised against the light theme). */
export function readUserThemes(): Record<string, ThemeSpec> {
  if (!isBrowser()) return {};
  try {
    const raw = window.localStorage.getItem(USER_THEMES_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as Record<string, unknown>;
    const out: Record<string, ThemeSpec> = {};
    for (const [id, spec] of Object.entries(parsed)) {
      const normalized = normalizeThemeSpec(spec, lightTheme);
      out[id] = { ...normalized, id, builtIn: false };
    }
    return out;
  } catch {
    return {};
  }
}

function writeUserThemes(map: Record<string, ThemeSpec>): void {
  if (!isBrowser()) return;
  try {
    window.localStorage.setItem(USER_THEMES_KEY, JSON.stringify(map));
  } catch {
    /* ignore quota / privacy-mode errors */
  }
}

/** All themes (built-in first, then user), de-duped by id (user wins). */
export function listThemes(): ThemeSpec[] {
  const user = readUserThemes();
  const builtIns = BUILT_IN_THEMES.map((t) => user[t.id] ?? t);
  const extras = Object.values(user).filter((t) => !BUILT_IN_BY_ID[t.id]);
  return [...builtIns, ...extras];
}

/** Resolve a theme by id (user override → built-in → light fallback). */
export function getThemeSpec(id: string | undefined): ThemeSpec {
  if (!id) return cloneThemeSpec(lightTheme);
  const user = readUserThemes();
  const found = user[id] ?? BUILT_IN_BY_ID[id];
  return cloneThemeSpec(found ?? lightTheme);
}

/** Persist a user theme (built-in ids are allowed — they override the built-in). */
export function saveUserTheme(spec: ThemeSpec): void {
  const map = readUserThemes();
  map[spec.id] = { ...spec, builtIn: false };
  writeUserThemes(map);
}

/** Delete a user theme. Built-ins can't be deleted (only overridden); deleting a
 *  built-in override falls back to the shipped built-in. */
export function deleteUserTheme(id: string): void {
  const map = readUserThemes();
  delete map[id];
  writeUserThemes(map);
}

export function isBuiltIn(id: string): boolean {
  return !!BUILT_IN_BY_ID[id];
}

/** A unique id derived from a base label (e.g. "my-theme", "my-theme-2"). */
export function uniqueThemeId(base: string): string {
  const slug = base.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "theme";
  const taken = new Set(listThemes().map((t) => t.id));
  if (!taken.has(slug)) return slug;
  let i = 2;
  while (taken.has(`${slug}-${i}`)) i++;
  return `${slug}-${i}`;
}

/** Resolve a preview/embed `config.theme` (an id string OR an inline ThemeSpec
 *  object) into a full ThemeSpec. Defaults to light. */
export function resolveThemeFromConfig(theme: string | ThemeSpec | undefined): ThemeSpec {
  if (!theme) return cloneThemeSpec(lightTheme);
  if (typeof theme === "string") return getThemeSpec(theme);
  return normalizeThemeSpec(theme, getThemeSpec(theme.id));
}
