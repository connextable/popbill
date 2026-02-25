export const LinkhubAuthScope = {
  /** 공통 (member) */
  Member: 'member',

  /** 전자세금계산서 (110) */
  TaxInvoice: '110',

  /** 현금영수증 (140) */
  CashReceipt: '140',

  /** 전자명세서 > 거래명세서 (121) */
  TradeStatement: '121',

  /** 전자명세서 > 청구서 (122) */
  Invoice: '122',
  /** 전자명세서 > 견적서 (123) */
  Estimate: '123',
  /** 전자명세서 > 발주서 (124) */
  PurchaseOrder: '124',
  /** 전자명세서 > 입금표 (125) */
  Deposit: '125',
  /** 전자명세서 > 영수증 (126) */
  Receipt: '126',

  /** 홈텍스수집 > 전자세금계산서 (111) */
  HomeTaxTaxInvoice: '111',
  /** 홈텍스수집 > 현금영수증 (141) */
  HomeTaxCashReceipt: '141',

  /** 사업자등록상태조회 (170) */
  BusinessCheck: '170',

  /** 기업정보조회 (171) */
  CorporateInfo: '171',

  /** 예금주조회 > 성명조회 (182) */
  DepositorNameCheck: '182',
  /** 예금주조회 > 실명조회 (183) */
  DepositorRealNameCheck: '183',

  /** 계좌조회 (180) */
  AccountCheck: '180',

  /** 카카오톡 > 알림톡 (153) */
  AlimTalk: '153',
  /** 카카오톡 > 브랜드 메시지(I) (156) */
  BrandMessageI: '156',
  /** 카카오톡 > 브랜드 메시지(N) (157) */
  BrandMessageN: '157',
  /** 카카오톡 > 브랜드 메시지(M) (158) */
  BrandMessageM: '158',

  /** 문자 > SMS (150) */
  SMS: '150',
  /** 문자 > LMS (151) */
  LMS: '151',
  /** 문자 > MMS (152) */
  MMS: '152',

  /** 팩스 > 일반망 (160) */
  Fax: '160',
  /** 팩스 > 지능망 (161) */
  IntelligentFax: '161',
} as const

export type LinkhubAuthScope = typeof LinkhubAuthScope[keyof typeof LinkhubAuthScope]
