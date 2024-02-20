import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import { vitePluginVersionMark } from "vite-plugin-version-mark";

const proxy = process.env.VITE_REMOTE_DEV
  ? {
      "/api": {
        target: "https://api.imparty.cn:8002",
        changeOrigin: true,
        rewrite: (path: string) => path.replace(/^\/api/, ""),
      },
    }
  : undefined;

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), vitePluginVersionMark()],
  server: {
    port: 24933,
    proxy,
  },
});
