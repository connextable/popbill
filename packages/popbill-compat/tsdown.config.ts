import { defineConfig } from 'tsdown'

export default defineConfig({
  entry: ['src/index.ts', 'src/factory/index.ts', 'src/promise/index.ts', 'src/errors.ts'],
  dts: { tsconfig: 'tsconfig.lib.json' },
  shims: true,
  deps: { alwaysBundle: [/^@connextable\/popbill-/] },
  outputOptions: {
    codeSplitting: {
      groups: [{ name: 'dependencies', test: /\/popbill-(?:runtime|spec|utils)\/dist\/.*\.mjs$/ }],
    },
  },
  format: ['esm', 'cjs'],
  exports: false,
})
