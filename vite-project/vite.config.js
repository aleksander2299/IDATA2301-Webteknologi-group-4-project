import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import svgr from 'vite-plugin-svgr';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    svgr()

  ],
  server: {
    port: 5173
  },
  css: {
    modules: {
      generateScopedName: '[name]__[local]___[hash:base64:5]', // Scoping the CSS class names
    },
    
  },
})
