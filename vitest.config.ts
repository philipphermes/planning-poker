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
                '**/auth/config.ts',
                '**/auth/current-user.repository.ts',
                '**/auth/index.ts',
            ],
            thresholds: {
                lines: 90,
                functions: 90,
                branches: 90,
                statements: 90,
            }
        },
    },
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
        },
    },
})