export const PopbillErrorType = {
  InputValidation: 'input_validation',
  ApiResponse: 'api_response',
  Http: 'http',
  Network: 'network',
  Timeout: 'timeout',
  Unknown: 'unknown',
} as const

export const PopbillErrorStage = {
  ValidateInput: 'validate_input',
  IssueToken: 'issue_token',
  RequestApi: 'request_api',
  Unknown: 'unknown',
} as const

export const PopbillErrorDomain = {
  Common: 'common',
  TaxInvoice: 'tax_invoice',
  Statement: 'statement',
  CashReceipt: 'cash_receipt',
  Kakao: 'kakao',
  Message: 'message',
  Fax: 'fax',
  Account: 'account',
  AccountHolder: 'account_holder',
  BusinessRegistration: 'business_registration',
  CompanyInfo: 'company_info',
  Hometax: 'hometax',
  Unknown: 'unknown',
} as const

export type PopbillErrorType = (typeof PopbillErrorType)[keyof typeof PopbillErrorType]
export type PopbillErrorStage = (typeof PopbillErrorStage)[keyof typeof PopbillErrorStage]
export type PopbillErrorDomain = (typeof PopbillErrorDomain)[keyof typeof PopbillErrorDomain]
