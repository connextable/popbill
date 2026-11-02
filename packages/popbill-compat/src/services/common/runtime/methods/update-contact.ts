import type * as Spec from '@connextable/popbill-spec'
import { request, required, parseInfoArgs } from '../common'
import type { CommonRuntimeContext } from '../context'

export const createUpdateContact =
  (context: CommonRuntimeContext) =>
  (corpNum: string, userIdOrInfo: string | Spec.CommonContactInputApiModel | undefined, info?: Spec.CommonContactInputApiModel) => {
    const parsed = parseInfoArgs(userIdOrInfo, info)
    required(parsed.info, '담당자 정보가 입력되지 않았습니다.')
    return request<Spec.CommonOperationApiResponse>(context, corpNum, '/IDs', parsed.userId, 'POST', parsed.info)
  }
