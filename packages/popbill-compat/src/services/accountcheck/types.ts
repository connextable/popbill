import type * as Spec from '@connextable/popbill-spec'
import type { LookupCallback, LookupCallbackWithUserId } from '@/internal/lookup-types'

type Success<TResult> = (result: TResult) => void
type Failure = (error: unknown) => void
interface AccountCostCallback<TResult> extends LookupCallback<[corpNum: string], TResult> {
  (corpNum: string, serviceType?: string, userId?: string): void
  (corpNum: string, serviceType: string, success: Success<TResult> | undefined, error?: Failure): void
  (corpNum: string, serviceType: undefined, success: Success<TResult> | undefined, error: Failure | undefined): void
  (corpNum: string, serviceType: string | undefined, userId: string, success: Success<TResult> | undefined, error?: Failure): void
  (
    corpNum: string,
    serviceType: string | undefined,
    userId: string | undefined,
    success: Success<TResult> | undefined,
    error: Failure | undefined
  ): void
}

export interface AccountCheckCallbackService {
  checkAccountInfo: LookupCallbackWithUserId<[corpNum: string, bankCode: string, accountNumber: string], Spec.AccountCheckCheckAccountInfoApiResponse>
  checkDepositorInfo: LookupCallbackWithUserId<
    [corpNum: string, bankCode: string, accountNumber: string, identityNumType: string, identityNum: string],
    Spec.AccountCheckCheckDepositorInfoApiResponse
  >
  getChargeInfo: AccountCostCallback<Spec.AccountCheckChargeInfoApiResponse>
  getUnitCost: AccountCostCallback<string>
}

export interface AccountCheckPromiseService {
  checkAccountInfo(corpNum: string, bankCode: string, accountNumber: string, userId?: string): Promise<Spec.AccountCheckCheckAccountInfoApiResponse>
  checkDepositorInfo(
    corpNum: string,
    bankCode: string,
    accountNumber: string,
    identityNumType: string,
    identityNum: string,
    userId?: string
  ): Promise<Spec.AccountCheckCheckDepositorInfoApiResponse>
  getChargeInfo(corpNum: string, serviceType?: string, userId?: string): Promise<Spec.AccountCheckChargeInfoApiResponse>
  getUnitCost(corpNum: string, serviceType?: string, userId?: string): Promise<string>
}
