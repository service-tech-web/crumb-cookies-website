import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        flavours: resolve(__dirname, 'flavours.html'),
        box: resolve(__dirname, 'box.html'),
        faq: resolve(__dirname, 'faq.html'),
      },
    },
  },
});
