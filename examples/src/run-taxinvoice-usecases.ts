import { SCENARIOS, type ScenarioName } from './scenarios/index.ts'
import { createExampleContext } from './context.ts'
import type { ScenarioDefinition } from './types.ts'
import { loadRuntimeConfig } from './utils/env.ts'
import { formatError } from './utils/error.ts'
import { logError, logInfo, logWarn, printHeader } from './utils/log.ts'
import { createRunner } from './utils/runner.ts'

main().catch((error) => {
  logError('예상하지 못한 런타임 에러', formatError(error))
  process.exitCode = 1
})

async function main(): Promise<void> {
  printHeader('POPBILL TAX INVOICE EXAMPLES')
  logInfo('dotenvx 환경변수 로딩 기준으로 실행')

  const targetScenarios = parseScenarioArgs(process.argv.slice(2))
  if (targetScenarios === null) {
    printUsage()
    process.exitCode = 1
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

  logInfo('실행 시나리오', {
    scenarios: targetScenarios,
    isTest: config.isTest,
    useLocalTime: config.useLocalTime,
    timeoutMs: config.requestTimeoutMs,
  })

  for (const scenarioName of targetScenarios) {
    printHeader(`SCENARIO: ${scenarioName}`)
    await SCENARIOS[scenarioName].run(context, runner)
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

function parseScenarioArgs(rawArgs: string[]): ScenarioName[] | null {
  const allScenarioNames = Object.keys(SCENARIOS) as ScenarioName[]
  const normalizedArgs = rawArgs.map((value) => value.trim()).filter((value) => value.length > 0 && value !== '--')

  if (normalizedArgs.length === 0) {
    return allScenarioNames
  }

  if (normalizedArgs.includes('--help') || normalizedArgs.includes('-h')) {
    return null
  }

  const selectedTokens = normalizedArgs
    .flatMap((value) => value.split(','))
    .map((value) => value.trim())
    .filter((value) => value.length > 0)

  if (selectedTokens.length === 0) {
    return allScenarioNames
  }

  if (selectedTokens.includes('all')) {
    return allScenarioNames
  }

  const unknown = selectedTokens.filter((value) => !isScenarioName(value, allScenarioNames))
  if (unknown.length > 0) {
    logError('알 수 없는 scenario', {
      unknown,
      available: allScenarioNames,
    })
    return null
  }

  return selectedTokens.filter((value): value is ScenarioName => isScenarioName(value, allScenarioNames))
}

function isScenarioName(value: string, allScenarioNames: readonly ScenarioName[]): value is ScenarioName {
  return allScenarioNames.some((name) => name === value)
}

function printUsage(): void {
  const available = (Object.entries(SCENARIOS) as Array<[ScenarioName, ScenarioDefinition]>).map(
    ([name, scenario]) => ({
      name,
      description: scenario.description,
    })
  )

  logInfo('사용법', {
    command: 'dotenvx run -- jiti ./src/run-taxinvoice-usecases.ts [all|scenario[,scenario...]]',
    available,
    examples: [
      'dotenvx run -- jiti ./src/run-taxinvoice-usecases.ts all',
      'dotenvx run -- jiti ./src/run-taxinvoice-usecases.ts issue',
      'dotenvx run -- jiti ./src/run-taxinvoice-usecases.ts inquiry,urls,certificate',
    ],
  })
}
