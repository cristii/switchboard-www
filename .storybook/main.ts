import type { StorybookConfig } from "@storybook/react-vite";

const config: StorybookConfig = {
  stories: ["../src/**/*.mdx", "../src/**/*.stories.@(ts|tsx)"],
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
    return config;
  },
};

export default config;
