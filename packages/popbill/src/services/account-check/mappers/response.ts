import type { AccountCheckAccountInfoApiModel, AccountCheckDepositorInfoApiModel, AccountCheckChargeInfoApiResponse } from '@connextable/popbill-spec'
import type { AccountHolderInfo, AccountHolderIdentityInfo, AccountCheckChargeInfo } from '../types'

export function mapAccountHolderInfo(response: AccountCheckAccountInfoApiModel): AccountHolderInfo {
  return {
    bankCode: response.bankCode,
    accountNumber: response.accountNumber,
    accountHolderName: response.accountName,
    resultCode: response.result,
    resultMessage: response.resultMessage,
    checkedAt: response.checkDT,
  }
}

export function mapAccountHolderIdentityInfo(response: AccountCheckDepositorInfoApiModel): AccountHolderIdentityInfo {
  return {
    bankCode: response.bankCode,
    accountNumber: response.accountNumber,
    identityNumberType: response.identityNumType,
    identityNumber: response.identityNum,
    accountHolderName: response.accountName,
    resultCode: response.result,
    resultMessage: response.resultMessage,
    checkedAt: response.checkDT,
  }
}

export function mapAccountCheckChargeInfo(response: AccountCheckChargeInfoApiResponse): AccountCheckChargeInfo {
  return { unitCost: response.unitCost, chargeMethod: response.chargeMethod, rateSystem: response.rateSystem }
}
