/** @see https://developers.popbill.com/api-reference/easyfinbank/api/manage */
export interface EasyFinBankAccountFormApiModel {
  BankCode: string
  AccountNumber: string
  AccountType: '법인' | '개인' | (string & {})
  IdentityNumber: string
  AccountPWD: string
  AccountName?: string
  BankID?: string
  FastID?: string
  FastPWD?: string
  Memo?: string
}

export interface EasyFinBankUpdateAccountFormApiModel {
  AccountPWD: string
  AccountName?: string
  BankID?: string
  FastID?: string
  FastPWD?: string
  Memo?: string
}

export interface EasyFinBankFlatRateApiModel {
  referenceID: string
  state: number
  closeRequestYN: boolean
  useRestrictYN: boolean
  closeOnExpired: boolean
  unPaidYN: boolean
  baseDate: number
  contractDT: string
  useEndDate: string
}

export interface EasyFinBankAccountApiModel extends Omit<EasyFinBankFlatRateApiModel, 'referenceID'> {
  bankCode: string
  accountNumber: string
  accountName: string
  accountType: '법인' | '개인' | (string & {})
  memo: string
  contractState: number
  regDT: string
}

/** HTTP 문서는 number, Node 문서는 string으로 표기한다. 실제 코드를 보존한다. */
export interface EasyFinBankJobStateApiModel {
  jobID: string
  startDate: string
  endDate: string
  jobState: number | string | null
  errorCode: number | string | null
  errorReason: string
  regDT: string
  jobStartDT: string
  jobEndDT: string
}

export interface EasyFinBankTransactionApiModel {
  tid: string
  trserial: number
  accIn: string
  accOut: string
  balance: string
  remark1: string
  remark2: string
  remark3: string
  remark4: string
  memo: string
  trdate: string
  trdt: string
  regDT: string
}

export interface EasyFinBankSearchResultApiModel {
  code: number
  message: string
  balance: string
  pageNum: number
  perPage: number
  pageCount: number
  total: number
  list: EasyFinBankTransactionApiModel[]
  lastScrapDT: string
}

export interface EasyFinBankSummaryApiModel {
  count: number
  cntAccIn: number
  cntAccOut: number
  totalAccIn: number
  totalAccOut: number
}

export interface EasyFinBankChargeInfoApiModel {
  unitCost: string
  chargeMethod: string
  rateSystem: string
}
