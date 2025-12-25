import { defineConfig } from 'tsdown'

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm'],
  dts: true,
  fixedExtension: false,
  minify: {
    compress: true,
    mangle: false,
    codegen: false,
  },
})
