import { defineConfig } from 'tsdown'

export default defineConfig({
  entry: {
    index: 'src/index.ts',
    'promise/index': 'src/promise/index.ts',
  },
  shims: true,
  format: ['esm', 'cjs'],
  exports: false,
})
