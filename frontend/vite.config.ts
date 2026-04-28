import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';

// Configuration Vite : alias @ -> ./src, dev server expose sur 5173,
// build optimise pour pixel art (asset inline desactive sur sprites).
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  return {
    plugins: [react()],
    base: env.VITE_BASE_PATH || '/',
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
        '@robomow/shared': path.resolve(__dirname, '../shared/src/index.ts'),
      },
    },
    server: {
      port: 5173,
      strictPort: true,
      host: true,
      // Autorise les hosts inconnus (tunnels Cloudflare a URL changeante,
      // sous-domaines de prod, etc.). En prod cote nginx, le filtrage est
      // fait par Traefik.
      allowedHosts: true,
      proxy: {
        '/api': {
          target: env.VITE_API_PROXY_TARGET || 'http://localhost:3000',
          changeOrigin: true,
        },
      },
    },
    build: {
      outDir: 'dist',
      sourcemap: mode !== 'production',
      target: 'es2022',
      assetsInlineLimit: 0,
      rollupOptions: {
        output: {
          manualChunks: {
            pixi: ['pixi.js', '@pixi/react'],
            react: ['react', 'react-dom', 'react-router-dom'],
            state: ['zustand', '@tanstack/react-query'],
          },
        },
      },
    },
    test: {
      globals: true,
      environment: 'jsdom',
      setupFiles: ['./src/tests/setup.ts'],
    },
  };
});
