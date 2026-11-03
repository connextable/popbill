import { defineConfig } from 'tsdown'

export default defineConfig({
  entry: ['src/index.ts', 'src/webhook/index.ts'],
  dts: { tsconfig: 'tsconfig.lib.json' },
  shims: true,
  format: ['esm'],
  exports: true,
})
