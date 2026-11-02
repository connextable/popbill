import type * as Spec from '@connextable/popbill-spec'
import { request } from '../common'
import type { CommonRuntimeContext } from '../context'

export const createGetCorpInfo = (context: CommonRuntimeContext) => (corpNum: string, userId?: string) =>
  request<Spec.CommonCorpInfoApiModel>(context, corpNum, '/CorpInfo', userId)
