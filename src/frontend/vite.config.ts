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
      /**
       * TODO: Docker 업데이트 이후 네트워크 설정이 변경된 것으로 유추되어 vite 서버에서 `localhost` 접근이 불가능해짐.
       * 임시 해결책으로 `host: true` 설정을 추가하여 모든 네트워크 인터페이스에서 접근 가능하도록 설정함.
       * 이 설정은 보안상 권장되지 않으며, 원인을 파악하고 근본적인 해결책을 찾는 것이 필요함. 지속적인 모니터링 필요.
       */
      host: true,
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
