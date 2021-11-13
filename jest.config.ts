import type { Config } from "@jest/types";

const config: Config.InitialOptions = {
  resetMocks: true,
  setupFilesAfterEnv: ["@testing-library/jest-dom"],
  testEnvironment: "jsdom",
  moduleNameMapper: {
    "\\.(css|less|sass|scss)$": "identity-obj-proxy",
    "\\.(gif|ttf|eot|svg|png)$": "<rootDir>/test/mocks/file_mock.js",
  },
};

export default config;
