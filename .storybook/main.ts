import type { StorybookConfig } from "@storybook/react-vite";

const config: StorybookConfig = {
  stories: ["../src/**/*.mdx", "../src/**/*.stories.@(ts|tsx)"],
  // Serve public/ (3D label fonts under /fonts) for stories that render the scene.
  staticDirs: ["../public"],
  addons: [
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    "@storybook/addon-a11y",
  ],
  framework: {
    name: "@storybook/react-vite",
    options: {},
  },
  core: { disableTelemetry: true },
  async viteFinal(config, { configType }) {
    // Relative base so the static build works under the GitHub Pages
    // project subpath (https://<user>.github.io/switchboard-www/).
    if (configType === "PRODUCTION") {
      config.base = "./";
    }
    // Keep the `"use client"` directives (meaningful when Next.js consumes the
    // library in Phase 2) without the noisy Rollup bundling warning here.
    config.build = config.build ?? {};
    config.build.rollupOptions = config.build.rollupOptions ?? {};
    const prev = config.build.rollupOptions.onwarn;
    config.build.rollupOptions.onwarn = (warning, defaultHandler) => {
      if (warning.code === "MODULE_LEVEL_DIRECTIVE") return;
      if (typeof prev === "function") prev(warning, defaultHandler);
      else defaultHandler(warning);
    };
    return config;
  },
};

export default config;
