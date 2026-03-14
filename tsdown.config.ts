import { defineConfig } from 'tsdown'

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm'],
  dts: true,
  fixedExtension: false,
  sourcemap: 'hidden',
  minify: {
    compress: true,
    mangle: false,
    codegen: false,
  },
})
