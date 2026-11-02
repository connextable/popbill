export interface EasyFinBankBusinessInput {
  businessNumber: string
}
export interface EasyFinBankAccountReference extends EasyFinBankBusinessInput {
  bankCode: string
  accountNumber: string
}
export interface EasyFinBankAccountChanges {
  accountPassword: string
  accountName?: string
  internetBankingId?: string
  inquiryId?: string
  inquiryPassword?: string
  memo?: string
}
export interface EasyFinBankAccountRegistration extends EasyFinBankAccountChanges {
  bankCode: string
  accountNumber: string
  accountType: '법인' | '개인' | (string & {})
  identityNumber: string
}
export interface EasyFinBankRegisterAccountInput extends EasyFinBankBusinessInput {
  account: EasyFinBankAccountRegistration
  subscriptionMonths?: number
}
export interface EasyFinBankUpdateAccountInput extends EasyFinBankAccountReference {
  account: EasyFinBankAccountChanges
}
export interface EasyFinBankRequestCollectionInput extends EasyFinBankAccountReference {
  /** yyyyMMdd. Maximum one month per collection, within the preceding three months. */
  startDate: string
  endDate: string
}
export interface EasyFinBankCollectionReference extends EasyFinBankBusinessInput {
  /** Expires one hour after the collection request. */
  collectionId: string
}
export interface EasyFinBankTransactionFilterInput extends EasyFinBankCollectionReference {
  transactionTypes?: ('I' | 'O' | (string & {}))[]
  queryText?: string
}
export interface EasyFinBankSearchTransactionsInput extends EasyFinBankTransactionFilterInput {
  sortOrder?: 'A' | 'D' | (string & {})
  pageNumber?: number
  pageSize?: number
}
export interface EasyFinBankSaveMemoInput extends EasyFinBankBusinessInput {
  transactionId: string
  memo: string
}
