import { defineConfig } from 'tsdown'

export default defineConfig({
  entry: [
    'src/index.ts',
    'src/common/index.ts',
    'src/tax-invoice/index.ts',
    'src/tax-invoice/shims/index.ts',
    'src/cashbill/index.ts',
    'src/statement/index.ts',
    'src/home-tax-tax-invoice/index.ts',
    'src/home-tax-cashbill/index.ts',
    'src/closedown/index.ts',
    'src/biz-info-check/index.ts',
    'src/easy-fin-bank/index.ts',
    'src/account-check/index.ts',
    'src/kakao/index.ts',
    'src/message/index.ts',
    'src/fax/index.ts',
  ],
  dts: {
    tsconfig: 'tsconfig.lib.json',
  },
  shims: true,
  format: ['esm'],
  exports: false,
})
