import type { EasyFinBankAccountFormApiModel, EasyFinBankUpdateAccountFormApiModel } from '@connextable/popbill-spec'
import type { EasyFinBankAccountChanges, EasyFinBankAccountRegistration } from '../types'

export function mapAccountChanges(account: EasyFinBankAccountChanges): EasyFinBankUpdateAccountFormApiModel {
  return {
    AccountPWD: account.accountPassword,
    AccountName: account.accountName,
    BankID: account.internetBankingId,
    FastID: account.inquiryId,
    FastPWD: account.inquiryPassword,
    Memo: account.memo,
  }
}

export function mapAccountRegistration(account: EasyFinBankAccountRegistration): EasyFinBankAccountFormApiModel {
  return {
    BankCode: account.bankCode,
    AccountNumber: account.accountNumber,
    AccountType: account.accountType,
    IdentityNumber: account.identityNumber,
    ...mapAccountChanges(account),
  }
}
