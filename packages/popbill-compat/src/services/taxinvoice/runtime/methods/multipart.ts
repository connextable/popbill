import path from 'node:path'

const CRLF = '\r\n'

interface MultipartPayload {
  body: Buffer
  contentType: string
}

export function buildSingleFileMultipartPayload(options: {
  filePathOrName: string
  fileData: Buffer
  displayName?: string
  formData?: string
}): MultipartPayload {
  const boundary = `----POPBILL-COMPAT-${Date.now()}-${Math.random().toString(16).slice(2)}`
  const formData = options.formData ?? ''
  const fileName = options.displayName || path.basename(options.filePathOrName)

  const chunks: Buffer[] = [
    Buffer.from(`--${boundary}${CRLF}`),
    Buffer.from(`Content-Disposition: form-data; name="form"${CRLF}${CRLF}`),
    Buffer.from(formData),
    Buffer.from(CRLF),
    Buffer.from(`--${boundary}${CRLF}`),
    Buffer.from(`Content-Disposition: form-data; name="Filedata"; filename="${fileName}";${CRLF}`, 'utf8'),
    Buffer.from(`Content-Type: Application/octet-stream${CRLF}${CRLF}`),
    options.fileData,
    Buffer.from(CRLF),
    Buffer.from(`--${boundary}--${CRLF}`),
  ]

  return {
    body: Buffer.concat(chunks),
    contentType: `multipart/form-data;charset=utf-8; boundary=${boundary}`,
  }
}
