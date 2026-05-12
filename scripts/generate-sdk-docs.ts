import fs from 'node:fs'
import path from 'node:path'
import * as ts from 'typescript'

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
}

interface WritePopbillDocsInput {
  methodGroups: MethodGroupItem[]
  groupedMethods: Map<string, MethodGroupItem[]>
  methodByName: Map<string, MethodSignatureInfo>
  serviceDescription: string
  typeCatalog: TypeCatalog
}

interface WriteCompatDocsInput {
  methodGroups: MethodGroupItem[]
  groupedMethods: Map<string, MethodGroupItem[]>
  methodByName: Map<string, MethodSignatureInfo>
  serviceDescription: string
  modernByCompatMethodName: Map<string, string>
  callbackMetadataByMethodName: Map<string, CallbackMetadata>
  requiredMethods: Set<string>
}

interface WriteGeneratedJsonInput {
  popbillVersion: string
  compatVersion: string
  popbillMethodGroups: MethodGroupItem[]
  compatMethodGroups: MethodGroupItem[]
  popbillMethodByName: Map<string, MethodSignatureInfo>
  compatMethodByName: Map<string, MethodSignatureInfo>
  modernByCompatMethodName: Map<string, string>
  compatMap: CompatMappingItem[]
  compatCallbackMetadata: Map<string, CallbackMetadata>
  compatRequiredMethods: Set<string>
  popbillTypeCatalog: TypeCatalog
}

const rootDir = process.cwd()

const popbillPaths = {
  packageJson: path.join(rootDir, 'packages/popbill/package.json'),
  methods: path.join(rootDir, 'packages/popbill/src/services/tax-invoice/methods.ts'),
  types: path.join(rootDir, 'packages/popbill/src/services/tax-invoice/types/index.ts'),
  typeSources: [
    path.join(rootDir, 'packages/popbill/src/services/tax-invoice/types/index.ts'),
    path.join(rootDir, 'packages/popbill/src/services/tax-invoice/types/document.ts'),
    path.join(rootDir, 'packages/popbill/src/services/tax-invoice/types/response.ts'),
  ],
}

const compatPaths = {
  packageJson: path.join(rootDir, 'packages/popbill-compat/package.json'),
  methods: path.join(rootDir, 'packages/popbill-compat/src/services/taxinvoice/methods.ts'),
  types: path.join(rootDir, 'packages/popbill-compat/src/services/taxinvoice/types.ts'),
}

const docsRoot = path.join(rootDir, 'docs/sdk')
const generatedRoot = path.join(docsRoot, 'generated')
const compatKeyTypeParameterTypes = new Map<string, string>([
  ['update', "'SELL' | 'TRUSTEE'"],
  ['issue', "'SELL' | 'TRUSTEE'"],
  ['cancelIssue', "'SELL' | 'TRUSTEE'"],
  ['request', "'BUY'"],
  ['cancelRequest', "'BUY'"],
  ['refuse', "'SELL'"],
  ['sendToNTS', "'SELL' | 'TRUSTEE'"],
])

main()

function main() {
  const popbillPackage = readJson<PackageManifest>(popbillPaths.packageJson)
  const compatPackage = readJson<PackageManifest>(compatPaths.packageJson)

  const popbillMethodGroups = parseMethodArray(popbillPaths.methods, 'TAX_INVOICE_METHODS')
  const compatMethodGroups = parseMethodArray(compatPaths.methods, 'TAXINVOICE_METHODS')
  const compatRequiredMethods = new Set(parseMethodArray(compatPaths.methods, 'TAXINVOICE_REQUIRED_METHODS').map((x) => x.name))

  const popbillTypeSources = popbillPaths.typeSources.map(readSourceFile)
  const popbillTypeCatalog = buildTypeCatalog(popbillTypeSources)

  const popbillTypesSource = readSourceFile(popbillPaths.types)
  const popbillServiceDescription = parseInterfaceDescription(popbillTypesSource, 'TaxInvoiceService')
  const popbillServiceMethods = parseMethodSignatures(popbillTypesSource, 'TaxInvoiceService')
  const popbillMethodByName = buildMethodByName(popbillServiceMethods)

  const compatTypesSource = readSourceFile(compatPaths.types)
  const compatServiceDescription = parseInterfaceDescription(compatTypesSource, 'TaxinvoicePromiseService')
  const compatPromiseMethods = parseMethodSignatures(compatTypesSource, 'TaxinvoicePromiseService')
  const compatCallbackMetadata = parseCallbackMetadata(compatTypesSource, 'TaxinvoiceCallbackService')
  const compatMethodByName = buildMethodByName(compatPromiseMethods)

  const compatMap: CompatMappingItem[] = []
  const modernByCompatMethodName = new Map<string, string>()

  for (const { name: methodName, group } of popbillMethodGroups) {
    const method = popbillMethodByName.get(methodName)
    if (!method) {
      continue
    }

    const compatMethodName = method.compatMethodName ?? null
    if (compatMethodName) {
      compatMap.push({
        modernMethodName: methodName,
        compatMethodName,
        group,
        summary: method.summary,
      })
      modernByCompatMethodName.set(compatMethodName, methodName)
    }
  }

  const popbillDocsByGroup = groupBy(popbillMethodGroups, (methodGroupItem) => methodGroupItem.group)
  const compatDocsByGroup = groupBy(compatMethodGroups, (methodGroupItem) => methodGroupItem.group)

  resetOutputRoots()

  writeRootReadme({
    popbillVersion: popbillPackage.version,
    compatVersion: compatPackage.version,
  })
  writePopbillDocs({
    methodGroups: popbillMethodGroups,
    groupedMethods: popbillDocsByGroup,
    methodByName: popbillMethodByName,
    serviceDescription: popbillServiceDescription,
    typeCatalog: popbillTypeCatalog,
  })
  writeCompatDocs({
    methodGroups: compatMethodGroups,
    groupedMethods: compatDocsByGroup,
    methodByName: compatMethodByName,
    serviceDescription: compatServiceDescription,
    modernByCompatMethodName,
    callbackMetadataByMethodName: compatCallbackMetadata,
    requiredMethods: compatRequiredMethods,
  })
  writeGeneratedJson({
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

  process.stdout.write('SDK docs generated at docs/sdk\n')
}

function resetOutputRoots() {
  fs.rmSync(path.join(docsRoot, 'popbill'), { recursive: true, force: true })
  fs.rmSync(path.join(docsRoot, 'popbill-compat'), { recursive: true, force: true })
  fs.rmSync(generatedRoot, { recursive: true, force: true })
  fs.mkdirSync(docsRoot, { recursive: true })
}

function writeRootReadme({ popbillVersion, compatVersion }: WriteRootReadmeInput): void {
  const content = [
    '# SDK Docs',
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
    '## Human Docs',
    '',
    '- modern',
    '  - [popbill tax-invoice index](./popbill/tax-invoice/index.md)',
    '- compat',
    '  - [popbill-compat taxinvoice index](./popbill-compat/taxinvoice/index.md)',
    '',
    '## AI Docs',
    '',
    '- indexes',
    '  - [method-index.json](./generated/method-index.json)',
    '  - [compat-map.json](./generated/compat-map.json)',
    '- schema indexes',
    '  - [popbill type schemas](./generated/schemas/popbill/tax-invoice/types/index.json)',
    '  - [popbill-compat method schemas](./generated/schemas/popbill-compat/taxinvoice/methods/index.json)',
    '',
  ].join('\n')

  writeFile(path.join(docsRoot, 'README.md'), content)
}

function writePopbillDocs({ methodGroups, groupedMethods, methodByName, serviceDescription, typeCatalog }: WritePopbillDocsInput): void {
  const methodDir = path.join(docsRoot, 'popbill/tax-invoice/methods')
  const indexPath = path.join(docsRoot, 'popbill/tax-invoice/index.md')

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
    lines.push(`service: taxInvoice`)
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
          lines.push(`| \`${property.name}\` | \`${property.typeText}\` | ${property.required ? 'Y' : 'N'} | ${escapeTable(property.description)} |`)
        }
        lines.push('')
      } else if (inputSchema && inputSchema.aliasOf) {
        lines.push(`- Alias of: \`${inputSchema.aliasOf}\``)
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
        lines.push(`| \`${property.name}\` | \`${property.typeText}\` | ${property.required ? 'Y' : 'N'} | ${escapeTable(property.description)} |`)
      }
      lines.push('')
    } else if (returnSchema && returnSchema.aliasOf) {
      lines.push(`- Alias of: \`${returnSchema.aliasOf}\``)
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
          service: 'taxInvoice',
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
  indexLines.push('# popbill / taxInvoice')
  indexLines.push('')
  indexLines.push(serviceDescription || 'TaxInvoice modern facade 서비스 인터페이스입니다.')
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
  methodGroups,
  groupedMethods,
  methodByName,
  serviceDescription,
  modernByCompatMethodName,
  callbackMetadataByMethodName,
  requiredMethods,
}: WriteCompatDocsInput): void {
  const methodDir = path.join(docsRoot, 'popbill-compat/taxinvoice/methods')
  const indexPath = path.join(docsRoot, 'popbill-compat/taxinvoice/index.md')

  for (const { name: methodName, group } of methodGroups) {
    const method = methodByName.get(methodName)
    if (!method) {
      continue
    }

    const callbackMeta = callbackMetadataByMethodName.get(methodName) ?? null
    const modernMethodName = modernByCompatMethodName.get(methodName) ?? null
    const required = requiredMethods.has(methodName)

    const lines = []
    lines.push('---')
    lines.push('sdk: popbill-compat')
    lines.push('service: TaxinvoiceService')
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
      lines.push(`modern SDK 대응 메서드: \`${modernMethodName}\``)
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
          lines.push(`| \`${parameter.name}\` | \`${compatParameterTypeText(methodName, parameter)}\` | ${parameter.optional ? 'Y' : 'N'} |`)
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
        lines.push(`| \`${parameter.name}\` | \`${compatParameterTypeText(methodName, parameter)}\` | ${parameter.optional ? 'Y' : 'N'} |`)
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
    lines.push(`- Modern mapping: \`${modernMethodName ?? 'none'}\``)
    lines.push('')
    lines.push('## AI Metadata')
    lines.push('')
    lines.push('```json')
    lines.push(
      JSON.stringify(
        {
          sdk: 'popbill-compat',
          service: 'TaxinvoiceService',
          methodName,
          group,
          required,
          promiseSignature: formatCompatSignature(methodName, method),
          promiseSignatures: method.overloads.map((overload) => formatCompatSignature(methodName, overload)),
          modernMethodName,
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
  indexLines.push('# popbill-compat / TaxinvoiceService')
  indexLines.push('')
  indexLines.push(serviceDescription || 'Promise 기반 legacy TaxinvoiceService 인터페이스입니다.')
  indexLines.push('')

  for (const [group, methods] of groupedMethods) {
    indexLines.push(`## ${group}`)
    indexLines.push('')
    for (const item of methods) {
      const method = methodByName.get(item.name)
      if (!method) {
        continue
      }

      const modernMethodName = modernByCompatMethodName.get(item.name)
      const suffix = modernMethodName ? ` -> modern: \`${modernMethodName}\`` : ' -> legacy-only'
      indexLines.push(`- [\`${item.name}\`](./methods/${toKebabCase(item.name)}.md)${suffix}`)
    }
    indexLines.push('')
  }

  writeFile(indexPath, indexLines.join('\n'))
}

function writeGeneratedJson({
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
}: WriteGeneratedJsonInput): void {
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
            service: 'taxInvoice',
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
            service: 'TaxinvoiceService',
            group,
            methodName: name,
            required: compatRequiredMethods.has(name),
            promiseSignature: formatCompatSignature(name, method),
            promiseSignatures: method.overloads.map((overload) => formatCompatSignature(name, overload)),
            outputType: method.promiseReturnType ?? method.returnTypeText,
            callback: compatCallbackMetadata.get(name) ?? null,
            mappedModernMethodName: modernByCompatMethodName.get(name) ?? null,
          }
        })
        .filter(Boolean),
    ],
  }

  const compatMapJson = {
    schemaVersion: 1,
    generatedBy: 'scripts/generate-sdk-docs.ts',
    mappings: compatMap,
  }

  writeJson(path.join(generatedRoot, 'method-index.json'), methodIndex)
  writeJson(path.join(generatedRoot, 'compat-map.json'), compatMapJson)

  const popbillSchemaRoot = path.join(generatedRoot, 'schemas/popbill/tax-invoice/types')
  const popbillTypesIndex = []

  for (const [typeName, typeDef] of [...popbillTypeCatalog.types.entries()].sort(([a], [b]) => a.localeCompare(b))) {
    const schema = createSchemaForType(popbillTypeCatalog, typeName)
    popbillTypesIndex.push({
      typeName,
      kind: typeDef.kind,
      file: `./types/${toKebabCase(typeName)}.json`,
    })
    writeJson(path.join(popbillSchemaRoot, `${toKebabCase(typeName)}.json`), schema)
  }

  writeJson(path.join(generatedRoot, 'schemas/popbill/tax-invoice/types/index.json'), {
    schemaVersion: 1,
    service: 'taxInvoice',
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
      service: 'TaxinvoiceService',
      methodName,
      required: compatRequiredMethods.has(methodName),
      promiseSignature: formatCompatSignature(methodName, method),
      promiseSignatures: method.overloads.map((overload) => formatCompatSignature(methodName, overload)),
      parameters: method.parameters.map((parameter) => ({
        name: parameter.name,
        type: compatParameterTypeText(methodName, parameter),
        optional: parameter.optional,
      })),
      overloads: method.overloads.map((overload) => ({
        promiseSignature: formatCompatSignature(methodName, overload),
        parameters: overload.parameters.map((parameter) => ({
          name: parameter.name,
          type: compatParameterTypeText(methodName, parameter),
          optional: parameter.optional,
        })),
        outputType: overload.promiseReturnType ?? overload.returnTypeText,
      })),
      outputType: method.promiseReturnType ?? method.returnTypeText,
      callback,
      mappedModernMethodName: modernByCompatMethodName.get(methodName) ?? null,
    }

    compatMethodSchemas.push({
      methodName,
      file: `./methods/${toKebabCase(methodName)}.json`,
    })
    writeJson(path.join(generatedRoot, 'schemas/popbill-compat/taxinvoice/methods', `${toKebabCase(methodName)}.json`), schema)
  }

  writeJson(path.join(generatedRoot, 'schemas/popbill-compat/taxinvoice/methods/index.json'), {
    schemaVersion: 1,
    service: 'TaxinvoiceService',
    methods: compatMethodSchemas,
  })
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
                name: typeNode.expression.getText(source.ast),
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
          extendsTypes,
          properties,
          enumValues: null,
        })
        continue
      }

      if (ts.isTypeAliasDeclaration(statement)) {
        const typeText = statement.type.getText(source.ast)
        const description = getNodeDescription(statement)
        const aliasOf = ts.isTypeReferenceNode(statement.type) ? statement.type.typeName.getText(source.ast) : null
        const enumFromConst = extractEnumConstName(typeText)
        const enumValues = enumFromConst ? (constObjects.get(enumFromConst) ?? null) : extractLiteralUnionValues(statement.type)

        types.set(statement.name.text, {
          kind: 'typeAlias',
          name: statement.name.text,
          description,
          filePath: source.filePath,
          typeText,
          aliasOf,
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
  const normalizedName = typeName.replace(/\[\]$/, '').trim()
  const isArray = normalizedName !== typeName
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

  const flattenedProperties = flattenTypeProperties(typeCatalog, normalizedName)

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
      jsonType: inferJsonType(property.typeText),
    })),
  }
}

function flattenTypeProperties(typeCatalog: TypeCatalog, typeName: string, visited: Set<string> = new Set<string>()): TypeProperty[] {
  if (visited.has(typeName)) {
    return []
  }
  visited.add(typeName)

  const typeDef = typeCatalog.types.get(typeName)
  if (!typeDef) {
    return []
  }

  if (typeDef.aliasOf && typeDef.aliasOf !== typeName) {
    return flattenTypeProperties(typeCatalog, typeDef.aliasOf, visited)
  }

  const inherited: TypeProperty[] = []
  for (const parentName of typeDef.extendsTypes) {
    inherited.push(...flattenTypeProperties(typeCatalog, parentName, visited))
  }

  const merged = new Map<string, TypeProperty>()
  for (const property of inherited) {
    merged.set(property.name, property)
  }
  for (const property of typeDef.properties) {
    merged.set(property.name, property)
  }

  return [...merged.values()]
}

function parseMethodSignatures(source: SourceWithAst, interfaceName: string): MethodSignatureInfo[] {
  const interfaceDeclaration = source.ast.statements.find(
    (statement): statement is ts.InterfaceDeclaration => ts.isInterfaceDeclaration(statement) && statement.name.text === interfaceName
  )
  if (!interfaceDeclaration) {
    throw new Error(`Interface ${interfaceName} not found in ${source.filePath}`)
  }

  const methods: MethodSignatureInfo[] = []
  for (const member of interfaceDeclaration.members) {
    if (!ts.isMethodSignature(member)) {
      continue
    }

    const methodName = getPropertyName(member.name, source.ast)
    if (!methodName) {
      continue
    }

    const parameters = member.parameters.map((parameter) => ({
      name: parameter.name.getText(source.ast),
      optional: Boolean(parameter.questionToken),
      typeText: parameter.type ? parameter.type.getText(source.ast) : 'unknown',
    }))
    const returnTypeText = member.type ? member.type.getText(source.ast) : 'void'
    const promiseReturnType = extractPromiseReturnType(member.type, source.ast)
    const summary = getNodeDescription(member)
    const compatMethodName = extractCompatMethodName(summary)
    const cleanedSummary = summary.replace(/\n?\s*Compat:\s*`[^`]+`\s*/g, '').trim()
    const signature = `${methodName}(${parameters
      .map((parameter) => `${parameter.name}${parameter.optional ? '?' : ''}: ${parameter.typeText}`)
      .join(', ')}): ${returnTypeText}`

    methods.push({
      name: methodName,
      summary: cleanedSummary,
      compatMethodName,
      parameters,
      returnTypeText,
      promiseReturnType,
      signature,
      overloads: [
        {
          parameters,
          returnTypeText,
          promiseReturnType,
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

function compatParameterTypeText(methodName: string, parameter: MethodParameter): string {
  if (parameter.name === 'keyType') {
    return compatKeyTypeParameterTypes.get(methodName) ?? parameter.typeText
  }

  return parameter.typeText
}

function formatCompatSignature(methodName: string, overload: MethodOverloadInfo): string {
  return `${methodName}(${overload.parameters
    .map((parameter) => `${parameter.name}${parameter.optional ? '?' : ''}: ${compatParameterTypeText(methodName, parameter)}`)
    .join(', ')}): ${overload.returnTypeText}`
}

function parseCallbackMetadata(source: SourceWithAst, interfaceName: string): Map<string, CallbackMetadata> {
  const callbackTypeOverloadCount = new Map<string, number>()

  for (const statement of source.ast.statements) {
    if (ts.isInterfaceDeclaration(statement)) {
      const callSignatures = statement.members.filter((member) => ts.isCallSignatureDeclaration(member))
      if (callSignatures.length > 0) {
        callbackTypeOverloadCount.set(statement.name.text, callSignatures.length)
      }
      continue
    }

    if (ts.isTypeAliasDeclaration(statement)) {
      if (ts.isFunctionTypeNode(statement.type)) {
        callbackTypeOverloadCount.set(statement.name.text, 1)
        continue
      }

      if (ts.isTypeLiteralNode(statement.type)) {
        const count = statement.type.members.filter((member) => ts.isCallSignatureDeclaration(member)).length
        if (count > 0) {
          callbackTypeOverloadCount.set(statement.name.text, count)
        }
      }
    }
  }

  const serviceInterface = source.ast.statements.find(
    (statement): statement is ts.InterfaceDeclaration => ts.isInterfaceDeclaration(statement) && statement.name.text === interfaceName
  )
  if (!serviceInterface) {
    throw new Error(`Interface ${interfaceName} not found in ${source.filePath}`)
  }

  const callbackMetadataByMethodName = new Map<string, CallbackMetadata>()
  for (const member of serviceInterface.members) {
    if (!ts.isPropertySignature(member)) {
      continue
    }
    const methodName = getPropertyName(member.name, source.ast)
    if (!methodName || !member.type) {
      continue
    }

    let typeName = null
    let overloadCount = null
    if (ts.isTypeReferenceNode(member.type)) {
      typeName = member.type.typeName.getText(source.ast)
      overloadCount = callbackTypeOverloadCount.get(typeName) ?? null
    }

    callbackMetadataByMethodName.set(methodName, {
      typeText: member.type.getText(source.ast),
      typeName,
      overloadCount,
    })
  }

  return callbackMetadataByMethodName
}

function parseInterfaceDescription(source: SourceWithAst, interfaceName: string): string {
  const interfaceDeclaration = source.ast.statements.find(
    (statement): statement is ts.InterfaceDeclaration => ts.isInterfaceDeclaration(statement) && statement.name.text === interfaceName
  )

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

function parseMethodArray(filePath: string, constName: string): MethodGroupItem[] {
  const source = readSourceFile(filePath)

  const declaration = source.ast.statements
    .filter((statement) => ts.isVariableStatement(statement))
    .flatMap((statement) => statement.declarationList.declarations)
    .find((variableDeclaration) => ts.isIdentifier(variableDeclaration.name) && variableDeclaration.name.text === constName)

  if (!declaration || !declaration.initializer) {
    throw new Error(`Unable to find ${constName} in ${filePath}`)
  }

  const initializer = unwrapExpression(declaration.initializer)
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
  const text = fs.readFileSync(filePath, 'utf8')
  const ast = ts.createSourceFile(filePath, text, ts.ScriptTarget.Latest, true, ts.ScriptKind.TS)
  return { filePath, text, ast }
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

function inferJsonType(typeText: string): string {
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

  return 'object'
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
