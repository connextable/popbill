import type { EasyFinBankJobStateApiModel } from '@connextable/popbill-spec'
import { request } from '../common'
import type { EasyFinBankRuntimeContext } from '../context'

export async function requestListActiveJob(
  context: EasyFinBankRuntimeContext,
  corpNum: string,
  userId?: string
): Promise<EasyFinBankJobStateApiModel[]> {
  return request(context, corpNum, '/EasyFin/Bank/JobList', userId)
}
