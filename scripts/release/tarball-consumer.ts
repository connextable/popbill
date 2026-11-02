import { execFileSync } from 'node:child_process'
import fs from 'node:fs'
import { createRequire } from 'node:module'
import path from 'node:path'
import { repoRoot } from './manifest-utils'

const require = createRequire(import.meta.url)
const compilerPath = path.join(path.dirname(require.resolve('typescript/package.json')), 'bin', 'tsc')

// Compile these examples against the extracted packages, without workspace source aliases.
// Explicit any checks catch declarations that silently degrade when dependencies were not built.
const consumerSource = `
import { createPopbillClient } from '@connextable/popbill'
import { createTaxinvoicePromiseService } from '@connextable/popbill-compat/factory'
import { createJusoLinkClient } from '@connextable/popbill-juso'
import { LinkhubAuthScope } from '@connextable/popbill-runtime'
import { JusoLinkAuthScopes, type JusoLinkIssueTokenApiRequestBody } from '@connextable/popbill-spec'
import { sha1Base64 } from '@connextable/popbill-utils'

type IsAny<T> = 0 extends (1 & T) ? true : false
type RejectAny<T extends false> = T
type ModernClient = ReturnType<typeof createPopbillClient>
type LegacyService = ReturnType<typeof createTaxinvoicePromiseService>
type JusoClient = ReturnType<typeof createJusoLinkClient>

export type PublicContractsRemainTyped = [
  RejectAny<IsAny<typeof LinkhubAuthScope>>,
  RejectAny<IsAny<typeof JusoLinkAuthScopes>>,
  RejectAny<IsAny<ModernClient>>,
  RejectAny<IsAny<LegacyService>>,
  RejectAny<IsAny<JusoClient>>,
  RejectAny<IsAny<Awaited<ReturnType<LegacyService['getUnitCost']>>>>,
  RejectAny<IsAny<Awaited<ReturnType<ModernClient['services']['common']['getMemberPointBalance']>>['remainingPoints']>>,
  RejectAny<IsAny<Awaited<ReturnType<JusoClient['services']['juso']['searchAddresses']>>['addresses'][number]['roadNameAddress']>>,
  RejectAny<IsAny<ReturnType<typeof sha1Base64>>>,
]

const scope: '200' = LinkhubAuthScope.AddressSearch
const tokenBody: JusoLinkIssueTokenApiRequestBody = { scope: [JusoLinkAuthScopes.AddressSearch] }
void scope
void tokenBody
// Address-search authentication omits a member's business number.
// @ts-expect-error JusoLink does not accept access_id.
const memberTokenBody: JusoLinkIssueTokenApiRequestBody = { scope: ['200'], access_id: '1234567890' }
void memberTokenBody

declare const modern: ModernClient
declare const legacy: LegacyService
declare const juso: JusoClient
modern.services.common.getMemberPointBalance({ businessNumber: '1234567890' }).then((balance) => {
  const remainingPoints: string = balance.remainingPoints
  return remainingPoints
})
// @ts-expect-error Modern methods take an object with a string business number.
modern.services.common.getMemberPointBalance({ businessNumber: 1234567890 })
const unitCost: Promise<string> = legacy.getUnitCost('1234567890')
void unitCost
// @ts-expect-error The legacy unit-cost endpoint has no UserID parameter.
legacy.getUnitCost('1234567890', 'user-id')
juso.services.juso.searchAddresses({ searchKeyword: '삼성동', pageSize: 20 })
// @ts-expect-error Pagination is numeric in the object API.
juso.services.juso.searchAddresses({ searchKeyword: '삼성동', pageSize: '20' })
const digest: string = sha1Base64(new Uint8Array([97, 98, 99]))
void digest
`

export function verifyTarballConsumerTypes(consumerDir: string): void {
  const consumerFilePath = path.join(consumerDir, 'consumer-contracts.mts')
  fs.writeFileSync(consumerFilePath, consumerSource, 'utf8')
  execFileSync(
    process.execPath,
    [
      compilerPath,
      '--noEmit',
      '--strict',
      '--skipLibCheck',
      '--target',
      'ES2022',
      '--module',
      'NodeNext',
      '--moduleResolution',
      'NodeNext',
      '--types',
      'node',
      '--typeRoots',
      path.join(repoRoot, 'node_modules/@types'),
      consumerFilePath,
    ],
    { cwd: consumerDir, timeout: 30_000, env: {}, stdio: 'inherit' }
  )
}
