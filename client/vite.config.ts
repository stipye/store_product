import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  root: path.resolve(__dirname),
  build: {
    outDir: path.resolve(__dirname, "..", "dist"),
    emptyOutDir: true,
  },
  server: {
    port: 3000,
    proxy: {
      // Quando rodar `vercel dev` (que serve as functions em /api),
      // aponte esta porta para onde o servidor de funções estiver.
      "/api": {
        target: process.env.VITE_API_PROXY_TARGET ?? "http://localhost:3001",
        changeOrigin: true,
      },
    },
  },
});
