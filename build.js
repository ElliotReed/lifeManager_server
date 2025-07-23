import { build } from 'esbuild';
import path from 'path';

build({
    entryPoints: ['./src/bin/www'],
    bundle: true,
    platform: 'node',
    target: 'node20',
    format: 'esm',
    outbase: 'src',
    outdir: 'dist',
    packages: 'external',
    sourcemap: true,
}).catch(() => process.exit(1));
