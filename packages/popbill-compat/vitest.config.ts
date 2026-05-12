import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    alias: {
      '@/': new URL('./src/', import.meta.url).pathname,
      '@connextable/popbill-compat': new URL('./src/index.ts', import.meta.url).pathname,
      '@connextable/popbill-compat/errors': new URL('./src/errors.ts', import.meta.url).pathname,
      '@connextable/popbill-compat/factory': new URL('./src/factory/index.ts', import.meta.url).pathname,
      '@connextable/popbill-compat/promise': new URL('./src/promise/index.ts', import.meta.url).pathname,
    },
  },
})
