import { promises as fs } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { createTaxinvoicePromiseService } from '@/factory/index'
import * as helpers from './helpers'

const bytes = Buffer.from([0, 13, 10, 34, 92, 128, 255])
const unusualNames = ['attachment.pdf', '견적 "최종".pdf', '견적 \\"최종".pdf', '견적\r\nX-Injected: value\r\n최종.pdf']

async function parseUpload(fetchMock: ReturnType<typeof helpers.stubApiResponse>): Promise<FormData> {
  const { init } = helpers.apiRequest(fetchMock)
  expect(init.method).toBe('POST')
  return new Response(init.body, { headers: init.headers }).formData()
}

async function expectFile(form: FormData, fileName: string, expectedBytes: Buffer): Promise<void> {
  expect([...form.keys()]).toEqual(['form', 'Filedata'])
  const file = form.get('Filedata')
  expect(file).toBeInstanceOf(File)
  if (!(file instanceof File)) throw new Error('Missing file part')
  expect(file.name).toBe(fileName)
  expect(Buffer.from(await file.arrayBuffer())).toEqual(expectedBytes)
}

describe('multipart filenames preserve attachment contents', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
    vi.restoreAllMocks()
  })

  test.each(unusualNames)('statement binary filename %j parses without changing file bytes', async (fileName) => {
    const fetchMock = helpers.stubApiResponse({ code: 1, message: 'attached' })
    await helpers.createStatementPromiseService(helpers.config()).attachFileBinary(helpers.CORP_NUM, 121, 'STMT-001', {
      fileName,
      fileData: bytes,
    })

    const form = await parseUpload(fetchMock)
    await expectFile(form, fileName, bytes)
    expect(form.get('form')).toBe('')
  })

  test.each(['statement', 'taxinvoice'] as const)('%s path upload preserves display name metadata and file bytes', async (service) => {
    const fetchMock = helpers.stubApiResponse({ code: 1, message: 'attached' })
    const displayName = '견적 \\"최종"\r\n사본.md'
    const filePath = fileURLToPath(new URL('../../README.md', import.meta.url))
    const fileBytes = await fs.readFile(filePath)
    if (service === 'statement') {
      await helpers.createStatementPromiseService(helpers.config()).attachFile(helpers.CORP_NUM, 121, 'STMT-001', displayName, filePath)
    } else {
      await createTaxinvoicePromiseService(helpers.config()).attachFile(helpers.CORP_NUM, 'SELL', 'INV-001', displayName, filePath)
    }

    const form = await parseUpload(fetchMock)
    await expectFile(form, displayName, fileBytes)
    const metadata = form.get('form')
    if (typeof metadata !== 'string') throw new Error('Expected JSON attachment metadata.')
    expect(JSON.parse(metadata)).toEqual({ DisplayName: displayName })
  })

  test('taxinvoice binary upload uses the same safe filename encoding', async () => {
    const fetchMock = helpers.stubApiResponse({ code: 1, message: 'attached' })
    const fileName = '견적 "최종".pdf'
    await createTaxinvoicePromiseService(helpers.config()).attachFileBinary(helpers.CORP_NUM, 'SELL', 'INV-001', { fileName, fileData: bytes })

    const form = await parseUpload(fetchMock)
    await expectFile(form, fileName, bytes)
    expect(form.get('form')).toBe('')
  })
})
