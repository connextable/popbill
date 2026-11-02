import type * as Spec from '@connextable/popbill-spec'
import { request, query } from '../common'
import type { CommonRuntimeContext } from '../context'

export const createCheckIsMember = (context: CommonRuntimeContext) => (corpNum: string) =>
  request<Spec.CommonOperationApiResponse>(context, undefined, '/Join?' + query({ CorpNum: corpNum, LID: context.linkId }))
