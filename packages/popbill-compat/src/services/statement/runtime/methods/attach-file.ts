import { promises as fs } from 'node:fs'
import { createLegacyValidationError } from '@/internal/errors'
import { documentPath, upload } from '@/services/statement/runtime/common'
import type { StatementRuntimeContext } from '@/services/statement/runtime/context'
import type { StatementItemCode } from '@/services/statement/types'
import type * as Spec from '@connextable/popbill-spec'

export async function requestAttachFile(
  context: StatementRuntimeContext,
  corpNum: string,
  itemCode: StatementItemCode,
  mgtKey: string,
  displayName: string,
  filePath: string,
  userId?: string
): Promise<Spec.StatementApiResponseBase> {
  documentPath(itemCode, mgtKey)
  if (typeof filePath !== 'string') throw createLegacyValidationError('첨부파일 경로는 문자열만 입력 가능합니다.')
  let fileData: Buffer
  try {
    fileData = await fs.readFile(filePath)
  } catch {
    throw createLegacyValidationError(`파일을 읽을 수 없습니다. [${filePath}]`)
  }
  return upload(context, corpNum, itemCode, mgtKey, filePath, fileData, userId, displayName)
}
