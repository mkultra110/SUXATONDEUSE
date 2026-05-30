import { defineConfig } from 'vitest/config';
import path from 'node:path';

// Configuration Vitest dediee au backend.
// Resolve les imports vers le package shared par alias TS.
export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    setupFiles: ['./src/tests/setup.ts'],
    include: ['src/**/*.test.ts', 'src/tests/**/*.test.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'lcov', 'html'],
      include: ['src/**/*.ts'],
      exclude: ['src/**/*.test.ts', 'src/tests/**', 'src/server.ts', 'src/types/**'],
      thresholds: {
        // Cible globale realiste : la glue HTTP (controllers/middleware/routes)
        // est principalement couverte par les tests d'integration (DB requise),
        // d'ou un seuil de fonctions plus bas au global.
        statements: 70,
        branches: 70,
        functions: 60,
        lines: 70,
        // La logique metier critique doit rester tres couverte (cf. GDD 13.1 :
        // services 80 %+, anti-cheat 95 %+). On l'impose par glob.
        'src/services/**/*.ts': {
          statements: 90,
          branches: 75,
          functions: 90,
          lines: 90,
        },
        'src/utils/**/*.ts': {
          statements: 90,
          branches: 85,
          functions: 90,
          lines: 90,
        },
      },
    },
  },
  resolve: {
    alias: {
      '@robomow/shared': path.resolve(__dirname, '../shared/src/index.ts'),
    },
  },
});
