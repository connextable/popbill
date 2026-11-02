import { defineConfig } from 'tsdown'

export default defineConfig({
  entry: ['src/index.ts', 'src/factory/index.ts', 'src/promise/index.ts', 'src/errors.ts'],
  dts: { tsconfig: 'tsconfig.lib.json' },
  shims: true,
  format: ['esm', 'cjs'],
  exports: false,
})
