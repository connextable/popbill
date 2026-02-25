import { defineConfig } from 'tsdown'

export default defineConfig({
  entry: {
    'index': 'src/index.ts',
    'tax-invoice/index': 'src/tax-invoice/index.ts',
    'tax-invoice/shims/index': 'src/tax-invoice/shims/index.ts',
  },
  shims: true,
  format: ['esm'],
  exports: false,
})
