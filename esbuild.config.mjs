import { build } from 'esbuild'

build({
    entryPoints: ['server.ts'],
    outfile: 'server.cjs',
    bundle: true,
    platform: 'node',
    target: 'node18',
    format: 'cjs',
    sourcemap: true,
    external: ['next'],
    alias: {
        '@': './src',
    },
}).catch(() => process.exit(1))