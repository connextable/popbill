import type {
  StatementAttachFileApiRequest,
  StatementAttachFileApiRequestBody,
  StatementAttachFileApiRequestPath,
  StatementAttachFileApiResponse,
} from './attach-file'

/**
 * 전자명세서 바이너리 파일 첨부 API(raw).
 * @see https://developers.popbill.com/api-reference/statement/api/etc#AttachFileBinary
 */
export interface StatementAttachFileBinaryPayload {
  fileName: string
  fileData: Buffer
}
export type StatementAttachFileBinaryApiRequestPath = StatementAttachFileApiRequestPath
export type StatementAttachFileBinaryApiRequestQuery = never
export type StatementAttachFileBinaryApiRequestBody = StatementAttachFileApiRequestBody
export type StatementAttachFileBinaryApiRequest = StatementAttachFileApiRequest
export type StatementAttachFileBinaryApiResponse = StatementAttachFileApiResponse
