import { validateCorpNum } from '@/internal/validation'
import { documentPath } from '../common'
import type { CashbillRuntimeContext } from '../context'

export async function requestGetPdf(context: CashbillRuntimeContext, corpNum: string, mgtKey: string, userId?: string): Promise<Buffer> {
  const error = validateCorpNum(corpNum)
  if (error) throw error
  const bytes = await context.requestClient.requestBinary({ corpNum, uri: `${documentPath(mgtKey)}?PDF`, userId })
  return Buffer.from(bytes)
}
