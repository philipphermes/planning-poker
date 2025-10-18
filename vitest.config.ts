import {defineConfig} from 'vitest/config'
import path from 'path'

export default defineConfig({
    test: {
        environment: 'jsdom',
        setupFiles: [
            './tests/setup/env.setup.ts',
            './tests/setup/db.setup.ts',
        ],
        globals: true,
        coverage: {
            provider: 'v8',
            reporter: ['text', 'json', 'html', 'lcov'],
            include: ['src/**/*.{ts,js}'],
            exclude: [
                '**/types/**',
                '**/middleware.ts',
                '**/auth/**/auth.config.ts',
                '**/auth/**/index.ts',
                '**/app/**',
            ],
            thresholds: {
                lines: 80,
                functions: 80,
                branches: 80,
                statements: 80,
            }
        },
    },
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
        },
    },
})