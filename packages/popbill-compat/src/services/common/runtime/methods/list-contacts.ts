import type * as Spec from '@connextable/popbill-spec'
import { request } from '../common'
import type { CommonRuntimeContext } from '../context'

export const createListContact = (context: CommonRuntimeContext) => (corpNum: string, userId?: string) =>
  request<Spec.CommonContactApiModel[]>(context, corpNum, '/IDs', userId)
