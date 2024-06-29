import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import viteTsconfigPaths from "vite-tsconfig-paths";
import { createHtmlPlugin } from "vite-plugin-html";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  return {
    define: {
      "process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV),
    },
    plugins: [
      react(),
      viteTsconfigPaths(),
      createHtmlPlugin({
        inject: {
          data: {
            VITE_FAVICON:
              mode === "development" ? "logo-light.png" : "logo-dark.png",
            VITE_TITLE:
              mode === "development" ? "I18n Studio - DEV" : "I18n Studio",
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
