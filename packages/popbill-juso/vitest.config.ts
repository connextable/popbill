import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    alias: {
      '@/': new URL('./src/', import.meta.url).pathname,
      '@connextable/popbill-juso': new URL('./src/index.ts', import.meta.url).pathname,
    },
  },
})
