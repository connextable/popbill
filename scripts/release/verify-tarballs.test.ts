import { execFileSync, spawnSync } from 'node:child_process'
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs'
import { createRequire } from 'node:module'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { afterEach, expect, test } from 'vitest'
import { repoRoot } from './manifest-utils'

const require = createRequire(import.meta.url)
const jitiCli = path.join(path.dirname(require.resolve('jiti/package.json')), 'lib/jiti-cli.mjs')
const directories: string[] = []

const webhookDeclaration = `
  export declare class PopbillWebhookError extends Error { constructor(code: 'AUTHENTICATION_FAILED', message: string) }
  export declare function createPopbillWebhookReceiver(config: { authentication: { type: 'apiKey'; apiKey: string } | { type: 'none' } }): {
    parse(input: { headers: Record<string, string>; body: unknown }): { events: ({ kind: 'taxInvoice.state'; data: { stateCode?: number | string | null } } | { kind: 'unknown'; data: unknown })[] }
    createSuccessResponse(): { status: 200; body: string; headers: Record<string, string> }
  }
`
const webhookRuntime = `export function createPopbillWebhookReceiver() {
  return { parse() { return { events: [{ kind: 'taxInvoice.state', data: { stateCode: 300 } }] } },
    createSuccessResponse() { return { status: 200, headers: {}, body: '{"result":"OK"}' } } }
}`

const declarations: Record<string, string> = {
  popbill: `export declare function createPopbillClient(): {
    services: { common: { getMemberPointBalance(input: { businessNumber: string }): Promise<{ remainingPoints: string }> } }
  }`,
  'popbill-compat': `export declare function createTaxinvoicePromiseService(): {
    getUnitCost(businessNumber: string): Promise<string>
  }`,
  'popbill-juso': `export declare function createJusoLinkClient(): {
    services: { juso: { searchAddresses(input: { searchKeyword: string; pageSize: number }): Promise<{ addresses: { roadNameAddress: string }[] }> } }
  }`,
  'popbill-runtime': "export declare const LinkhubAuthScope: { readonly AddressSearch: '200' }",
  'popbill-spec': `export declare const JusoLinkAuthScopes: { readonly AddressSearch: '200' }
    export interface JusoLinkIssueTokenApiRequestBody { scope: string[] }`,
  'popbill-utils': 'export declare function sha1Base64(value: Uint8Array): string',
}

function createFixture(
  options: { missingDeclaration?: boolean; anyDeclaration?: boolean; brokenCommonJsEntry?: boolean; brokenWebhookEntry?: boolean } = {}
) {
  const directory = mkdtempSync(path.join(tmpdir(), 'popbill-package-check-'))
  directories.push(directory)
  const tarballs = path.join(directory, 'tarballs')
  mkdirSync(tarballs)

  for (const [index, [alias, declaration]] of Object.entries(declarations).entries()) {
    const sourceDir = path.join(directory, alias)
    const packageDir = path.join(sourceDir, 'package')
    mkdirSync(packageDir, { recursive: true })
    const files: Record<string, string> = {
      'index.mjs': 'export {}',
      'index.d.mts': alias === 'popbill-utils' && options.anyDeclaration ? 'export declare const sha1Base64: any' : declaration,
    }
    const exports: Record<string, unknown> = { '.': './index.mjs' }

    if (alias === 'popbill' || alias === 'popbill-spec') {
      exports['./webhook'] = './webhook.mjs'
      files['webhook.mjs'] = alias === 'popbill' ? (options.brokenWebhookEntry ? 'export {}' : webhookRuntime) : 'export {}'
      files['webhook.d.mts'] =
        alias === 'popbill'
          ? webhookDeclaration
          : `
        export declare const PopbillWebhookTypes: { readonly TaxInvoice: 'TAXINVOICE.STATE' }
        export interface TaxInvoiceStateWebhookBody { eventType?: string; itemKey?: string }
      `
    }

    if (alias === 'popbill-compat') {
      for (const entry of ['index', 'factory', 'errors']) {
        files[`${entry}.mjs`] = 'export {}'
        files[`${entry}.cjs`] =
          entry === 'errors' && options.brokenCommonJsEntry
            ? 'if (!globalThis.__popbillLoaded) throw new Error("isolated CJS entry is broken"); module.exports = {}'
            : 'globalThis.__popbillLoaded = true; module.exports = {}'
        files[`${entry}.d.mts`] = entry === 'factory' ? declaration : 'export {}'
        files[`${entry}.d.cts`] = files[`${entry}.d.mts`]!
        exports[entry === 'index' ? '.' : `./${entry}`] = {
          import: { types: `./${entry}.d.mts`, default: `./${entry}.mjs` },
          require: { types: `./${entry}.d.cts`, default: `./${entry}.cjs` },
        }
      }
    }

    if (alias === 'popbill-utils' && options.missingDeclaration) delete files['index.d.mts']
    for (const [fileName, content] of Object.entries(files)) writeFileSync(path.join(packageDir, fileName), content)
    writeFileSync(
      path.join(packageDir, 'package.json'),
      JSON.stringify({ name: `@connextable/${alias}`, version: '2.0.1', type: 'module', engines: { node: '>=20' }, types: './index.d.mts', exports })
    )
    // Discovery must use package.json, independently of source versions and archive file names.
    execFileSync('tar', ['-czf', path.join(tarballs, `archive-${index}.tgz`), '-C', sourceDir, 'package'])
  }

  return () =>
    spawnSync(process.execPath, [jitiCli, path.join(repoRoot, 'scripts/release/verify-tarballs.ts'), tarballs], {
      cwd: repoRoot,
      encoding: 'utf8',
      timeout: 30_000,
    })
}

afterEach(() => {
  for (const directory of directories.splice(0)) rmSync(directory, { recursive: true, force: true })
})

test('checks six packaged SDKs using archive metadata rather than workspace versions or file names', () => {
  const result = createFixture()()
  expect(result.status).toBe(0)
  expect(result.stdout).toContain('check:packages passed (packages=6,')
})

test('rejects a tarball whose public declaration file was omitted', () => {
  const result = createFixture({ missingDeclaration: true })()
  expect(result.status).not.toBe(0)
  expect(result.stderr).toContain('@connextable/popbill-utils tarball is missing ./index.d.mts')
})

test('rejects packaged public contracts that degraded to any', () => {
  const result = createFixture({ anyDeclaration: true })()
  expect(result.status).not.toBe(0)
  expect(result.stdout).toContain("Type 'true' does not satisfy the constraint 'false'")
})

test('checks CommonJS subpaths before another entrypoint can initialize their module state', () => {
  const result = createFixture({ brokenCommonJsEntry: true })()
  expect(result.status).not.toBe(0)
  expect(result.stderr).toContain('isolated CJS entry is broken')
})

test('rejects a webhook runtime export that differs from its declarations', () => {
  const result = createFixture({ brokenWebhookEntry: true })()
  expect(result.status).not.toBe(0)
  expect(result.stderr).toContain('createPopbillWebhookReceiver')
})
