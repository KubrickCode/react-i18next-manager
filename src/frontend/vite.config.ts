import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import viteTsconfigPaths from "vite-tsconfig-paths";
import { createHtmlPlugin } from "vite-plugin-html";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  return {
    plugins: [
      react(),
      viteTsconfigPaths(),
      createHtmlPlugin({
        inject: {
          data: {
            VITE_FAVICON:
              mode === "development" ? "logo-light.png" : "logo-dark.png",
          },
        },
      }),
    ],
    server: {
      open: true,
      port: 3000,
      proxy: {
        "/api": {
          target: "http://localhost:3001",
          changeOrigin: true,
        },
      },
    },
  };
});
