import React from "react";
import type { Preview } from "@storybook/react";

// Design tokens + fonts + the paper canvas (order matters: tokens before use).
import "../src/styles/fonts.css";
import "../src/styles/colors.css";
import "../src/styles/typography.css";
import "../src/styles/spacing.css";
import "../src/styles/global.css";

const preview: Preview = {
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
        ],
      },
    },
  },
  decorators: [
    (Story) => (
      <div style={{ padding: "28px" }}>
        <Story />
      </div>
    ),
  ],
};

export default preview;
