/**
 * 홈택스 세금계산서 수집 원본 모델.
 * @see https://developers.popbill.com/api-reference/httaxinvoice/api/job
 * @see https://developers.popbill.com/api-reference/httaxinvoice/api/search
 * @see https://developers.popbill.com/api-reference/httaxinvoice/common-api/point
 */
export interface HomeTaxTaxInvoiceJobStateApiModel {
  jobID?: string
  queryType?: string
  queryDateType?: string
  queryStDate?: string
  queryEnDate?: string
  /** HTTP 문서는 number, Node.js SDK 문서는 string으로 명시합니다. */
  jobState?: number | string | null
  errorCode?: number | string | null
  errorReason?: string
  collectCount?: number
  regDT?: string
  jobStartDT?: string
  jobEndDT?: string
}

export interface HomeTaxTaxInvoiceDetailApiModel {
  serialNum?: number
  itemName?: string
  spec?: string
  qty?: string
  unitCost?: string
  supplyCost?: string
  tax?: string
  remark?: string
  purchaseDT?: string
}

export interface HomeTaxTaxInvoicePartyApiModel {
  invoicerCorpNum?: string
  invoicerMgtKey?: string
  invoicerTaxRegID?: string
  invoicerCorpName?: string
  invoicerCEOName?: string
  invoicerAddr?: string
  invoicerBizType?: string
  invoicerBizClass?: string
  invoicerContactName?: string
  invoicerDeptName?: string
  invoicerTEL?: string
  invoicerEmail?: string
  invoiceeCorpNum?: string
  invoiceeType?: string
  invoiceeMgtKey?: string
  invoiceeTaxRegID?: string
  invoiceeCorpName?: string
  invoiceeCEOName?: string
  invoiceeAddr?: string
  invoiceeBizType?: string
  invoiceeBizClass?: string
  invoiceeContactName1?: string
  invoiceeDeptName1?: string
  invoiceeTEL1?: string
  invoiceeEmail1?: string
  invoiceeContactName2?: string
  invoiceeDeptName2?: string
  invoiceeTEL2?: string
  invoiceeEmail2?: string
  trusteeCorpNum?: string
  trusteeMgtKey?: string
  trusteeTaxRegID?: string
  trusteeCorpName?: string
  trusteeCEOName?: string
  trusteeAddr?: string
  trusteeBizType?: string
  trusteeBizClass?: string
  trusteeContactName?: string
  trusteeDeptName?: string
  trusteeTEL?: string
  trusteeEmail?: string
}

export interface HomeTaxTaxInvoiceSummaryApiModel extends HomeTaxTaxInvoicePartyApiModel {
  ntsconfirmNum?: string
  orgNTSConfirmNum?: string
  invoiceType?: string
  taxType?: string
  purposeType?: string
  modifyYN?: boolean
  supplyCostTotal?: string
  taxTotal?: string
  totalAmount?: string
  itemName?: string
  spec?: string
  qty?: string
  unitCost?: string
  supplyCost?: string
  tax?: string
  remark?: string
  remark1?: string
  purchaseDate?: string
  writeDate?: string
  issueDate?: string
  sendDate?: string
}

export interface HomeTaxTaxInvoiceApiModel extends HomeTaxTaxInvoicePartyApiModel {
  ntsconfirmNum?: string
  orgNTSConfirmNum?: string
  serialNum?: string
  invoiceType?: number
  taxType?: string
  purposeType?: string
  modifyCode?: number
  supplyCostTotal?: string
  taxTotal?: string
  totalAmount?: string
  cash?: string
  chkBill?: string
  credit?: string
  note?: string
  detailList?: HomeTaxTaxInvoiceDetailApiModel[]
  remark1?: string
  remark2?: string
  remark3?: string
  writeDate?: string
  issueDT?: string
}

export interface HomeTaxTaxInvoiceSearchResultApiModel {
  code: number
  pageNum?: number
  perPage?: number
  pageCount?: number
  total?: number
  list?: HomeTaxTaxInvoiceSummaryApiModel[]
}
export interface HomeTaxTaxInvoiceTotalsApiModel {
  count?: number
  supplyCostTotal?: number
  taxTotal?: number
  amountTotal?: number
}
export interface HomeTaxTaxInvoiceXmlApiResponse {
  ResultCode: number
  Message: string
  retObject: string
}
export interface HomeTaxTaxInvoiceFlatRateStateApiModel {
  referenceID?: string
  state?: number
  closeRequestYN?: boolean
  useRestrictYN?: boolean
  closeOnExpired?: boolean
  unPaidYN?: boolean
  baseDate?: number
  contractDT?: string
  useEndDate?: string
}
export interface HomeTaxTaxInvoiceChargeInfoApiResponse {
  unitCost?: string
  chargeMethod?: string
  rateSystem?: string
}
