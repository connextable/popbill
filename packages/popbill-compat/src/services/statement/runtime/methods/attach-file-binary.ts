import { createLegacyValidationError } from '@/internal/errors'
import { upload } from '@/services/statement/runtime/common'
import type { StatementRuntimeContext } from '@/services/statement/runtime/context'
import type { StatementBinaryFile, StatementItemCode } from '@/services/statement/types'
import type * as Spec from '@connextable/popbill-spec'

export async function requestAttachFileBinary(
  context: StatementRuntimeContext,
  corpNum: string,
  itemCode: StatementItemCode,
  mgtKey: string,
  binaryFile: StatementBinaryFile,
  userId?: string
): Promise<Spec.StatementApiResponseBase> {
  if (!binaryFile || typeof binaryFile !== 'object') throw createLegacyValidationError('첨부파일 정보가 입력되지 않았습니다.')
  return upload(context, corpNum, itemCode, mgtKey, binaryFile.fileName, binaryFile.fileData, userId)
}
