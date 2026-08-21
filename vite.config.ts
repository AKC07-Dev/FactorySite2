import { defineConfig } from "@lovable.dev/vite-tanstack-config";

export default defineConfig({
  tanstackStart: {
    server: { entry: "server" },
  },
  vite: {
    // Override Nitro preset target to Vercel
    nitro: {
      preset: "vercel",
    },
  },
});
