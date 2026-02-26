import { defineConfig } from 'tsdown'

export default defineConfig({
  entry: 'src/index.ts',
  dts: { build: true },
  shims: true,
  format: ['esm'],
  exports: true,
})
