import { defineConfig } from 'vitest/config';
import solidPlugin from 'vite-plugin-solid';

export default defineConfig({
  plugins: [solidPlugin()],
  server: {
    port: 3000,
  },
  build: {
    target: 'esnext',
  },
  test: {
    deps: {
      registerNodeLoader: true,
    },
    environment: "jsdom",
    globals: true,
    setupFiles: ['node_modules/@testing-library/jest-dom/extend-expect', './setupVitest.js'],
    transformMode: { web: [/\.[jt]sx?$/] },
  },
  resolve: {
    conditions: ["development", "browser"],
  },
});
