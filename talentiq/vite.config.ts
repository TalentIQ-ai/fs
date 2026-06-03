import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  resolve: {
    alias: {
      "@": path.join(__dirname, "src"),
    },
  },

  plugins: [
    react(),
  ],

  build: {
    target: "es2020",
    sourcemap: false,
    chunkSizeWarningLimit: 300,

    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("lucide-react")) {
            return "icons";
          }

          if (
            id.includes("react/") ||
            id.includes("react-dom/") ||
            id.includes("react-router") ||
            id.includes("@tanstack/react-query")
          ) {
            return "react-vendor";
          }

          if (id.includes("node_modules")) {
            return "vendor";
          }
        },
      },
    },
  },

  optimizeDeps: {
    include: ["lucide-react", "react", "react-dom", "react-router-dom"],
  },
});