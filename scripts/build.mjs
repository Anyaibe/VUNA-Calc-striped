import { rmSync, mkdirSync, cpSync } from 'node:fs';

rmSync('dist', { recursive: true, force: true });
mkdirSync('dist', { recursive: true });

cpSync('index.html',  'dist/index.html');
cpSync('assets',      'dist/assets',  { recursive: true });
cpSync('src',         'dist/src',     { recursive: true });
cpSync('calc',        'dist/calc',    { recursive: true });  // ← add this

console.log('Build complete -> dist/');