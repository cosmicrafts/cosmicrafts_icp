import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import { nodePolyfills } from 'vite-plugin-node-polyfills';
import { config } from 'dotenv';

config({
  path: "../../.env",
});

export default defineConfig({
  plugins: [
    react(),
    nodePolyfills({
      // Include specific polyfills if needed
      // include: [],

      // Exclude specific polyfills if needed
      // exclude: [],

      // Configure global polyfills
      globals: {
        Buffer: true,
        global: true,
        process: true,
      },

      // Override specific module polyfills
      // overrides: {},

      // Enable polyfilling `node:` protocol imports
      protocolImports: true,
    }),
  ],
  resolve: {
    alias: {
      'crypto': 'crypto-browserify',
    },
  },
  build: {
    outDir: '../../dist/cosmicrafts_icp_frontend',
  },
  esbuild: {
    jsxFactory: 'React.createElement',
    jsxFragment: 'React.Fragment',
  },
});
