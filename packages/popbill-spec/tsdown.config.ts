import { defineConfig } from 'tsdown'

export default defineConfig({
  entry: [
    'src/index.ts',
    'src/tax-invoice/index.ts',
    'src/tax-invoice/shims/index.ts',
  ],
  dts: {
    build: true,
  },
  shims: true,
  format: ['esm'],
  exports: false,
})
