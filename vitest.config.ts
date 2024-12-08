import { configDefaults, defineConfig } from 'vitest/config'
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: './.env.test' })

export default defineConfig({
    resolve: {
        alias: {
            '~': path.resolve(__dirname, 'app'), // Adjust the path to match your project structure
        },
    },
    test: {
        exclude: [
            ...configDefaults.exclude,
        ],
        setupFiles: [
            './tests/setup/data.ts',
        ],
    },
})