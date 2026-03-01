import type * as Spec from '@connextable/popbill-spec'

export const PopbillServiceIds = {
  Test: 'POPBILL_TEST',
  Production: 'POPBILL',
} as const satisfies Record<'Test' | 'Production', Spec.PopbillServiceId>

export const PopbillApiBaseUrls = {
  Test: 'https://popbill-test.linkhub.co.kr',
  Production: 'https://popbill.linkhub.co.kr',
  StaticTest: 'https://static-popbill-test.linkhub.co.kr',
  StaticProduction: 'https://static-popbill.linkhub.co.kr',
  GaTest: 'https://ga-popbill-test.linkhub.co.kr',
  GaProduction: 'https://ga-popbill.linkhub.co.kr',
} as const satisfies Record<'Test' | 'Production' | 'StaticTest' | 'StaticProduction' | 'GaTest' | 'GaProduction', Spec.PopbillApiBaseUrl>

export const PopbillAuthBaseUrls = {
  Default: 'https://auth.linkhub.co.kr',
  Static: 'https://static-auth.linkhub.co.kr',
  Ga: 'https://ga-auth.linkhub.co.kr',
} as const satisfies Record<'Default' | 'Static' | 'Ga', Spec.PopbillAuthBaseUrl>

export const PopbillAcceptLanguages = {
  KoreanKorea: 'ko-KR',
  EnglishUnitedStates: 'en-US',
} as const satisfies Record<'KoreanKorea' | 'EnglishUnitedStates', Spec.PopbillAcceptLanguage>

export const PopbillHttpMethodOverrides = {
  BulkIssue: 'BULKISSUE',
} as const satisfies Record<'BulkIssue', Spec.PopbillHttpMethodOverride>

export const PopbillLinkhubApiVersion = '2.0' as const

export const PopbillAuthScopes = {
  Member: 'member',
  TaxInvoice: '110',
  CashReceipt: '140',
  TradeStatement: '121',
  Invoice: '122',
  Estimate: '123',
  PurchaseOrder: '124',
  Deposit: '125',
  Receipt: '126',
  HomeTaxTaxInvoice: '111',
  HomeTaxCashReceipt: '141',
  BusinessCheck: '170',
  CorporateInfo: '171',
  DepositorNameCheck: '182',
  DepositorRealNameCheck: '183',
  AccountCheck: '180',
  AlimTalk: '153',
  BrandMessageI: '156',
  BrandMessageN: '157',
  BrandMessageM: '158',
  SMS: '150',
  LMS: '151',
  MMS: '152',
  Fax: '160',
  IntelligentFax: '161',
} as const satisfies Record<string, Spec.PopbillAuthScope>
