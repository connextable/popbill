import { spawnSync } from 'node:child_process'
import { cpSync, existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { createRequire } from 'node:module'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { afterEach, expect, test } from 'vitest'

const repoRoot = fileURLToPath(new URL('../../', import.meta.url))
const require = createRequire(import.meta.url)
const jitiCli = path.join(path.dirname(require.resolve('jiti/package.json')), 'lib/jiti-cli.mjs')
const directories: string[] = []

function createFixture() {
  const directory = mkdtempSync(path.join(tmpdir(), 'popbill-sdk-docs-'))
  directories.push(directory)

  for (const packageName of ['popbill', 'popbill-compat']) {
    const packageDirectory = path.join(directory, 'packages', packageName)
    mkdirSync(packageDirectory, { recursive: true })
    cpSync(path.join(repoRoot, 'packages', packageName, 'package.json'), path.join(packageDirectory, 'package.json'))
    cpSync(path.join(repoRoot, 'packages', packageName, 'src/services'), path.join(packageDirectory, 'src/services'), { recursive: true })
    cpSync(path.join(repoRoot, 'packages', packageName, 'src/internal'), path.join(packageDirectory, 'src/internal'), { recursive: true })
    if (packageName === 'popbill')
      cpSync(path.join(repoRoot, 'packages/popbill/src/webhook'), path.join(packageDirectory, 'src/webhook'), { recursive: true })
  }
  cpSync(path.join(repoRoot, 'packages/popbill-utils/src'), path.join(directory, 'packages/popbill-utils/src'), { recursive: true })
  cpSync(path.join(repoRoot, 'packages/popbill-runtime/src'), path.join(directory, 'packages/popbill-runtime/src'), { recursive: true })

  return {
    directory,
    read: (file: string) => readFileSync(path.join(directory, 'docs/sdk', file), 'utf8'),
    run: () =>
      spawnSync(process.execPath, [jitiCli, path.join(repoRoot, 'scripts/generate-sdk-docs.ts')], {
        cwd: directory,
        encoding: 'utf8',
        timeout: 20_000,
      }),
  }
}

afterEach(() => {
  for (const directory of directories.splice(0)) rmSync(directory, { recursive: true, force: true })
})

test('documents standalone webhook signatures and imported DTOs without fabricating compat mappings', () => {
  const fixture = createFixture()
  const result = fixture.run()
  expect({ status: result.status, stderr: result.stderr }).toEqual({ status: 0, stderr: '' })
  const webhookDoc = fixture.read('popbill/webhook/index.md')
  expect(webhookDoc).toContain('createPopbillWebhookReceiver(config: PopbillWebhookReceiverConfig): PopbillWebhookReceiver')
  expect(webhookDoc.indexOf('## Factory')).toBeGreaterThan(0)
  expect(webhookDoc.indexOf('## Factory')).toBeLessThan(webhookDoc.indexOf('## Webhook'))
  expect(webhookDoc.indexOf('`parse`')).toBeLessThan(webhookDoc.indexOf('`createSuccessResponse`'))
  expect(fixture.read('popbill/webhook/methods/parse.md')).toContain('PopbillWebhookMessage')
  const schema = JSON.parse(fixture.read('generated/schemas/popbill/webhook/types/popbill-webhook-message.json')) as {
    properties: { name: string }[]
  }
  expect(schema.properties.map((field) => field.name)).toEqual(
    expect.arrayContaining(['messageId', 'businessNumber', 'webhookType', 'events', 'rawBody'])
  )
  const index = JSON.parse(fixture.read('generated/method-index.json')) as { methods: { service: string; methodName: string }[] }
  expect(index.methods.filter((method) => method.service === 'webhook').map((method) => method.methodName)).toEqual([
    'parse',
    'createSuccessResponse',
  ])
  expect(fixture.read('generated/compat-map.json')).not.toContain('webhook')
})

test('generates every service independently of package versions and preserves unrelated output', () => {
  const fixture = createFixture()
  const preservedFile = path.join(fixture.directory, 'docs/sdk/popbill/future-service/index.md')
  mkdirSync(path.dirname(preservedFile), { recursive: true })
  writeFileSync(preservedFile, 'Other service documentation')

  const result = fixture.run()
  expect({ status: result.status, stderr: result.stderr }).toEqual({ status: 0, stderr: '' })
  const index = JSON.parse(fixture.read('generated/method-index.json')) as {
    methods: { service: string; methodName: string; callback?: unknown }[]
  }
  for (const [service, methodName] of [
    ['taxInvoice', 'issueInvoiceImmediately'],
    ['statement', 'issueStatementImmediately'],
    ['TaxinvoiceService', 'registIssue'],
    ['StatementService', 'registIssue'],
  ]) {
    expect(index.methods.filter((method) => method.service === service && method.methodName === methodName)).toHaveLength(1)
  }
  expect(index.methods.filter((method) => method.service === 'StatementService').every((method) => method.callback !== null)).toBe(true)

  const mappings = JSON.parse(fixture.read('generated/compat-map.json')) as {
    mappings: { service: string; compatMethodName: string; modernMethodName: string }[]
  }
  expect(
    mappings.mappings.filter((mapping) => mapping.compatMethodName === 'registIssue' && ['taxInvoice', 'statement'].includes(mapping.service))
  ).toEqual([
    expect.objectContaining({ service: 'taxInvoice', modernMethodName: 'issueInvoiceImmediately' }),
    expect.objectContaining({ service: 'statement', modernMethodName: 'issueStatementImmediately' }),
  ])
  expect(fixture.read('popbill/statement/index.md')).toContain('issueStatementImmediately')
  expect(fixture.read('popbill-compat/statement/index.md')).toContain('registIssue')
  expect(fixture.read('popbill-compat/statement/methods/get-info.md')).toContain(
    'getInfo(corpNum: string, itemCode: StatementItemCode, mgtKey: string, userId?: string)'
  )
  const infoSchema = JSON.parse(fixture.read('generated/schemas/popbill-compat/statement/methods/get-info.json')) as {
    callback: { overloadCount: number }
  }
  // Three user-ID overloads extend the two overloads available without an explicit user ID.
  expect(infoSchema.callback.overloadCount).toBe(5)
  const methodSchema = JSON.parse(fixture.read('generated/schemas/popbill-compat/statement/methods/attach-statement.json')) as {
    parameters: { name: string; optional: boolean }[]
  }
  expect(methodSchema.parameters).toEqual([
    expect.objectContaining({ name: 'corpNum', optional: false }),
    expect.objectContaining({ name: 'itemCode', optional: false }),
    expect.objectContaining({ name: 'mgtKey', optional: false }),
    expect.objectContaining({ name: 'subItemCode', optional: false }),
    expect.objectContaining({ name: 'subMgtKey', optional: false }),
    expect.objectContaining({ name: 'userId', optional: true }),
  ])
  const searchSchema = JSON.parse(fixture.read('generated/schemas/popbill-compat/statement/methods/search.json')) as {
    overloads: { parameters: { name: string; type: string; optional: boolean }[] }[]
  }
  expect(searchSchema.overloads.map((overload) => overload.parameters.map((parameter) => parameter.name))).toEqual([
    ['corpNum', 'dType', 'sDate', 'eDate', 'state', 'itemCode', 'qString', 'order', 'page', 'perPage', 'userId'],
    ['corpNum', 'dType', 'sDate', 'eDate', 'state', 'itemCode', 'order', 'page', 'perPage', 'userId'],
    ['corpNum', 'dType', 'sDate', 'eDate', 'state', 'itemCode', 'qString', 'order', 'page', 'perPage', 'userId'],
  ])
  expect(searchSchema.overloads[0]?.parameters.find((parameter) => parameter.name === 'page')).toMatchObject({ optional: true })
  // Full searches with a default Order keep the explicit UserID slot to distinguish the short form.
  expect(searchSchema.overloads[2]?.parameters.find((parameter) => parameter.name === 'order')).toMatchObject({ type: 'undefined', optional: false })
  expect(searchSchema.overloads[2]?.parameters.find((parameter) => parameter.name === 'userId')).toMatchObject({ optional: false })
  const inputSchema = JSON.parse(fixture.read('generated/schemas/popbill/statement/types/statement-document-input.json')) as {
    properties: { name: string; jsonType: string }[]
  }
  expect(inputSchema.properties.map((property) => property.name)).toContain('documentTypeCode')
  expect(inputSchema.properties.find((property) => property.name === 'sendTextMessage')).toMatchObject({ jsonType: 'boolean' })
  const smsSchema = JSON.parse(fixture.read('generated/schemas/popbill/statement/types/resend-statement-sms-input.json')) as {
    properties: { name: string; required: boolean }[]
  }
  expect(smsSchema.properties.find((property) => property.name === 'messageBody')).toMatchObject({ required: true })
  const outputSchema = JSON.parse(fixture.read('generated/schemas/popbill/statement/types/statement-document-output.json')) as {
    properties: { name: string; required: boolean; typeText: string; jsonType: string }[]
  }
  expect(outputSchema.properties).toContainEqual(expect.objectContaining({ name: 'documentTypeCode', required: false }))
  expect(outputSchema.properties).toContainEqual(expect.objectContaining({ name: 'sender', required: false }))
  const outputPropertyNames = outputSchema.properties.map((property) => property.name)
  expect(outputPropertyNames[0]).toBe('documentTypeCode')
  expect(outputPropertyNames.indexOf('taxType')).toBeLessThan(outputPropertyNames.indexOf('sender'))
  expect(outputSchema.properties.find((property) => property.name === 'taxType')).toMatchObject({ typeText: 'string | null', jsonType: 'union' })
  expect(outputSchema.properties.find((property) => property.name === 'sendTextMessage')).toMatchObject({
    typeText: 'ProviderBoolean',
    jsonType: 'union',
  })
  const outputDoc = fixture.read('popbill/statement/methods/get-statement-detail-info.md')
  expect(outputDoc).toContain('### `sendTextMessage`')
  expect(outputDoc).toContain('타입: `ProviderBoolean`')
  expect(outputDoc).not.toContain('| Field |')
  expect(outputDoc).not.toContain('```json')
  expect(fixture.read('popbill/kakao/index.md')).not.toContain('설명 없음')
  const providerBoolean = JSON.parse(fixture.read('generated/schemas/popbill/statement/types/provider-boolean.json')) as {
    typeText: string
  }
  expect(providerBoolean.typeText).toBe('boolean | string | number | null')
  expect(existsSync(preservedFile)).toBe(true)

  const staleFile = path.join(fixture.directory, 'docs/sdk/popbill/statement/methods/removed-method.md')
  writeFileSync(staleFile, 'Stale method documentation')
  const readme = fixture.read('README.md')
  for (const packageName of ['popbill', 'popbill-compat']) {
    const manifestPath = path.join(fixture.directory, 'packages', packageName, 'package.json')
    const manifest = JSON.parse(readFileSync(manifestPath, 'utf8')) as { version: string }
    writeFileSync(manifestPath, JSON.stringify({ ...manifest, version: '999.0.0' }))
  }
  const secondRun = fixture.run()
  expect({ status: secondRun.status, stderr: secondRun.stderr }).toEqual({ status: 0, stderr: '' })
  expect(existsSync(staleFile)).toBe(false)
  expect(existsSync(preservedFile)).toBe(true)
  expect(fixture.read('README.md')).toEqual(readme)
  expect(fixture.read('generated/method-index.json')).toEqual(JSON.stringify(index, null, 2) + '\n')
})

test('includes all service methods and supports mapped services, imported callbacks, and type files beyond index', () => {
  const fixture = createFixture()
  const result = fixture.run()
  expect({ status: result.status, stderr: result.stderr }).toEqual({ status: 0, stderr: '' })
  const index = JSON.parse(fixture.read('generated/method-index.json')) as {
    methods: {
      sdk: string
      service: string
      methodName: string
      group: string
      outputType?: string
      compatMethodName?: string | null
      required?: boolean
      callback?: { overloadCount: number | null } | null
    }[]
  }
  const expectedServices: [string, string, number, number][] = [
    ['taxInvoice', 'TaxinvoiceService', 55, 55],
    ['statement', 'StatementService', 34, 34],
    ['common', 'CommonService', 26, 27],
    ['cashbill', 'CashbillService', 33, 33],
    ['message', 'MessageService', 20, 29],
    ['fax', 'FaxService', 16, 17],
    ['kakao', 'KakaoService', 52, 53],
    ['homeTaxTaxInvoice', 'HTTaxinvoiceService', 19, 19],
    ['homeTaxCashbill', 'HTCashbillService', 15, 15],
    ['easyFinBank', 'EasyFinBankService', 17, 17],
    ['closedown', 'ClosedownService', 4, 4],
    ['bizInfoCheck', 'BizInfoCheckService', 3, 3],
    ['accountCheck', 'AccountCheckService', 4, 4],
  ]
  expect(new Set(index.methods.map((method) => `${method.sdk}.${method.service}`)).size).toBe(expectedServices.length * 2 + 1)
  for (const [modern, compat, modernCount, compatCount] of expectedServices) {
    expect(index.methods.filter((method) => method.sdk === 'popbill' && method.service === modern)).toHaveLength(modernCount)
    const compatMethods = index.methods.filter((method) => method.sdk === 'popbill-compat' && method.service === compat)
    expect(compatMethods).toHaveLength(compatCount)
    expect(compatMethods.every((method) => method.callback !== null)).toBe(true)
    expect(compatMethods.every((method) => method.required === true)).toBe(true)
  }
  expect(index.methods.every((method) => method.group && method.group !== '기타')).toBe(true)
  for (const [service, methodName, group] of [
    ['common', 'registerMember', '회원관리'],
    ['CommonService', 'joinMember', '회원관리'],
    ['message', 'sendShortMessage', '메시지 전송'],
    ['MessageService', 'getMessages', '결과조회'],
    ['homeTaxTaxInvoice', 'requestCollection', '수집 요청/상태'],
    ['homeTaxTaxInvoice', 'getTaxInvoicePrintUrl', '보기/인쇄'],
    ['HTCashbillService', 'requestJob', '수집 요청/상태'],
    ['HTTaxinvoiceService', 'getPrintURL', '보기/인쇄'],
  ]) {
    expect(index.methods.find((method) => method.service === service && method.methodName === methodName)?.group).toBe(group)
  }
  const kakao = JSON.parse(fixture.read('generated/schemas/popbill-compat/kakao/methods/send-ats-one.json')) as {
    parameters: { name: string; type: string; optional: boolean }[]
    outputType: string
    callback: { overloadCount: number | null }
  }
  expect(kakao.parameters).toContainEqual({ name: 'templateCode', type: 'string', optional: false })
  // Canonical send overloads retain the UserID slot; shorter legacy overloads are listed separately.
  expect(kakao.parameters).toContainEqual({ name: 'userId', type: 'string | undefined', optional: false })
  expect(kakao.outputType).toBe('string')
  // Conditional callback tuple recursion is deliberately left unresolved.
  expect(kakao.callback.overloadCount).toBeNull()
  expect(index.methods.find((method) => method.service === 'ClosedownService' && method.methodName === 'checkCorpNum')?.callback).toMatchObject({
    overloadCount: 6,
  })
  expect(fixture.read('popbill/kakao/methods/send-brand-text-messages.md')).toContain('sendBrandTextMessages')
  const friendInput = JSON.parse(fixture.read('generated/schemas/popbill/kakao/types/send-friend-image-message-request.json')) as {
    properties: { name: string; required: boolean }[]
  }
  expect(friendInput.properties).toContainEqual(expect.objectContaining({ name: 'receiverPhoneNumber', required: true }))
  expect(friendInput.properties).toContainEqual(expect.objectContaining({ name: 'referenceKey', required: false }))
  expect(fixture.read('popbill-compat/kakao/methods/send-fms-one.md')).not.toContain('legacy 전용')
  const commonInput = JSON.parse(fixture.read('generated/schemas/popbill/common/types/register-member-input.json')) as {
    properties: { name: string }[]
  }
  expect(commonInput.properties.map((property) => property.name)).toContain('businessNumber')
  const expiration = JSON.parse(fixture.read('generated/schemas/popbill/home-tax-cashbill/types/home-tax-cashbill-certificate-expiration.json')) as {
    properties: { name: string; typeText: string }[]
  }
  expect(expiration.properties).toContainEqual(expect.objectContaining({ name: 'expiresAt', typeText: 'string' }))
  const message = JSON.parse(fixture.read('generated/schemas/popbill-compat/message/methods/send-message.json')) as {
    mappedModernMethodNames: string[]
  }
  expect(message.mappedModernMethodNames).toEqual(['sendShortMessage', 'sendLongMessage', 'sendAutoLengthMessage'])
  const messageStates = index.methods.find((method) => method.service === 'message' && method.methodName === 'getMessageStatesByReceiptNumbers')
  expect(messageStates).toMatchObject({ outputType: 'unknown', compatMethodName: 'getStates' })
  const emailPublicKeys = JSON.parse(fixture.read('generated/schemas/popbill/tax-invoice/types/tax-invoice-email-public-keys.json')) as {
    properties: { name: string; typeText: string }[]
  }
  expect(emailPublicKeys.properties).toContainEqual(expect.objectContaining({ name: 'publicKeys', typeText: 'unknown' }))
  const compatMap = JSON.parse(fixture.read('generated/compat-map.json')) as {
    mappings: { service: string; modernMethodName: string; compatMethodName: string }[]
  }
  for (const [service, modernMethodName, compatMethodName] of [
    ['taxInvoice', 'sendInvoice', 'send'],
    ['taxInvoice', 'cancelInvoiceSend', 'cancelSend'],
    ['taxInvoice', 'acceptInvoice', 'accept'],
    ['taxInvoice', 'denyInvoice', 'deny'],
    ['taxInvoice', 'getLegacyInvoicePrintURL', 'getOldPrintURL'],
    ['taxInvoice', 'getEmailPublicKeys', 'getEmailPublicKeys'],
    ['kakao', 'sendFriendTextMessage', 'sendFTS_same'],
    ['kakao', 'sendFriendTextMessages', 'sendFTS_multi'],
    ['kakao', 'sendIdenticalFriendTextMessages', 'sendFTS_same'],
    ['kakao', 'sendFriendImageMessage', 'sendFMS_same'],
    ['kakao', 'sendFriendImageMessages', 'sendFMS_multi'],
    ['kakao', 'sendIdenticalFriendImageMessages', 'sendFMS_same'],
    ['message', 'getMessageStatesByReceiptNumbers', 'getStates'],
  ]) {
    expect(compatMap.mappings).toContainEqual(expect.objectContaining({ service, modernMethodName, compatMethodName }))
  }
  // Cancellation requires either a whole cancellation or a partial cancellation with payment amounts.
  // Preserve the intersection and union dependency instead of guessing a flat required-field table.
  expect(fixture.read('popbill/cashbill/methods/revoke-cashbill.md')).toContain('CashbillCancellationAmounts &')
})

test('discovers nested public types and preserves unresolved callback counts', () => {
  const fixture = createFixture()
  const typeDirectory = path.join(fixture.directory, 'packages/popbill/src/services/home-tax-cashbill/types/nested')
  mkdirSync(typeDirectory)
  writeFileSync(path.join(typeDirectory, 'additional.ts'), 'export interface AdditionalPublicInput { identity: string }\n')
  const callbackPath = path.join(fixture.directory, 'packages/popbill-compat/src/services/closedown/types.ts')
  writeFileSync(
    callbackPath,
    readFileSync(callbackPath, 'utf8').replace('getUnitCost: LookupCallback<[corpNum: string], string>', 'getUnitCost: UnavailableExternalCallback')
  )
  const result = fixture.run()
  expect({ status: result.status, stderr: result.stderr }).toEqual({ status: 0, stderr: '' })
  expect(fixture.read('generated/schemas/popbill/home-tax-cashbill/types/additional-public-input.json')).toContain('identity')
  const callbackSchema = JSON.parse(fixture.read('generated/schemas/popbill-compat/closedown/methods/get-unit-cost.json')) as {
    callback: { overloadCount: number | null }
  }
  expect(callbackSchema.callback.overloadCount).toBeNull()
})

test('fails when a listed service method lacks a public signature', () => {
  const fixture = createFixture()
  writeFileSync(
    path.join(fixture.directory, 'packages/popbill/src/services/statement/methods.ts'),
    "export const STATEMENT_METHODS = ['missingMethod'] as const\n"
  )

  const result = fixture.run()
  expect(result.status).not.toBe(0)
  expect(result.stderr).toContain('StatementService.missingMethod is listed but has no public signature')
})

test('fails rather than silently omitting a public method from the reference', () => {
  const fixture = createFixture()
  const methodsPath = path.join(fixture.directory, 'packages/popbill/src/services/statement/methods.ts')
  writeFileSync(methodsPath, readFileSync(methodsPath, 'utf8').replace(/\s*'getUnitCost',?/, ''))

  const result = fixture.run()
  expect(result.status).not.toBe(0)
  expect(result.stderr).toContain('StatementService.getUnitCost has a public signature but is not listed')
})

test('rejects duplicated method entries and mappings to missing compat methods', () => {
  const fixture = createFixture()
  const methodsPath = path.join(fixture.directory, 'packages/popbill/src/services/statement/methods.ts')
  const methods = readFileSync(methodsPath, 'utf8')
  writeFileSync(methodsPath, methods.replace("'getUnitCost'", "'getUnitCost', 'getUnitCost'"))
  const duplicate = fixture.run()
  expect(duplicate.status).not.toBe(0)
  expect(duplicate.stderr).toContain('StatementService.getUnitCost is listed more than once')

  writeFileSync(methodsPath, methods)
  const typesPath = path.join(fixture.directory, 'packages/popbill/src/services/statement/types/index.ts')
  writeFileSync(typesPath, readFileSync(typesPath, 'utf8').replace('Compat: `getUnitCost`', 'Compat: `missingCompatMethod`'))
  const mapping = fixture.run()
  expect(mapping.status).not.toBe(0)
  expect(mapping.stderr).toContain('StatementService.getUnitCost maps to missing StatementService.missingCompatMethod')
})

test('keeps compat parameter types from source instead of substituting handwritten constraints', () => {
  const fixture = createFixture()
  const result = fixture.run()
  expect({ status: result.status, stderr: result.stderr }).toEqual({ status: 0, stderr: '' })
  const schema = JSON.parse(fixture.read('generated/schemas/popbill-compat/taxinvoice/methods/send-to-nts.json')) as {
    parameters: { name: string; type: string }[]
  }
  expect(schema.parameters.find((parameter) => parameter.name === 'keyType')?.type).toBe('TaxinvoiceOutboundDocumentKeyType')
})

test('retains rest notation and metadata when a rest type cannot be expanded to named tuple parameters', () => {
  const fixture = createFixture()
  const typesPath = path.join(fixture.directory, 'packages/popbill-compat/src/services/statement/types.ts')
  const types = readFileSync(typesPath, 'utf8')
  writeFileSync(
    typesPath,
    types.replace('getChargeInfo(corpNum: string, itemCode: StatementItemCode, userId?: string)', 'getChargeInfo(...args: string[])')
  )

  const result = fixture.run()
  expect({ status: result.status, stderr: result.stderr }).toEqual({ status: 0, stderr: '' })
  expect(fixture.read('popbill-compat/statement/methods/get-charge-info.md')).toContain('getChargeInfo(...args: string[])')
  const schema = JSON.parse(fixture.read('generated/schemas/popbill-compat/statement/methods/get-charge-info.json')) as {
    parameters: { name: string; rest?: boolean }[]
  }
  expect(schema.parameters).toEqual([expect.objectContaining({ name: 'args', rest: true })])
})

test('retains unresolved indexed tuple cycles without recursion or invented parameters', () => {
  const fixture = createFixture()
  const typesPath = path.join(fixture.directory, 'packages/popbill-compat/src/services/statement/types.ts')
  writeFileSync(
    typesPath,
    readFileSync(typesPath, 'utf8').replace(
      'getChargeInfo(corpNum: string, itemCode: StatementItemCode, userId?: string)',
      'getChargeInfo(...args: CircularTuple["arguments"])'
    ) + '\ninterface CircularTuple { arguments: CircularTuple["arguments"] }\n'
  )
  const result = fixture.run()
  expect({ status: result.status, stderr: result.stderr }).toEqual({ status: 0, stderr: '' })
  const schema = JSON.parse(fixture.read('generated/schemas/popbill-compat/statement/methods/get-charge-info.json')) as {
    parameters: { name: string; rest?: boolean; type: string }[]
  }
  expect(schema.parameters).toEqual([{ name: 'args', rest: true, type: 'CircularTuple["arguments"]', optional: false }])
})
