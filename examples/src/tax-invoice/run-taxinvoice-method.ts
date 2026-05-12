import { createExampleContext } from './context.ts'
import { COMPAT_METHOD_NAME_BY_METHOD, METHODS, METHOD_GROUPS, type MethodName } from './methods/index.ts'
import { loadRuntimeConfig } from './utils/env.ts'
import { formatError } from './utils/error.ts'
import { logError, logInfo, logWarn, printHeader } from './utils/log.ts'
import { createRunner } from './utils/runner.ts'

main().catch((error) => {
  logError('예상하지 못한 런타임 에러', formatError(error))
  process.exitCode = 1
})

async function main(): Promise<void> {
  printHeader('POPBILL TAX INVOICE METHOD EXAMPLES')
  logInfo('dotenvx 환경변수 로딩 기준으로 실행')
  const rawArgs = process.argv.slice(2)
  const requestedHelp = hasFlag(rawArgs, ['--help', '-h'])
  const verboseHelp = hasFlag(rawArgs, ['--verbose'])

  const targetMethods = parseMethodArgs(rawArgs)
  if (targetMethods === null) {
    printUsage(verboseHelp)
    process.exitCode = requestedHelp ? 0 : 1
    return
  }

  const config = loadRuntimeConfig()
  if (config.missingNames.length > 0) {
    logError('필수 환경변수 누락', {
      missingNames: config.missingNames,
      hint: 'examples/.env.example 참고해서 examples/.env 생성',
    })
    process.exitCode = 1
    return
  }

  const context = createExampleContext(config)
  const runner = createRunner()

  logInfo('실행 메서드', {
    methods: targetMethods,
    isTest: config.isTest,
    useLocalTime: config.useLocalTime,
    timeoutMs: config.requestTimeoutMs,
  })

  for (const methodName of targetMethods) {
    printHeader(`METHOD: ${methodName}`)
    await METHODS[methodName].run(context, runner)
  }

  printHeader('SUMMARY')
  logInfo('총 API 호출 결과', {
    total: runner.stats.total,
    passed: runner.stats.passed,
    failed: runner.stats.failed,
  })

  if (runner.stats.failed > 0) {
    logWarn('실패한 API 호출', runner.stats.failures)
    process.exitCode = 1
    return
  }

  logInfo('모든 호출 성공')
}

function parseMethodArgs(rawArgs: string[]): MethodName[] | null {
  const allMethodNames = Object.keys(METHODS) as MethodName[]
  const normalizedArgs = rawArgs.map((value) => value.trim()).filter((value) => value.length > 0 && value !== '--')

  if (normalizedArgs.length === 0) {
    return null
  }

  if (hasFlag(normalizedArgs, ['--help', '-h'])) {
    return null
  }

  const selectedTokens = normalizedArgs
    .filter((value) => !value.startsWith('-'))
    .flatMap((value) => value.split(','))
    .map((value) => value.trim())
    .filter((value) => value.length > 0)

  if (selectedTokens.length === 0) {
    return null
  }

  if (selectedTokens.includes('all')) {
    return allMethodNames
  }

  const unknown = selectedTokens.filter((value) => !isMethodName(value, allMethodNames))
  if (unknown.length > 0) {
    logError('알 수 없는 method', {
      unknown,
      hint: 'pnpm -C examples taxinvoice:method:list',
    })
    return null
  }

  return selectedTokens.filter((value): value is MethodName => isMethodName(value, allMethodNames))
}

function isMethodName(value: string, allMethodNames: readonly MethodName[]): value is MethodName {
  return allMethodNames.some((name) => name === value)
}

function printUsage(verbose = false): void {
  const lines: string[] = []
  lines.push('실행 방법')
  lines.push('  pnpm -C examples taxinvoice:method -- <method[,method...]>')
  lines.push('  pnpm -C examples taxinvoice:method -- all')
  lines.push('')
  lines.push('메서드 목록')

  for (const [groupName, methodNames] of Object.entries(METHOD_GROUPS)) {
    lines.push(`  [${groupName}]`)
    for (const methodName of methodNames) {
      const definition = METHODS[methodName as MethodName]
      const compatMethodName = COMPAT_METHOD_NAME_BY_METHOD[methodName as MethodName]
      if (verbose) {
        lines.push(`    ${methodName}(${compatMethodName}): ${definition.description}`)
      } else {
        lines.push(`    ${methodName}: ${definition.description}`)
      }
    }
  }

  lines.push('')
  lines.push('예시')
  lines.push('  pnpm -C examples taxinvoice:method -- issueInvoiceImmediately')
  lines.push('  pnpm -C examples taxinvoice:method -- getInvoiceDetailInfo')
  lines.push('  pnpm -C examples taxinvoice:method -- issueInvoice,getInvoicePDFURL')
  lines.push('')
  lines.push('상세(compat 메서드명 포함)')
  lines.push('  pnpm -C examples taxinvoice:method:list:verbose')

  console.log(lines.join('\n'))
}

function hasFlag(args: readonly string[], candidates: readonly string[]): boolean {
  return args.some((arg) => candidates.some((candidate) => candidate === arg))
}
