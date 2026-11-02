import type * as Document from './document'
import type * as Response from './response'
export type * from './document'
export type * from './response'

export interface EasyFinBankService {
  /** Compat: `getBankAccountMgtURL` */
  getBankAccountManagementURL(request: Document.EasyFinBankBusinessInput): Promise<Response.EasyFinBankAccessURL>
  /** Compat: `registBankAccount` */
  registerBankAccount(request: Document.EasyFinBankRegisterAccountInput): Promise<Response.EasyFinBankOperationResult>
  /** Compat: `updateBankAccount` */
  updateBankAccount(request: Document.EasyFinBankUpdateAccountInput): Promise<Response.EasyFinBankOperationResult>
  /** Compat: `getBankAccountInfo` */
  getBankAccount(request: Document.EasyFinBankAccountReference): Promise<Response.EasyFinBankAccount>
  /** Compat: `listBankAccount` */
  listBankAccounts(request: Document.EasyFinBankBusinessInput): Promise<Response.EasyFinBankAccount[]>
  /** Requests closure when the current paid subscription expires. Compat: `closeBankAccount` */
  requestBankAccountClosure(request: Document.EasyFinBankAccountReference): Promise<Response.EasyFinBankOperationResult>
  /** Compat: `revokeCloseBankAccount` */
  cancelBankAccountClosure(request: Document.EasyFinBankAccountReference): Promise<Response.EasyFinBankOperationResult>
  /** Compat: `deleteBankAccount` */
  deleteBankAccount(request: Document.EasyFinBankAccountReference): Promise<Response.EasyFinBankOperationResult>
  /** Compat: `requestJob` */
  requestCollection(request: Document.EasyFinBankRequestCollectionInput): Promise<Response.EasyFinBankCollectionReceipt>
  /** Compat: `getJobState` */
  getCollectionStatus(request: Document.EasyFinBankCollectionReference): Promise<Response.EasyFinBankCollectionStatus>
  /** Compat: `listActiveJob` */
  listCollectionStatuses(request: Document.EasyFinBankBusinessInput): Promise<Response.EasyFinBankCollectionStatus[]>
  /** Compat: `search` */
  searchTransactions(request: Document.EasyFinBankSearchTransactionsInput): Promise<Response.EasyFinBankTransactionSearchResult>
  /** Compat: `summary` */
  summarizeTransactions(request: Document.EasyFinBankTransactionFilterInput): Promise<Response.EasyFinBankTransactionSummary>
  /** Compat: `saveMemo` */
  saveTransactionMemo(request: Document.EasyFinBankSaveMemoInput): Promise<Response.EasyFinBankOperationResult>
  /** Compat: `getFlatRatePopUpURL` */
  getSubscriptionRegistrationURL(request: Document.EasyFinBankBusinessInput): Promise<Response.EasyFinBankAccessURL>
  /** Compat: `getFlatRateState` */
  getSubscriptionStatus(request: Document.EasyFinBankAccountReference): Promise<Response.EasyFinBankSubscription>
  /** Compat: `getChargeInfo` */
  getChargeInfo(request: Document.EasyFinBankBusinessInput): Promise<Response.EasyFinBankChargeInfo>
}
