import type { FaxRuntimeContext } from '../context'
import { parseSendOptions, send } from '../common'

export async function requestSendFax(context: FaxRuntimeContext, corpNum: string, ...args: unknown[]): Promise<string> {
  return send(context, corpNum, parseSendOptions(false, args), false)
}
