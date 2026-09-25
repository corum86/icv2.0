import { defineConfig } from 'vite';
import { fileURLToPath } from 'node:url';

const page = (f: string) => fileURLToPath(new URL(f, import.meta.url));

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: page('./index.html'),
        datenschutz: page('./datenschutz.html'),
      },
    },
  },
});
