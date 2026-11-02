import { url } from '../common'
import type { CommonRuntimeContext } from '../context'

export const createGetPopbillURL = (context: CommonRuntimeContext) => (corpNum: string, userIdOrToGo: string | undefined, toGo?: string) =>
  toGo === undefined ? url(context, corpNum, userIdOrToGo ?? '') : url(context, corpNum, toGo, userIdOrToGo)
