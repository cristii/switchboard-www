import React from "react";
import type { Preview } from "@storybook/react";

// Design tokens + fonts + the paper canvas (order matters: tokens before use).
import "../src/styles/fonts.css";
import "../src/styles/colors.css";
import "../src/styles/typography.css";
import "../src/styles/spacing.css";
// Editor-scoped tokens (light + dark), scoped to [data-editor-theme]. Imported
// after the brand tokens it derives from. See src/components/editor/theme.
import "../src/components/editor/theme/editor-tokens.css";
import "../src/styles/global.css";

const preview: Preview = {
  globalTypes: {
    siteTheme: {
      description: "Site light/dark theme (data-theme on <html>)",
      defaultValue: "light",
      toolbar: {
        title: "Site theme",
        icon: "mirror",
        items: [
          { value: "light", title: "Site: Light" },
          { value: "dark", title: "Site: Dark" },
        ],
        dynamicTitle: true,
      },
    },
    editorTheme: {
      description: "Editor-scoped light/dark theme (data-editor-theme)",
      defaultValue: "light",
      toolbar: {
        title: "Editor theme",
        icon: "contrast",
        items: [
          { value: "light", title: "Editor: Light" },
          { value: "dark", title: "Editor: Dark" },
        ],
        dynamicTitle: true,
      },
    },
  },
  parameters: {
    controls: {
      matchers: { color: /(background|color)$/i, date: /Date$/i },
    },
    backgrounds: {
      // No default → the paper canvas from global.css shows through.
      // Toggle these to preview components on alternate surfaces.
      values: [
        { name: "paper", value: "#E9E8DF" },
        { name: "paper-2", value: "#E1E2D7" },
        { name: "white", value: "#FFFFFF" },
        { name: "dark", value: "#11201E" },
        { name: "page-dark", value: "#0E1A18" },
      ],
    },
    options: {
      storySort: {
        order: [
          "Introduction",
          "Foundations",
          ["Colors", "Typography", "Spacing & Layout", "Shadows", "Icons"],
          "Core",
          "Surfaces",
          "Data",
          "Chat",
          "Editor",
        ],
      },
    },
  },
  decorators: [
    (Story, context) => {
      const editorTheme = (context.globals.editorTheme as string) ?? "light";
      const siteTheme = (context.globals.siteTheme as string) ?? "light";
      // Site dark tokens are scoped to :root[data-theme="dark"], so the flag
      // must live on the document element, not a wrapper.
      React.useEffect(() => {
        document.documentElement.dataset.theme = siteTheme;
      }, [siteTheme]);
      return (
        <div data-editor-theme={editorTheme} style={{ padding: "28px" }}>
          <Story />
        </div>
      );
    },
  ],
};

export default preview;
