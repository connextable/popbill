import type { EasyFinBankJobStateApiModel } from '@connextable/popbill-spec'
import { jobPath, request } from '../common'
import type { EasyFinBankRuntimeContext } from '../context'

export async function requestGetJobState(
  context: EasyFinBankRuntimeContext,
  corpNum: string,
  jobId: string,
  userId?: string
): Promise<EasyFinBankJobStateApiModel> {
  return request(context, corpNum, `${jobPath(jobId)}/State`, userId)
}
