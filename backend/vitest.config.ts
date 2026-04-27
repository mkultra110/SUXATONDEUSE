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
      exclude: [
        'src/**/*.test.ts',
        'src/tests/**',
        'src/server.ts',
        'src/types/**',
      ],
      thresholds: {
        statements: 70,
        branches: 70,
        functions: 70,
        lines: 70,
      },
    },
  },
  resolve: {
    alias: {
      '@robomow/shared': path.resolve(__dirname, '../shared/src/index.ts'),
    },
  },
});
