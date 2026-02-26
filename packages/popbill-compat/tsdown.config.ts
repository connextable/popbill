import { defineConfig } from 'tsdown'

export default defineConfig({
  entry: [
    'src/index.ts',
    'src/factory/index.ts',
    'src/promise/index.ts',
  ],
  dts: { build: true },
  shims: true,
  format: ['esm', 'cjs'],
  exports: false,
})
