import { logError, logInfo } from './log.ts'

export interface SharedRunnerStats {
  total: number
  passed: number
  failed: number
  failures: string[]
}

export interface SharedRunSuccess<T> {
  ok: true
  value: T
}

export interface SharedRunFailure {
  ok: false
  error: unknown
}

export type SharedRunResult<T> = SharedRunSuccess<T> | SharedRunFailure

export interface SharedRunner {
  stats: SharedRunnerStats
  run<T>(name: string, input: unknown, operation: () => Promise<T>, summarize?: (value: T) => unknown): Promise<SharedRunResult<T>>
}

export interface CreateSharedRunnerInput {
  formatError: (error: unknown) => unknown
  summarizeDefault?: (value: unknown) => unknown
}

export function createSharedRunner(input: CreateSharedRunnerInput): SharedRunner {
  const stats: SharedRunnerStats = {
    total: 0,
    passed: 0,
    failed: 0,
    failures: [],
  }

  return {
    stats,
    async run<T>(
      name: string,
      requestInput: unknown,
      operation: () => Promise<T>,
      summarize: (value: T) => unknown = (value) => (input.summarizeDefault ? input.summarizeDefault(value) : value)
    ): Promise<SharedRunResult<T>> {
      stats.total += 1
      const startedAt = Date.now()
      logInfo(`${name} - REQUEST`, {
        input: requestInput,
      })

      try {
        const value = await operation()
        stats.passed += 1
        const durationMs = Date.now() - startedAt
        logInfo(`${name} - RESPONSE`, {
          durationMs,
          summary: summarize(value),
        })
        return {
          ok: true,
          value,
        }
      } catch (error) {
        stats.failed += 1
        stats.failures.push(name)
        const durationMs = Date.now() - startedAt
        logError(`${name} - ERROR`, {
          durationMs,
          error: input.formatError(error),
        })
        return {
          ok: false,
          error,
        }
      }
    },
  }
}
