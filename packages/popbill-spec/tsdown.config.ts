import { defineConfig } from 'tsdown'

export default defineConfig({
  entry: {
    'index': 'src/index.ts',
    'tax-invoice/index': 'src/tax-invoice/index.ts',
    'tax-invoice/get-info': 'src/tax-invoice/get-info.ts',
  },
  shims: true,
  format: ['esm'],
  exports: false,
})
