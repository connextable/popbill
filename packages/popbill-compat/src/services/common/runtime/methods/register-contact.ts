import type * as Spec from '@connextable/popbill-spec'
import { request, required, parseInfoArgs } from '../common'
import type { CommonRuntimeContext } from '../context'

export const createRegistContact =
  (context: CommonRuntimeContext) =>
  (corpNum: string, userIdOrInfo: string | Spec.CommonRegisterContactApiModel | undefined, info?: Spec.CommonRegisterContactApiModel) => {
    const parsed = parseInfoArgs(userIdOrInfo, info)
    required(parsed.info, '담당자 정보가 입력되지 않았습니다.')
    return request<Spec.CommonOperationApiResponse>(context, corpNum, '/IDs/New', parsed.userId, 'POST', parsed.info)
  }
