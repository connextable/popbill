import fs from 'node:fs'
import path from 'node:path'
import * as ts from '@typescript/typescript6'

type JsonPrimitive = string | number | boolean | null

interface PackageManifest {
  version: string
}

interface MethodGroupItem {
  name: string
  group: string
}

interface MethodParameter {
  name: string
  optional: boolean
  typeText: string
  rest?: boolean
}

interface MethodOverloadInfo {
  parameters: MethodParameter[]
  returnTypeText: string
  promiseReturnType: string | null
  signature: string
}

interface MethodSignatureInfo extends MethodOverloadInfo {
  name: string
  summary: string
  compatMethodName: string | null
  overloads: MethodOverloadInfo[]
}

interface CallbackMetadata {
  typeText: string
  typeName: string | null
  overloadCount: number | null
}

interface CompatMappingItem {
  service: string
  modernMethodName: string
  compatMethodName: string
  group: string
  summary: string
}

interface SourceWithAst {
  filePath: string
  text: string
  ast: ts.SourceFile
}

interface TypeProperty {
  name: string
  typeText: string
  optional: boolean
  required: boolean
  description: string
}

type EnumValue = JsonPrimitive | { key: string; value: JsonPrimitive }

interface TypeDefinition {
  kind: 'interface' | 'typeAlias'
  name: string
  description: string
  filePath: string
  typeText: string
  aliasOf: string | null
  typeParameters: { name: string; defaultTypeText: string | null }[]
  extendsTypes: string[]
  properties: TypeProperty[]
  enumValues: EnumValue[] | null
}

interface TypeCatalog {
  types: Map<string, TypeDefinition>
  constObjects: Map<string, { key: string; value: JsonPrimitive }[]>
}

interface TypeSchemaProperty {
  name: string
  typeText: string
  required: boolean
  description: string
  jsonType: string
}

interface TypeSchema {
  schemaVersion: 1
  typeName: string
  kind: 'interface' | 'typeAlias' | 'unknown'
  isArray?: boolean
  description?: string
  typeText: string
  aliasOf: string | null
  extendsTypes: string[]
  enumValues: EnumValue[] | null
  properties: TypeSchemaProperty[]
}

interface WriteRootReadmeInput {
  popbillVersion: string
  compatVersion: string
  services: WriteGeneratedJsonInput[]
}

interface WritePopbillDocsInput {
  config: ServiceConfig
  methodGroups: MethodGroupItem[]
  groupedMethods: Map<string, MethodGroupItem[]>
  methodByName: Map<string, MethodSignatureInfo>
  serviceDescription: string
  typeCatalog: TypeCatalog
}

interface WriteCompatDocsInput {
  config: ServiceConfig
  methodGroups: MethodGroupItem[]
  groupedMethods: Map<string, MethodGroupItem[]>
  methodByName: Map<string, MethodSignatureInfo>
  serviceDescription: string
  modernByCompatMethodName: Map<string, string[]>
  callbackMetadataByMethodName: Map<string, CallbackMetadata>
  requiredMethods: Set<string>
}

interface WriteGeneratedJsonInput {
  config: ServiceConfig
  popbillVersion: string
  compatVersion: string
  popbillMethodGroups: MethodGroupItem[]
  compatMethodGroups: MethodGroupItem[]
  popbillMethodByName: Map<string, MethodSignatureInfo>
  compatMethodByName: Map<string, MethodSignatureInfo>
  modernByCompatMethodName: Map<string, string[]>
  compatMap: CompatMappingItem[]
  compatCallbackMetadata: Map<string, CallbackMetadata>
  compatRequiredMethods: Set<string>
  popbillTypeCatalog: TypeCatalog
}

const rootDir = process.cwd()

interface ServiceConfig {
  modernDirectory: string
  modernService: string
  modernInterface: string
  modernMethodsConstant: string
  compatDirectory: string
  compatService: string
  compatPromiseInterface: string
  compatCallbackInterface: string
  compatMethodsConstant: string
  compatRequiredMethodsConstant: string
}

const serviceConfigs: ServiceConfig[] = [
  serviceConfig('common', 'common', 'CommonService', 'COMMON_METHODS', 'common', 'Common', 'COMMON_METHODS'),
  {
    modernDirectory: 'tax-invoice',
    modernService: 'taxInvoice',
    modernInterface: 'TaxInvoiceService',
    modernMethodsConstant: 'TAX_INVOICE_METHODS',
    compatDirectory: 'taxinvoice',
    compatService: 'TaxinvoiceService',
    compatPromiseInterface: 'TaxinvoicePromiseService',
    compatCallbackInterface: 'TaxinvoiceCallbackService',
    compatMethodsConstant: 'TAXINVOICE_METHODS',
    compatRequiredMethodsConstant: 'TAXINVOICE_REQUIRED_METHODS',
  },
  serviceConfig('cashbill', 'cashbill', 'CashbillService', 'CASHBILL_METHODS', 'cashbill', 'Cashbill', 'CASHBILL_METHODS'),
  {
    modernDirectory: 'statement',
    modernService: 'statement',
    modernInterface: 'StatementService',
    modernMethodsConstant: 'STATEMENT_METHODS',
    compatDirectory: 'statement',
    compatService: 'StatementService',
    compatPromiseInterface: 'StatementPromiseService',
    compatCallbackInterface: 'StatementCallbackService',
    compatMethodsConstant: 'STATEMENT_METHODS',
    compatRequiredMethodsConstant: 'STATEMENT_REQUIRED_METHODS',
  },
  serviceConfig(
    'home-tax-tax-invoice',
    'homeTaxTaxInvoice',
    'HomeTaxTaxInvoiceService',
    'HOME_TAX_TAX_INVOICE_METHODS',
    'httaxinvoice',
    'HTTaxinvoice',
    'HTTAXINVOICE_METHODS'
  ),
  serviceConfig(
    'home-tax-cashbill',
    'homeTaxCashbill',
    'HomeTaxCashbillService',
    'HOME_TAX_CASHBILL_METHODS',
    'htcashbill',
    'HTCashbill',
    'HTCASHBILL_METHODS'
  ),
  serviceConfig('closedown', 'closedown', 'ClosedownService', 'CLOSEDOWN_METHODS', 'closedown', 'Closedown', 'CLOSEDOWN_METHODS'),
  serviceConfig(
    'biz-info-check',
    'bizInfoCheck',
    'BizInfoCheckService',
    'BIZ_INFO_CHECK_METHODS',
    'bizinfocheck',
    'BizInfoCheck',
    'BIZ_INFO_CHECK_METHODS'
  ),
  serviceConfig('easy-fin-bank', 'easyFinBank', 'EasyFinBankService', 'EASY_FIN_BANK_METHODS', 'easyfinbank', 'EasyFinBank', 'EASY_FIN_BANK_METHODS'),
  serviceConfig(
    'account-check',
    'accountCheck',
    'AccountCheckService',
    'ACCOUNT_CHECK_METHODS',
    'accountcheck',
    'AccountCheck',
    'ACCOUNT_CHECK_METHODS'
  ),
  serviceConfig('kakao', 'kakao', 'KakaoService', 'KAKAO_METHODS', 'kakao', 'Kakao', 'KAKAO_METHODS'),
  serviceConfig('message', 'message', 'MessageService', 'MESSAGE_METHODS', 'message', 'Message', 'MESSAGE_METHODS'),
  serviceConfig('fax', 'fax', 'FaxService', 'FAX_METHODS', 'fax', 'Fax', 'FAX_METHODS'),
]

function serviceConfig(
  modernDirectory: string,
  modernService: string,
  modernInterface: string,
  modernMethodsConstant: string,
  compatDirectory: string,
  compatName: string,
  compatMethodsConstant: string
): ServiceConfig {
  return {
    modernDirectory,
    modernService,
    modernInterface,
    modernMethodsConstant,
    compatDirectory,
    compatService: `${compatName}Service`,
    compatPromiseInterface: `${compatName}PromiseService`,
    compatCallbackInterface: `${compatName}CallbackService`,
    compatMethodsConstant,
    compatRequiredMethodsConstant: compatMethodsConstant.replace(/_METHODS$/, '_REQUIRED_METHODS'),
  }
}

const docsRoot = path.join(rootDir, 'docs/sdk')
const generatedRoot = path.join(docsRoot, 'generated')
const sourceFileCache = new Map<string, SourceWithAst>()

main()

function main() {
  const popbillPackage = readJson<PackageManifest>(path.join(rootDir, 'packages/popbill/package.json'))
  const compatPackage = readJson<PackageManifest>(path.join(rootDir, 'packages/popbill-compat/package.json'))
  const generatedInputs: WriteGeneratedJsonInput[] = []

  for (const config of serviceConfigs) {
    const popbillServiceRoot = path.join(rootDir, 'packages/popbill/src/services', config.modernDirectory)
    const compatServiceRoot = path.join(rootDir, 'packages/popbill-compat/src/services', config.compatDirectory)
    const compatTypesPath = path.join(compatServiceRoot, 'types.ts')
    const popbillMethodGroups = parseMethodArray(path.join(popbillServiceRoot, 'methods.ts'), config.modernMethodsConstant)
    const compatMethodGroups = parseMethodArray(path.join(compatServiceRoot, 'methods.ts'), config.compatMethodsConstant)
    const compatMethodsSource = readSourceFile(path.join(compatServiceRoot, 'methods.ts'))
    const compatRequiredMethods = new Set(
      (hasVariableDeclaration(compatMethodsSource, config.compatRequiredMethodsConstant)
        ? parseMethodArray(compatMethodsSource.filePath, config.compatRequiredMethodsConstant)
        : compatMethodGroups
      ).map((method) => method.name)
    )

    const popbillTypeSources = readTypeSources(path.join(popbillServiceRoot, 'types'))
    const popbillTypeCatalog = buildTypeCatalog(popbillTypeSources)

    const popbillTypesSource = popbillTypeSources.find((source) => findTypeDeclaration(source, config.modernInterface))
    if (!popbillTypesSource) throw new Error(`Public service ${config.modernInterface} not found in ${popbillServiceRoot}/types`)
    const popbillServiceDescription = parseInterfaceDescription(popbillTypesSource, config.modernInterface)
    const popbillServiceMethods = parseMethodSignatures(popbillTypesSource, config.modernInterface)
    const popbillMethodByName = buildMethodByName(popbillServiceMethods)

    const compatTypesSource = readSourceFile(compatTypesPath)
    const compatServiceDescription = parseInterfaceDescription(compatTypesSource, config.compatPromiseInterface)
    const compatPromiseMethods = parseMethodSignatures(compatTypesSource, config.compatPromiseInterface)
    const compatCallbackMetadata = parseCallbackMetadata(compatTypesSource, config.compatCallbackInterface)
    const compatMethodByName = buildMethodByName(compatPromiseMethods)

    for (const { name } of popbillMethodGroups) {
      if (!popbillMethodByName.has(name)) {
        throw new Error(`${config.modernInterface}.${name} is listed but has no public signature`)
      }
    }
    for (const { name } of compatMethodGroups) {
      if (!compatMethodByName.has(name) || !compatCallbackMetadata.has(name)) {
        throw new Error(`${config.compatService}.${name} is missing its promise or callback signature`)
      }
    }
    validateMethodList(config.modernInterface, popbillMethodGroups, popbillMethodByName)
    validateMethodList(config.compatService, compatMethodGroups, compatMethodByName)

    const compatMap: CompatMappingItem[] = []
    const modernByCompatMethodName = new Map<string, string[]>()

    for (const { name: methodName, group } of popbillMethodGroups) {
      const method = popbillMethodByName.get(methodName)
      if (!method) {
        continue
      }

      const compatMethodName = method.compatMethodName ?? null
      if (compatMethodName) {
        if (!compatMethodByName.has(compatMethodName)) {
          throw new Error(`${config.modernInterface}.${methodName} maps to missing ${config.compatService}.${compatMethodName}`)
        }
        compatMap.push({
          service: config.modernService,
          modernMethodName: methodName,
          compatMethodName,
          group,
          summary: method.summary,
        })
        const existingMappings = modernByCompatMethodName.get(compatMethodName) ?? []
        modernByCompatMethodName.set(compatMethodName, [...existingMappings, methodName])
      }
    }

    const popbillDocsByGroup = groupBy(popbillMethodGroups, (methodGroupItem) => methodGroupItem.group)
    const compatDocsByGroup = groupBy(compatMethodGroups, (methodGroupItem) => methodGroupItem.group)

    resetServiceOutput(config)

    writePopbillDocs({
      config,
      methodGroups: popbillMethodGroups,
      groupedMethods: popbillDocsByGroup,
      methodByName: popbillMethodByName,
      serviceDescription: popbillServiceDescription,
      typeCatalog: popbillTypeCatalog,
    })
    writeCompatDocs({
      config,
      methodGroups: compatMethodGroups,
      groupedMethods: compatDocsByGroup,
      methodByName: compatMethodByName,
      serviceDescription: compatServiceDescription,
      modernByCompatMethodName,
      callbackMetadataByMethodName: compatCallbackMetadata,
      requiredMethods: compatRequiredMethods,
    })
    generatedInputs.push({
      config,
      popbillVersion: popbillPackage.version,
      compatVersion: compatPackage.version,
      popbillMethodGroups,
      compatMethodGroups,
      popbillMethodByName,
      compatMethodByName,
      modernByCompatMethodName,
      compatMap,
      compatCallbackMetadata,
      compatRequiredMethods,
      popbillTypeCatalog,
    })
  }

  writeRootReadme({
    popbillVersion: popbillPackage.version,
    compatVersion: compatPackage.version,
    services: generatedInputs,
  })
  writeGeneratedJson(generatedInputs)

  process.stdout.write('SDK docs generated at docs/sdk\n')
}

function resetServiceOutput(config: ServiceConfig) {
  fs.rmSync(path.join(docsRoot, 'popbill', config.modernDirectory), { recursive: true, force: true })
  fs.rmSync(path.join(docsRoot, 'popbill-compat', config.compatDirectory), { recursive: true, force: true })
  fs.rmSync(path.join(generatedRoot, 'schemas/popbill', config.modernDirectory), { recursive: true, force: true })
  fs.rmSync(path.join(generatedRoot, 'schemas/popbill-compat', config.compatDirectory), { recursive: true, force: true })
  fs.mkdirSync(docsRoot, { recursive: true })
}

function writeRootReadme({ popbillVersion, compatVersion, services }: WriteRootReadmeInput): void {
  const content = [
    '# SDK Docs',
    '',
    '소스의 공개 서명·메서드 목록·DTO에서 생성한 API 레퍼런스입니다. 직접 수정하지 말고 저장소 루트에서 `pnpm docs:generate`를 실행합니다.',
    '',
    '[사용 가이드와 계약 차이](../README.md) · [개발·검증 명령](../development.md)',
    '',
    '## Packages',
    '',
    '- npm',
    '  - [@connextable/popbill](https://www.npmjs.com/package/@connextable/popbill)',
    '  - [@connextable/popbill-compat](https://www.npmjs.com/package/@connextable/popbill-compat)',
    '- Workspace source',
    '  - [packages/popbill](../../packages/popbill)',
    '  - [packages/popbill-compat](../../packages/popbill-compat)',
    '',
    '## Versions',
    '',
    `- @connextable/popbill: \`${popbillVersion}\``,
    `- @connextable/popbill-compat: \`${compatVersion}\``,
    '',
    '## Services',
    '',
    '서비스 자체의 공개 메서드 수입니다. 상속된 공통 API는 각 서비스에 중복 집계하지 않습니다.',
    '',
    '| Modern service | Methods | Compat service | Methods |',
    '| --- | ---: | --- | ---: |',
    ...services.map(
      ({ config, popbillMethodGroups, compatMethodGroups }) =>
        `| [\`${config.modernService}\`](./popbill/${config.modernDirectory}/index.md) | ${popbillMethodGroups.length} | [\`${config.compatService}\`](./popbill-compat/${config.compatDirectory}/index.md) | ${compatMethodGroups.length} |`
    ),
    `| Total | ${services.reduce((total, service) => total + service.popbillMethodGroups.length, 0)} | | ${services.reduce((total, service) => total + service.compatMethodGroups.length, 0)} |`,
    '',
    '## Human Docs',
    '',
    '- modern',
    ...serviceConfigs.map((config) => `  - [popbill ${config.modernDirectory} index](./popbill/${config.modernDirectory}/index.md)`),
    '- compat',
    ...serviceConfigs.map((config) => `  - [popbill-compat ${config.compatDirectory} index](./popbill-compat/${config.compatDirectory}/index.md)`),
    '',
    '## AI Docs',
    '',
    '- indexes',
    '  - [method-index.json](./generated/method-index.json)',
    '  - [compat-map.json](./generated/compat-map.json)',
    '- schema indexes',
    ...serviceConfigs.flatMap((config) => [
      `  - [popbill ${config.modernDirectory} type schemas](./generated/schemas/popbill/${config.modernDirectory}/types/index.json)`,
      `  - [popbill-compat ${config.compatDirectory} method schemas](./generated/schemas/popbill-compat/${config.compatDirectory}/methods/index.json)`,
    ]),
    '',
  ].join('\n')

  writeFile(path.join(docsRoot, 'README.md'), content)
}

function writePopbillDocs({ config, methodGroups, groupedMethods, methodByName, serviceDescription, typeCatalog }: WritePopbillDocsInput): void {
  const methodDir = path.join(docsRoot, 'popbill', config.modernDirectory, 'methods')
  const indexPath = path.join(docsRoot, 'popbill', config.modernDirectory, 'index.md')

  for (const { name: methodName, group } of methodGroups) {
    const method = methodByName.get(methodName)
    if (!method) {
      continue
    }

    const inputType = method.parameters[0]?.typeText ?? null
    const inputSchema = inputType ? createSchemaForType(typeCatalog, inputType) : null
    const returnSchema = method.promiseReturnType ? createSchemaForType(typeCatalog, method.promiseReturnType) : null

    const lines = []
    lines.push(`---`)
    lines.push(`sdk: popbill`)
    lines.push(`service: ${config.modernService}`)
    lines.push(`method: ${methodName}`)
    if (method.compatMethodName) {
      lines.push(`compat_method: ${method.compatMethodName}`)
    }
    lines.push(`group: ${group}`)
    lines.push(`---`)
    lines.push('')
    lines.push(`# ${methodName}`)
    lines.push('')
    lines.push('## Summary')
    lines.push('')
    lines.push(method.summary || '설명 없음')
    lines.push('')
    lines.push('## Signature')
    lines.push('')
    lines.push('```ts')
    lines.push(method.signature)
    lines.push('```')
    lines.push('')
    lines.push('## Input')
    lines.push('')

    if (!inputType) {
      lines.push('- 입력 파라미터 없음')
      lines.push('')
    } else {
      lines.push(`- Type: \`${inputType}\``)
      lines.push('')

      if (inputSchema && inputSchema.properties.length > 0) {
        lines.push('| Field | Type | Required | Description |')
        lines.push('| --- | --- | --- | --- |')
        for (const property of inputSchema.properties) {
          lines.push(
            `| \`${property.name}\` | \`${escapeTable(property.typeText)}\` | ${property.required ? 'Y' : 'N'} | ${escapeTable(property.description)} |`
          )
        }
        lines.push('')
      } else if (inputSchema && inputSchema.aliasOf) {
        lines.push(`- Alias of: \`${inputSchema.aliasOf}\``)
        lines.push('')
      } else if (inputSchema?.kind === 'typeAlias') {
        lines.push('결합·조건에 따른 필수 여부는 원본 타입 표현식을 따릅니다.')
        lines.push('')
        lines.push('```ts')
        lines.push(inputSchema.typeText)
        lines.push('```')
        lines.push('')
      } else {
        lines.push('- 상세 필드 자동 추출 불가 (타입 별칭 또는 외부 타입 참조)')
        lines.push('')
      }
    }

    lines.push('## Output')
    lines.push('')
    lines.push(`- Type: \`${method.promiseReturnType ?? method.returnTypeText}\``)
    lines.push('')

    if (returnSchema && returnSchema.properties.length > 0) {
      lines.push('| Field | Type | Required | Description |')
      lines.push('| --- | --- | --- | --- |')
      for (const property of returnSchema.properties) {
        lines.push(
          `| \`${property.name}\` | \`${escapeTable(property.typeText)}\` | ${property.required ? 'Y' : 'N'} | ${escapeTable(property.description)} |`
        )
      }
      lines.push('')
    } else if (returnSchema && returnSchema.aliasOf) {
      lines.push(`- Alias of: \`${returnSchema.aliasOf}\``)
      lines.push('')
    } else if (returnSchema?.kind === 'typeAlias') {
      lines.push('```ts')
      lines.push(returnSchema.typeText)
      lines.push('```')
      lines.push('')
    }

    lines.push('## Compatibility')
    lines.push('')
    if (method.compatMethodName) {
      lines.push(`- Compat method: \`${method.compatMethodName}\``)
    } else {
      lines.push('- Compat method: 없음')
    }
    lines.push(`- Group: \`${group}\``)
    lines.push('')

    lines.push('## AI Metadata')
    lines.push('')
    lines.push('```json')
    lines.push(
      JSON.stringify(
        {
          sdk: 'popbill',
          service: config.modernService,
          methodName,
          group,
          summary: method.summary,
          signature: method.signature,
          inputType,
          outputType: method.promiseReturnType ?? method.returnTypeText,
          compatMethodName: method.compatMethodName ?? null,
        },
        null,
        2
      )
    )
    lines.push('```')
    lines.push('')

    writeFile(path.join(methodDir, `${toKebabCase(methodName)}.md`), lines.join('\n'))
  }

  const indexLines = []
  indexLines.push(`# popbill / ${config.modernService}`)
  indexLines.push('')
  indexLines.push(serviceDescription || `${config.modernInterface} modern facade 서비스 인터페이스입니다.`)
  indexLines.push('')

  for (const [group, methods] of groupedMethods) {
    indexLines.push(`## ${group}`)
    indexLines.push('')
    for (const item of methods) {
      const method = methodByName.get(item.name)
      if (!method) {
        continue
      }
      indexLines.push(`- [\`${item.name}\`](./methods/${toKebabCase(item.name)}.md): ${method.summary || '설명 없음'}`)
    }
    indexLines.push('')
  }

  writeFile(indexPath, indexLines.join('\n'))
}

function writeCompatDocs({
  config,
  methodGroups,
  groupedMethods,
  methodByName,
  serviceDescription,
  modernByCompatMethodName,
  callbackMetadataByMethodName,
  requiredMethods,
}: WriteCompatDocsInput): void {
  const methodDir = path.join(docsRoot, 'popbill-compat', config.compatDirectory, 'methods')
  const indexPath = path.join(docsRoot, 'popbill-compat', config.compatDirectory, 'index.md')

  for (const { name: methodName, group } of methodGroups) {
    const method = methodByName.get(methodName)
    if (!method) {
      continue
    }

    const callbackMeta = callbackMetadataByMethodName.get(methodName) ?? null
    const modernMethodNames = modernByCompatMethodName.get(methodName) ?? []
    const modernMethodName = modernMethodNames[0] ?? null
    const required = requiredMethods.has(methodName)

    const lines = []
    lines.push('---')
    lines.push('sdk: popbill-compat')
    lines.push(`service: ${config.compatService}`)
    lines.push(`method: ${methodName}`)
    lines.push(`group: ${group}`)
    lines.push(`required: ${required}`)
    if (modernMethodName) {
      lines.push(`modern_method: ${modernMethodName}`)
    }
    lines.push('---')
    lines.push('')
    lines.push(`# ${methodName}`)
    lines.push('')
    lines.push('## Summary')
    lines.push('')
    if (modernMethodName) {
      lines.push(`modern SDK 대응 메서드: ${modernMethodNames.map((name) => `\`${name}\``).join(', ')}`)
    } else {
      lines.push('legacy 전용 메서드(현재 modern 대응 없음)')
    }
    lines.push('')
    lines.push(method.overloads.length > 1 ? '## Promise Signatures' : '## Promise Signature')
    lines.push('')
    lines.push('```ts')
    for (const overload of method.overloads) {
      lines.push(formatCompatSignature(methodName, overload))
    }
    lines.push('```')
    lines.push('')
    lines.push('## Parameters')
    lines.push('')

    if (method.overloads.length > 1) {
      method.overloads.forEach((overload, index) => {
        lines.push(`### Overload ${index + 1}`)
        lines.push('')
        if (overload.parameters.length === 0) {
          lines.push('- 파라미터 없음')
          lines.push('')
          return
        }

        lines.push('| Name | Type | Optional |')
        lines.push('| --- | --- | --- |')
        for (const parameter of overload.parameters) {
          lines.push(`| \`${parameter.name}\` | \`${escapeTable(parameter.typeText)}\` | ${parameter.optional ? 'Y' : 'N'} |`)
        }
        lines.push('')
      })
    } else if (method.parameters.length === 0) {
      lines.push('- 파라미터 없음')
      lines.push('')
    } else {
      lines.push('| Name | Type | Optional |')
      lines.push('| --- | --- | --- |')
      for (const parameter of method.parameters) {
        lines.push(`| \`${parameter.name}\` | \`${escapeTable(parameter.typeText)}\` | ${parameter.optional ? 'Y' : 'N'} |`)
      }
      lines.push('')
    }

    lines.push('## Callback Compatibility')
    lines.push('')
    if (!callbackMeta) {
      lines.push('- Callback 메타데이터를 찾지 못함')
    } else {
      lines.push(`- Callback property type: \`${callbackMeta.typeText}\``)
      if (callbackMeta.typeName) {
        lines.push(`- Callback signature model: \`${callbackMeta.typeName}\``)
      }
      if (typeof callbackMeta.overloadCount === 'number') {
        lines.push(`- Overload count: \`${callbackMeta.overloadCount}\``)
      }
    }
    lines.push('')
    lines.push('## Classification')
    lines.push('')
    lines.push(`- Group: \`${group}\``)
    lines.push(`- Required method set: \`${required}\``)
    lines.push(`- Modern mapping: ${modernMethodNames.length ? modernMethodNames.map((name) => `\`${name}\``).join(', ') : '`none`'}`)
    lines.push('')
    lines.push('## AI Metadata')
    lines.push('')
    lines.push('```json')
    lines.push(
      JSON.stringify(
        {
          sdk: 'popbill-compat',
          service: config.compatService,
          methodName,
          group,
          required,
          promiseSignature: formatCompatSignature(methodName, method),
          promiseSignatures: method.overloads.map((overload) => formatCompatSignature(methodName, overload)),
          modernMethodName,
          modernMethodNames,
          callback: callbackMeta,
        },
        null,
        2
      )
    )
    lines.push('```')
    lines.push('')

    writeFile(path.join(methodDir, `${toKebabCase(methodName)}.md`), lines.join('\n'))
  }

  const indexLines = []
  indexLines.push(`# popbill-compat / ${config.compatService}`)
  indexLines.push('')
  indexLines.push(serviceDescription || `Promise 기반 legacy ${config.compatService} 인터페이스입니다.`)
  indexLines.push('')

  for (const [group, methods] of groupedMethods) {
    indexLines.push(`## ${group}`)
    indexLines.push('')
    for (const item of methods) {
      const method = methodByName.get(item.name)
      if (!method) {
        continue
      }

      const modernMethodNames = modernByCompatMethodName.get(item.name) ?? []
      const suffix = modernMethodNames.length ? ` -> modern: ${modernMethodNames.map((name) => `\`${name}\``).join(', ')}` : ' -> legacy-only'
      indexLines.push(`- [\`${item.name}\`](./methods/${toKebabCase(item.name)}.md)${suffix}`)
    }
    indexLines.push('')
  }

  writeFile(indexPath, indexLines.join('\n'))
}

function writeGeneratedJson(inputs: WriteGeneratedJsonInput[]): void {
  const first = inputs[0]
  if (!first) {
    throw new Error('At least one service is required to generate SDK documentation')
  }

  const services = inputs.map(writeServiceGeneratedJson)
  writeJson(path.join(generatedRoot, 'method-index.json'), {
    schemaVersion: 1,
    generatedBy: 'scripts/generate-sdk-docs.ts',
    packages: {
      popbill: first.popbillVersion,
      popbillCompat: first.compatVersion,
    },
    methods: services.flatMap((service) => service.methods),
  })
  writeJson(path.join(generatedRoot, 'compat-map.json'), {
    schemaVersion: 1,
    generatedBy: 'scripts/generate-sdk-docs.ts',
    mappings: services.flatMap((service) => service.mappings),
  })
}

function writeServiceGeneratedJson({
  config,
  popbillVersion,
  compatVersion,
  popbillMethodGroups,
  compatMethodGroups,
  popbillMethodByName,
  compatMethodByName,
  modernByCompatMethodName,
  compatMap,
  compatCallbackMetadata,
  compatRequiredMethods,
  popbillTypeCatalog,
}: WriteGeneratedJsonInput) {
  const methodIndex = {
    schemaVersion: 1,
    generatedBy: 'scripts/generate-sdk-docs.ts',
    packages: {
      popbill: popbillVersion,
      popbillCompat: compatVersion,
    },
    methods: [
      ...popbillMethodGroups
        .map(({ name, group }) => {
          const method = popbillMethodByName.get(name)
          if (!method) {
            return null
          }

          return {
            sdk: 'popbill',
            service: config.modernService,
            group,
            methodName: name,
            summary: method.summary,
            signature: method.signature,
            inputType: method.parameters[0]?.typeText ?? null,
            outputType: method.promiseReturnType ?? method.returnTypeText,
            compatMethodName: method.compatMethodName ?? null,
          }
        })
        .filter(Boolean),
      ...compatMethodGroups
        .map(({ name, group }) => {
          const method = compatMethodByName.get(name)
          if (!method) {
            return null
          }

          return {
            sdk: 'popbill-compat',
            service: config.compatService,
            group,
            methodName: name,
            required: compatRequiredMethods.has(name),
            promiseSignature: formatCompatSignature(name, method),
            promiseSignatures: method.overloads.map((overload) => formatCompatSignature(name, overload)),
            outputType: method.promiseReturnType ?? method.returnTypeText,
            callback: compatCallbackMetadata.get(name) ?? null,
            mappedModernMethodName: modernByCompatMethodName.get(name)?.[0] ?? null,
            mappedModernMethodNames: modernByCompatMethodName.get(name) ?? [],
          }
        })
        .filter(Boolean),
    ],
  }

  const popbillSchemaRoot = path.join(generatedRoot, 'schemas/popbill', config.modernDirectory, 'types')
  const popbillTypesIndex = []

  for (const [typeName, typeDef] of [...popbillTypeCatalog.types.entries()].sort(([a], [b]) => a.localeCompare(b))) {
    const schema = createSchemaForType(popbillTypeCatalog, typeName)
    popbillTypesIndex.push({
      typeName,
      kind: typeDef.kind,
      file: `./${toKebabCase(typeName)}.json`,
    })
    writeJson(path.join(popbillSchemaRoot, `${toKebabCase(typeName)}.json`), schema)
  }

  writeJson(path.join(popbillSchemaRoot, 'index.json'), {
    schemaVersion: 1,
    service: config.modernService,
    types: popbillTypesIndex,
  })

  const compatMethodSchemas = []
  for (const { name: methodName } of compatMethodGroups) {
    const method = compatMethodByName.get(methodName)
    if (!method) {
      continue
    }

    const callback = compatCallbackMetadata.get(methodName) ?? null
    const schema = {
      schemaVersion: 1,
      sdk: 'popbill-compat',
      service: config.compatService,
      methodName,
      required: compatRequiredMethods.has(methodName),
      promiseSignature: formatCompatSignature(methodName, method),
      promiseSignatures: method.overloads.map((overload) => formatCompatSignature(methodName, overload)),
      parameters: method.parameters.map((parameter) => ({
        name: parameter.name,
        type: parameter.typeText,
        optional: parameter.optional,
        ...(parameter.rest ? { rest: true } : {}),
      })),
      overloads: method.overloads.map((overload) => ({
        promiseSignature: formatCompatSignature(methodName, overload),
        parameters: overload.parameters.map((parameter) => ({
          name: parameter.name,
          type: parameter.typeText,
          optional: parameter.optional,
          ...(parameter.rest ? { rest: true } : {}),
        })),
        outputType: overload.promiseReturnType ?? overload.returnTypeText,
      })),
      outputType: method.promiseReturnType ?? method.returnTypeText,
      callback,
      mappedModernMethodName: modernByCompatMethodName.get(methodName)?.[0] ?? null,
      mappedModernMethodNames: modernByCompatMethodName.get(methodName) ?? [],
    }

    compatMethodSchemas.push({
      methodName,
      file: `./${toKebabCase(methodName)}.json`,
    })
    writeJson(path.join(generatedRoot, 'schemas/popbill-compat', config.compatDirectory, 'methods', `${toKebabCase(methodName)}.json`), schema)
  }

  writeJson(path.join(generatedRoot, 'schemas/popbill-compat', config.compatDirectory, 'methods/index.json'), {
    schemaVersion: 1,
    service: config.compatService,
    methods: compatMethodSchemas,
  })

  return { methods: methodIndex.methods, mappings: compatMap }
}

function buildTypeCatalog(sources: SourceWithAst[]): TypeCatalog {
  const types = new Map<string, TypeDefinition>()
  const constObjects = new Map<string, { key: string; value: JsonPrimitive }[]>()

  for (const source of sources) {
    for (const statement of source.ast.statements) {
      if (ts.isVariableStatement(statement)) {
        for (const declaration of statement.declarationList.declarations) {
          if (!ts.isIdentifier(declaration.name) || !declaration.initializer) {
            continue
          }

          const object = unwrapObjectLiteral(declaration.initializer)
          if (!object) {
            continue
          }

          const values: { key: string; value: JsonPrimitive }[] = []
          for (const property of object.properties) {
            if (!ts.isPropertyAssignment(property)) {
              continue
            }

            const key = getPropertyName(property.name, source.ast)
            const literal = literalValue(unwrapExpression(property.initializer))
            if (literal === undefined) {
              continue
            }

            values.push({ key, value: literal })
          }
          constObjects.set(declaration.name.text, values)
        }
      }

      if (ts.isInterfaceDeclaration(statement)) {
        const description = getNodeDescription(statement)
        const properties = statement.members
          .filter((member) => ts.isPropertySignature(member))
          .map((member) => ({
            name: getPropertyName(member.name, source.ast),
            typeText: member.type ? member.type.getText(source.ast) : 'unknown',
            optional: Boolean(member.questionToken),
            description: getNodeDescription(member),
          }))
          .filter((property) => Boolean(property.name))
          .map((property) => ({
            ...property,
            required: !property.optional,
          }))

        const extendsTypes =
          statement.heritageClauses
            ?.flatMap((clause) =>
              clause.types.map((typeNode) => ({
                name: typeNode.getText(source.ast),
              }))
            )
            .map((extendedType) => extendedType.name) ?? []

        types.set(statement.name.text, {
          kind: 'interface',
          name: statement.name.text,
          description,
          filePath: source.filePath,
          typeText: statement.name.text,
          aliasOf: null,
          typeParameters: (statement.typeParameters ?? []).map((parameter) => ({
            name: parameter.name.text,
            defaultTypeText: parameter.default?.getText(source.ast) ?? null,
          })),
          extendsTypes,
          properties,
          enumValues: null,
        })
        continue
      }

      if (ts.isTypeAliasDeclaration(statement)) {
        const typeText = statement.type.getText(source.ast)
        const description = getNodeDescription(statement)
        const aliasOf = ts.isTypeReferenceNode(statement.type) ? typeText : null
        const enumFromConst = extractEnumConstName(typeText)
        const enumValues = enumFromConst ? (constObjects.get(enumFromConst) ?? null) : extractLiteralUnionValues(statement.type)

        types.set(statement.name.text, {
          kind: 'typeAlias',
          name: statement.name.text,
          description,
          filePath: source.filePath,
          typeText,
          aliasOf,
          typeParameters: (statement.typeParameters ?? []).map((parameter) => ({
            name: parameter.name.text,
            defaultTypeText: parameter.default?.getText(source.ast) ?? null,
          })),
          extendsTypes: [],
          properties: [],
          enumValues,
        })
      }
    }
  }

  return {
    types,
    constObjects,
  }
}

function createSchemaForType(typeCatalog: TypeCatalog, typeName: string): TypeSchema {
  const elementTypeName = typeName.trim().replace(/\[\]$/, '')
  const isArray = elementTypeName !== typeName.trim()
  const normalizedName = parseTypeReference(elementTypeName).name
  const typeDef = typeCatalog.types.get(normalizedName)

  if (!typeDef) {
    return {
      schemaVersion: 1,
      typeName: normalizedName,
      kind: 'unknown',
      typeText: typeName,
      properties: [],
      enumValues: null,
      aliasOf: null,
      extendsTypes: [],
    }
  }

  const flattenedProperties = flattenTypeProperties(typeCatalog, elementTypeName)

  return {
    schemaVersion: 1,
    typeName: normalizedName,
    kind: typeDef.kind,
    isArray,
    description: typeDef.description,
    typeText: typeDef.typeText,
    aliasOf: typeDef.aliasOf,
    extendsTypes: typeDef.extendsTypes,
    enumValues: typeDef.enumValues,
    properties: flattenedProperties.map((property) => ({
      name: property.name,
      typeText: property.typeText,
      required: property.required,
      description: property.description,
      jsonType: inferJsonType(typeCatalog, property.typeText),
    })),
  }
}

function flattenTypeProperties(typeCatalog: TypeCatalog, typeName: string, visited: Set<string> = new Set<string>()): TypeProperty[] {
  if (visited.has(typeName)) {
    return []
  }
  visited.add(typeName)

  const reference = parseTypeReference(typeName)
  if (reference.name === 'Partial' && reference.typeArguments[0]) {
    return flattenTypeProperties(typeCatalog, reference.typeArguments[0], visited).map((property) => ({
      ...property,
      optional: true,
      required: false,
    }))
  }
  const typeDef = typeCatalog.types.get(reference.name)
  if (!typeDef) {
    return []
  }

  const substitutions = new Map<string, string>()
  for (const [index, parameter] of typeDef.typeParameters.entries()) {
    const value = reference.typeArguments[index] ?? parameter.defaultTypeText
    if (value) {
      substitutions.set(parameter.name, substituteTypeParameters(value, substitutions))
    }
  }

  if (typeDef.aliasOf && typeDef.aliasOf !== typeName) {
    return flattenTypeProperties(typeCatalog, substituteTypeParameters(typeDef.aliasOf, substitutions), visited)
  }

  const inherited: TypeProperty[] = []
  for (const parentName of typeDef.extendsTypes) {
    inherited.push(...flattenTypeProperties(typeCatalog, substituteTypeParameters(parentName, substitutions), visited))
  }

  const merged = new Map<string, TypeProperty>()
  for (const property of inherited) {
    merged.set(property.name, property)
  }
  for (const property of typeDef.properties) {
    merged.set(property.name, { ...property, typeText: substituteTypeParameters(property.typeText, substitutions) })
  }

  return [...merged.values()]
}

function parseTypeReference(typeText: string): { name: string; typeArguments: string[] } {
  const source = ts.createSourceFile('type-reference.ts', `type Generated = ${typeText}`, ts.ScriptTarget.Latest, true, ts.ScriptKind.TS)
  const declaration = source.statements[0]
  if (!declaration || !ts.isTypeAliasDeclaration(declaration) || !ts.isTypeReferenceNode(declaration.type)) {
    return { name: typeText, typeArguments: [] }
  }

  return {
    name: declaration.type.typeName.getText(source).replace(/^(document|response|Document|Response|Input|Output|types)\./, ''),
    typeArguments: (declaration.type.typeArguments ?? []).map((argument) => argument.getText(source)),
  }
}

function substituteTypeParameters(typeText: string, substitutions: Map<string, string>): string {
  return typeText.replace(/\b[A-Za-z_$][A-Za-z0-9_$]*\b/g, (name) => substitutions.get(name) ?? name)
}

type ServiceTypeDeclaration = ts.InterfaceDeclaration | ts.TypeAliasDeclaration
type ServiceMember = ts.MethodSignature | ts.PropertySignature

function findTypeDeclaration(source: SourceWithAst, name: string): ServiceTypeDeclaration | undefined {
  return source.ast.statements.find(
    (statement): statement is ServiceTypeDeclaration =>
      (ts.isInterfaceDeclaration(statement) || ts.isTypeAliasDeclaration(statement)) && statement.name.text === name
  )
}

/** Enumerates finite public mapped types without guessing unresolved conditional or external types. */
function collectServiceMembers(source: SourceWithAst, name: string, visited = new Set<string>()): { source: SourceWithAst; member: ServiceMember }[] {
  if (visited.has(name)) throw new Error(`Circular service type ${name} in ${source.filePath}`)
  const declaration = findTypeDeclaration(source, name)
  if (!declaration) throw new Error(`Public service type ${name} not found in ${source.filePath}`)
  const nextVisited = new Set([...visited, name])
  if (ts.isInterfaceDeclaration(declaration)) {
    const inherited = (declaration.heritageClauses ?? []).flatMap((clause) =>
      clause.types.flatMap((type) => {
        const parentName = type.expression.getText(source.ast)
        return findTypeDeclaration(source, parentName) ? collectServiceMembers(source, parentName, nextVisited) : []
      })
    )
    return [
      ...inherited,
      ...declaration.members
        .filter((member): member is ServiceMember => ts.isMethodSignature(member) || ts.isPropertySignature(member))
        .map((member) => ({ source, member })),
    ]
  }
  return membersFromType(source, declaration.type, nextVisited)
}

function membersFromType(source: SourceWithAst, type: ts.TypeNode, visited: Set<string>): { source: SourceWithAst; member: ServiceMember }[] {
  if (ts.isParenthesizedTypeNode(type)) return membersFromType(source, type.type, visited)
  if (ts.isTypeReferenceNode(type)) return collectServiceMembers(source, type.typeName.getText(source.ast), visited)
  if (ts.isIntersectionTypeNode(type)) return type.types.flatMap((part) => membersFromType(source, part, visited))
  if (ts.isTypeLiteralNode(type))
    return type.members
      .filter((member): member is ServiceMember => ts.isMethodSignature(member) || ts.isPropertySignature(member))
      .map((member) => ({ source, member }))
  if (
    ts.isMappedTypeNode(type) &&
    type.type &&
    type.typeParameter.constraint &&
    ts.isTypeOperatorNode(type.typeParameter.constraint) &&
    type.typeParameter.constraint.operator === ts.SyntaxKind.KeyOfKeyword &&
    ts.isTypeReferenceNode(type.typeParameter.constraint.type)
  ) {
    if (type.nameType) throw new Error(`Remapped service keys cannot be extracted in ${source.filePath}`)
    const keys = [
      ...new Set(
        collectServiceMembers(source, type.typeParameter.constraint.type.typeName.getText(source.ast), visited).map(
          ({ source: memberSource, member }) => getPropertyName(member.name, memberSource.ast)
        )
      ),
    ]
    return keys.map((key) => {
      const concreteType = type.type!.getText(source.ast).replace(new RegExp(`\\b${type.typeParameter.name.text}\\b`, 'g'), JSON.stringify(key))
      const generatedText = `${source.text}\ninterface __GeneratedServiceMember { ${JSON.stringify(key)}: ${concreteType} }\n`
      const ast = ts.createSourceFile(source.filePath, generatedText, ts.ScriptTarget.Latest, true, ts.ScriptKind.TS)
      const generated = ast.statements[ast.statements.length - 1]
      if (!generated || !ts.isInterfaceDeclaration(generated) || !generated.members[0] || !ts.isPropertySignature(generated.members[0]))
        throw new Error(`Unable to extract mapped method ${key}`)
      return { source: { filePath: source.filePath, text: generatedText, ast }, member: generated.members[0] }
    })
  }
  throw new Error(`Unsupported service type ${type.getText(source.ast)} in ${source.filePath}`)
}

function resolveIndexedTypeText(source: SourceWithAst, typeText: string): string {
  return typeText.replace(/\b([A-Za-z_$][A-Za-z0-9_$]*)\["([^"\\]+)"\]/g, (original, name: string, key: string) => {
    const declaration = findTypeDeclaration(source, name)
    if (!declaration || !ts.isInterfaceDeclaration(declaration)) return original
    const member = declaration.members.find((member) => ts.isPropertySignature(member) && getPropertyName(member.name, source.ast) === key)
    return member && ts.isPropertySignature(member) && member.type ? member.type.getText(source.ast) : original
  })
}

function parseMethodSignatures(rootSource: SourceWithAst, interfaceName: string): MethodSignatureInfo[] {
  const methods: MethodSignatureInfo[] = []
  for (const { source, member } of collectServiceMembers(rootSource, interfaceName)) {
    const callable = ts.isMethodSignature(member) ? member : member.type && ts.isFunctionTypeNode(member.type) ? member.type : undefined
    if (!callable) continue

    const methodName = getPropertyName(member.name, source.ast)
    if (!methodName) {
      continue
    }

    const parameters = callable.parameters.flatMap((parameter): MethodParameter[] => {
      if (parameter.dotDotDotToken && parameter.type) {
        const expanded = expandTupleParameters(source, parameter.type)
        if (expanded) return expanded
      }
      return [
        {
          name: parameter.name.getText(source.ast),
          optional: Boolean(parameter.questionToken),
          typeText: parameter.type ? parameter.type.getText(source.ast) : 'unknown',
          ...(parameter.dotDotDotToken ? { rest: true } : {}),
        },
      ]
    })
    const returnTypeText = callable.type ? resolveIndexedTypeText(source, callable.type.getText(source.ast)) : 'void'
    const promiseReturnType = extractPromiseReturnType(callable.type, source.ast)
    const summary = getNodeDescription(member)
    const compatMethodName = extractCompatMethodName(summary)
    const cleanedSummary = summary.replace(/\n?\s*Compat:\s*`[^`]+`\s*/g, '').trim()
    const signature = `${methodName}(${parameters
      .map((parameter) => `${parameter.rest ? '...' : ''}${parameter.name}${parameter.optional ? '?' : ''}: ${parameter.typeText}`)
      .join(', ')}): ${returnTypeText}`

    methods.push({
      name: methodName,
      summary: cleanedSummary,
      compatMethodName,
      parameters,
      returnTypeText,
      promiseReturnType: promiseReturnType ? resolveIndexedTypeText(source, promiseReturnType) : null,
      signature,
      overloads: [
        {
          parameters,
          returnTypeText,
          promiseReturnType: promiseReturnType ? resolveIndexedTypeText(source, promiseReturnType) : null,
          signature,
        },
      ],
    })
  }

  return methods
}

function buildMethodByName(methods: MethodSignatureInfo[]): Map<string, MethodSignatureInfo> {
  const methodByName = new Map<string, MethodSignatureInfo>()

  for (const method of methods) {
    const existing = methodByName.get(method.name)
    if (!existing) {
      methodByName.set(method.name, method)
      continue
    }

    existing.overloads.push(...method.overloads)
  }

  return methodByName
}

function validateMethodList(service: string, listedMethods: MethodGroupItem[], methodByName: Map<string, MethodSignatureInfo>): void {
  const names = new Set<string>()
  for (const { name } of listedMethods) {
    if (names.has(name)) throw new Error(`${service}.${name} is listed more than once`)
    names.add(name)
  }
  for (const name of methodByName.keys()) {
    if (!names.has(name)) throw new Error(`${service}.${name} has a public signature but is not listed`)
  }
}

function formatCompatSignature(methodName: string, overload: MethodOverloadInfo): string {
  return `${methodName}(${overload.parameters
    .map((parameter) => `${parameter.rest ? '...' : ''}${parameter.name}${parameter.optional ? '?' : ''}: ${parameter.typeText}`)
    .join(', ')}): ${overload.returnTypeText}`
}

function expandTupleParameters(source: SourceWithAst, type: ts.TypeNode, visited = new Set<string>()): MethodParameter[] | null {
  if (
    ts.isIndexedAccessTypeNode(type) &&
    ts.isTypeReferenceNode(type.objectType) &&
    ts.isLiteralTypeNode(type.indexType) &&
    ts.isStringLiteral(type.indexType.literal)
  ) {
    const indexedName = type.getText(source.ast)
    if (visited.has(indexedName)) return null
    const nextVisited = new Set([...visited, indexedName])
    const declaration = findTypeDeclaration(source, type.objectType.typeName.getText(source.ast))
    if (!declaration || !ts.isInterfaceDeclaration(declaration)) return null
    const propertyName = type.indexType.literal.text
    const member = declaration.members.find((member) => ts.isPropertySignature(member) && getPropertyName(member.name, source.ast) === propertyName)
    return member && ts.isPropertySignature(member) && member.type ? expandTupleParameters(source, member.type, nextVisited) : null
  }
  if (ts.isTypeReferenceNode(type)) {
    const aliasName = type.typeName.getText(source.ast)
    if (visited.has(aliasName)) return null
    const alias = source.ast.statements.find(
      (statement): statement is ts.TypeAliasDeclaration => ts.isTypeAliasDeclaration(statement) && statement.name.text === aliasName
    )
    if (!alias) return null
    return expandTupleParameters(source, alias.type, new Set([...visited, aliasName]))
  }
  if (!ts.isTupleTypeNode(type)) return null

  const parameters: MethodParameter[] = []
  for (const element of type.elements) {
    if (ts.isRestTypeNode(element)) {
      const expanded = expandTupleParameters(source, element.type, visited)
      if (!expanded) return null
      parameters.push(...expanded)
    } else if (ts.isNamedTupleMember(element)) {
      if (element.dotDotDotToken) {
        const expanded = expandTupleParameters(source, element.type, visited)
        if (!expanded) return null
        parameters.push(...expanded)
      } else {
        parameters.push({
          name: element.name.getText(source.ast),
          optional: Boolean(element.questionToken),
          typeText: element.type.getText(source.ast),
        })
      }
    } else {
      return null
    }
  }
  return parameters
}

function parseCallbackMetadata(source: SourceWithAst, interfaceName: string): Map<string, CallbackMetadata> {
  const callbackDeclarations = new Map(
    readLocalTypeDependencies(source)
      .flatMap((source) => [...source.ast.statements])
      .filter((statement) => ts.isInterfaceDeclaration(statement) || ts.isTypeAliasDeclaration(statement))
      .map((statement) => [statement.name.text, statement] as const)
  )

  function countNamedOverloads(name: string, visited: Set<string>): number | null {
    if (visited.has(name)) return null
    const declaration = callbackDeclarations.get(name)
    if (!declaration) return null
    const nextVisited = new Set([...visited, name])
    if (ts.isTypeAliasDeclaration(declaration)) return countTypeOverloads(declaration.type, nextVisited)

    const ownCount = declaration.members.filter((member) => ts.isCallSignatureDeclaration(member)).length
    const inheritedCounts = (declaration.heritageClauses ?? []).flatMap((clause) =>
      clause.types.map((type) => countNamedOverloads(type.expression.getText(), nextVisited))
    )
    if (inheritedCounts.some((count) => count === null)) return null
    const total = ownCount + inheritedCounts.reduce<number>((sum, count) => sum + (count ?? 0), 0)
    return total || null
  }

  function countTypeOverloads(type: ts.TypeNode, visited: Set<string>): number | null {
    if (ts.isFunctionTypeNode(type)) return 1
    if (ts.isTypeLiteralNode(type)) return type.members.filter((member) => ts.isCallSignatureDeclaration(member)).length || null
    if (ts.isTypeReferenceNode(type)) return countNamedOverloads(type.typeName.getText(), visited)
    if (ts.isIntersectionTypeNode(type)) {
      const counts = type.types.map((part) => countTypeOverloads(part, visited))
      return counts.some((count) => count === null) ? null : counts.reduce<number>((sum, count) => sum + (count ?? 0), 0)
    }
    return null
  }

  const callbackMetadataByMethodName = new Map<string, CallbackMetadata>()
  for (const { source: memberSource, member } of collectServiceMembers(source, interfaceName)) {
    if (ts.isMethodSignature(member)) {
      const methodName = getPropertyName(member.name, memberSource.ast)
      const previous = callbackMetadataByMethodName.get(methodName)
      callbackMetadataByMethodName.set(methodName, {
        typeText: previous ? `${previous.typeText}; ${member.getText(memberSource.ast)}` : member.getText(memberSource.ast),
        typeName: null,
        overloadCount: previous ? (previous.overloadCount === null ? null : previous.overloadCount + 1) : 1,
      })
      continue
    }
    if (!ts.isPropertySignature(member)) {
      continue
    }
    const methodName = getPropertyName(member.name, memberSource.ast)
    if (!methodName || !member.type) {
      continue
    }

    let typeName = null
    if (ts.isTypeReferenceNode(member.type)) {
      typeName = member.type.typeName.getText(memberSource.ast)
    }

    const previous = callbackMetadataByMethodName.get(methodName)
    const overloadCount = countTypeOverloads(member.type, new Set())
    callbackMetadataByMethodName.set(methodName, {
      typeText: previous ? `${previous.typeText} & ${member.type.getText(memberSource.ast)}` : member.type.getText(memberSource.ast),
      typeName: previous ? null : typeName,
      overloadCount: previous
        ? previous.overloadCount === null || overloadCount === null
          ? null
          : previous.overloadCount + overloadCount
        : overloadCount,
    })
  }

  return callbackMetadataByMethodName
}

function parseInterfaceDescription(source: SourceWithAst, interfaceName: string): string {
  const interfaceDeclaration = findTypeDeclaration(source, interfaceName)

  if (!interfaceDeclaration) {
    return ''
  }

  const description = getNodeDescription(interfaceDeclaration)
  if (!description) {
    return ''
  }

  return (
    description
      .split('\n')
      .map((line) => line.trim())
      .filter((line) => line.length > 0)[0] ?? ''
  )
}

function parseMethodArray(filePath: string, constName: string, visited = new Set<string>()): MethodGroupItem[] {
  if (visited.has(constName)) {
    throw new Error(`Circular method array alias: ${constName} in ${filePath}`)
  }
  visited.add(constName)
  const source = readSourceFile(filePath)

  const declaration = source.ast.statements
    .filter((statement) => ts.isVariableStatement(statement))
    .flatMap((statement) => statement.declarationList.declarations)
    .find((variableDeclaration) => ts.isIdentifier(variableDeclaration.name) && variableDeclaration.name.text === constName)

  if (!declaration || !declaration.initializer) {
    throw new Error(`Unable to find ${constName} in ${filePath}`)
  }

  const initializer = unwrapExpression(declaration.initializer)
  if (ts.isIdentifier(initializer)) {
    return parseMethodArray(filePath, initializer.text, visited)
  }
  if (!ts.isArrayLiteralExpression(initializer)) {
    throw new Error(`${constName} is not an array literal`)
  }

  const methods: MethodGroupItem[] = []
  let currentGroup = '기타'

  for (const element of initializer.elements) {
    if (!ts.isStringLiteral(element) && !ts.isNoSubstitutionTemplateLiteral(element)) {
      continue
    }

    const commentRanges = ts.getLeadingCommentRanges(source.text, element.pos) ?? []
    for (const range of commentRanges) {
      const value = normalizeCommentText(source.text.slice(range.pos, range.end))
      if (value) {
        currentGroup = value
      }
    }

    methods.push({
      name: element.text,
      group: currentGroup,
    })
  }

  return methods
}

function readSourceFile(filePath: string): SourceWithAst {
  const cached = sourceFileCache.get(filePath)
  if (cached) return cached
  const text = fs.readFileSync(filePath, 'utf8')
  const ast = ts.createSourceFile(filePath, text, ts.ScriptTarget.Latest, true, ts.ScriptKind.TS)
  const source = { filePath, text, ast }
  sourceFileCache.set(filePath, source)
  return source
}

function readTypeSources(directory: string): SourceWithAst[] {
  return fs
    .readdirSync(directory, { withFileTypes: true })
    .sort((a, b) => a.name.localeCompare(b.name))
    .flatMap((entry) => {
      const filePath = path.join(directory, entry.name)
      return entry.isDirectory() ? readTypeSources(filePath) : entry.isFile() && entry.name.endsWith('.ts') ? [readSourceFile(filePath)] : []
    })
}

function hasVariableDeclaration(source: SourceWithAst, name: string): boolean {
  return source.ast.statements.some(
    (statement) =>
      ts.isVariableStatement(statement) &&
      statement.declarationList.declarations.some((declaration) => ts.isIdentifier(declaration.name) && declaration.name.text === name)
  )
}

function readLocalTypeDependencies(source: SourceWithAst, visited = new Set<string>()): SourceWithAst[] {
  if (visited.has(source.filePath)) return []
  visited.add(source.filePath)
  const sources = [source]
  for (const statement of source.ast.statements) {
    if (!ts.isImportDeclaration(statement) || !ts.isStringLiteral(statement.moduleSpecifier)) continue
    const specifier = statement.moduleSpecifier.text
    const packageSource = source.filePath.split(`${path.sep}src${path.sep}`)[0]
    const target = specifier.startsWith('.')
      ? path.resolve(path.dirname(source.filePath), specifier)
      : specifier.startsWith('@/')
        ? path.join(packageSource!, 'src', specifier.slice(2))
        : undefined
    if (!target) continue
    const filePath = [`${target}.ts`, path.join(target, 'index.ts')].find((filePath) => fs.existsSync(filePath))
    if (filePath) sources.push(...readLocalTypeDependencies(readSourceFile(filePath), visited))
  }
  return sources
}

function readJson<T>(filePath: string): T {
  return JSON.parse(fs.readFileSync(filePath, 'utf8')) as T
}

function writeJson(filePath: string, value: unknown): void {
  writeFile(filePath, `${JSON.stringify(value, null, 2)}\n`)
}

function writeFile(filePath: string, content: string): void {
  fs.mkdirSync(path.dirname(filePath), { recursive: true })
  fs.writeFileSync(filePath, content, 'utf8')
}

function groupBy<TItem, TKey>(items: readonly TItem[], keySelector: (item: TItem) => TKey): Map<TKey, TItem[]> {
  const groups = new Map<TKey, TItem[]>()
  for (const item of items) {
    const key = keySelector(item)
    const group = groups.get(key)
    if (group) {
      group.push(item)
      continue
    }

    groups.set(key, [item])
  }
  return groups
}

function getPropertyName(nameNode: ts.PropertyName, sourceFile: ts.SourceFile): string {
  if (ts.isIdentifier(nameNode)) {
    return nameNode.text
  }
  if (ts.isStringLiteral(nameNode) || ts.isNumericLiteral(nameNode)) {
    return nameNode.text
  }
  return nameNode.getText(sourceFile)
}

function unwrapExpression(expression: ts.Expression): ts.Expression {
  let current = expression
  while (ts.isAsExpression(current) || ts.isSatisfiesExpression(current) || ts.isParenthesizedExpression(current)) {
    current = current.expression
  }
  return current
}

function unwrapObjectLiteral(expression: ts.Expression): ts.ObjectLiteralExpression | null {
  const unwrapped = unwrapExpression(expression)
  if (!ts.isObjectLiteralExpression(unwrapped)) {
    return null
  }
  return unwrapped
}

function literalValue(expression: ts.Expression): JsonPrimitive | undefined {
  if (ts.isStringLiteral(expression) || ts.isNoSubstitutionTemplateLiteral(expression)) {
    return expression.text
  }
  if (ts.isNumericLiteral(expression)) {
    return Number(expression.text)
  }
  if (expression.kind === ts.SyntaxKind.TrueKeyword) {
    return true
  }
  if (expression.kind === ts.SyntaxKind.FalseKeyword) {
    return false
  }
  if (expression.kind === ts.SyntaxKind.NullKeyword) {
    return null
  }
  return undefined
}

function normalizeCommentText(rawCommentText: string): string | null {
  const trimmed = rawCommentText.trim()
  if (trimmed.startsWith('//')) {
    return trimmed.replace(/^\/\//, '').trim()
  }

  if (trimmed.startsWith('/*')) {
    return trimmed
      .replace(/^\/\*+/, '')
      .replace(/\*+\/$/, '')
      .replace(/^\s*\*\s?/gm, '')
      .trim()
  }

  return trimmed || null
}

function getNodeDescription(node: ts.Node & { jsDoc?: readonly ts.JSDoc[] }): string {
  const jsDoc = node.jsDoc ?? []
  if (jsDoc.length === 0) {
    return ''
  }

  const parts: string[] = []
  for (const doc of jsDoc) {
    const comment = printJSDocComment(doc.comment)
    if (!comment) {
      continue
    }
    parts.push(comment)
  }

  return parts.join('\n').trim()
}

function printJSDocComment(comment: ts.JSDoc['comment']): string {
  if (!comment) {
    return ''
  }
  if (typeof comment === 'string') {
    return comment.trim()
  }
  if (Array.isArray(comment)) {
    return comment
      .map((piece) => {
        if ('text' in piece && typeof piece.text === 'string') {
          return piece.text
        }
        return ''
      })
      .join('')
      .trim()
  }
  return ''
}

function extractCompatMethodName(summaryText: string): string | null {
  const match = summaryText.match(/Compat:\s*`([^`]+)`/)
  return match?.[1] ?? null
}

function extractPromiseReturnType(typeNode: ts.TypeNode | undefined, sourceFile: ts.SourceFile): string | null {
  if (!typeNode) {
    return null
  }

  if (!ts.isTypeReferenceNode(typeNode)) {
    return null
  }

  if (typeNode.typeName.getText(sourceFile) !== 'Promise') {
    return null
  }

  const typeArguments = typeNode.typeArguments ?? []
  const firstTypeArgument = typeArguments[0]
  if (!firstTypeArgument) {
    return null
  }
  return firstTypeArgument.getText(sourceFile)
}

function extractEnumConstName(typeText: string): string | null {
  const compact = typeText.replace(/\s+/g, '')
  const match = compact.match(/^\(typeof([A-Za-z0-9_]+)\)\[keyoftypeof\1\]$/)
  return match?.[1] ?? null
}

function extractLiteralUnionValues(typeNode: ts.TypeNode): JsonPrimitive[] | null {
  if (!ts.isUnionTypeNode(typeNode)) {
    return null
  }

  const values: JsonPrimitive[] = []
  for (const member of typeNode.types) {
    if (!ts.isLiteralTypeNode(member)) {
      return null
    }

    const value = literalValue(member.literal)
    if (value === undefined) {
      return null
    }
    values.push(value)
  }

  return values.length > 0 ? values : null
}

function inferJsonType(typeCatalog: TypeCatalog, typeText: string, visited = new Set<string>()): string {
  const value = typeText.trim()

  if (value.endsWith('[]')) {
    return 'array'
  }
  if (value === 'string') {
    return 'string'
  }
  if (value === 'number' || value === 'bigint') {
    return 'number'
  }
  if (value === 'boolean') {
    return 'boolean'
  }
  if (value === 'null') {
    return 'null'
  }
  if (value === 'Buffer') {
    return 'string'
  }
  if (value.includes('|')) {
    return 'union'
  }

  const typeName = parseTypeReference(value).name
  const typeDef = typeCatalog.types.get(typeName)
  if (!typeDef || visited.has(typeName)) {
    return 'unknown'
  }
  if (typeDef.kind === 'interface') {
    return 'object'
  }
  visited.add(typeName)

  if (typeDef.enumValues && typeDef.enumValues.length > 0) {
    const valueTypes = new Set(
      typeDef.enumValues.map((entry) => {
        const enumValue = entry !== null && typeof entry === 'object' ? entry.value : entry
        return enumValue === null ? 'null' : typeof enumValue
      })
    )
    return valueTypes.size === 1 ? ([...valueTypes][0] ?? 'unknown') : 'union'
  }

  return inferJsonType(typeCatalog, typeDef.typeText, visited)
}

function toKebabCase(value: string): string {
  const acronymWords = ['URL', 'PDF', 'SMS', 'FAX', 'XML', 'NTS', 'API', 'OID', 'ID']
  let normalized = value

  for (const acronym of acronymWords) {
    const replacement = `${acronym[0]}${acronym.slice(1).toLowerCase()}`
    normalized = normalized.replaceAll(acronym, replacement)
  }

  return normalized
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .replace(/_/g, '-')
    .toLowerCase()
}

function escapeTable(value: string): string {
  if (!value) {
    return ''
  }
  return value.replace(/\|/g, '\\|').replace(/\n/g, '<br />')
}
