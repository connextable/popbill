import type * as Spec from '@connextable/popbill-spec'
import { request, required, parseInfoArgs } from '../common'
import type { CommonRuntimeContext } from '../context'

export const createUpdateCorpInfo =
  (context: CommonRuntimeContext) =>
  (corpNum: string, userIdOrInfo: string | Spec.CommonCorpInfoApiModel | undefined, info?: Spec.CommonCorpInfoApiModel) => {
    const parsed = parseInfoArgs(userIdOrInfo, info)
    required(parsed.info, '회사 정보가 입력되지 않았습니다.')
    return request<Spec.CommonOperationApiResponse>(context, corpNum, '/CorpInfo', parsed.userId, 'POST', parsed.info)
  }
