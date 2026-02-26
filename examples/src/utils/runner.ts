import type { RunResult, Runner, RunnerStats } from '../types.ts'
import { formatError } from './error.ts'
import { logError, logInfo } from './log.ts'
import { summarizeGenericObject } from './summarizers.ts'

export function createRunner(): Runner {
  const stats: RunnerStats = {
    total: 0,
    passed: 0,
    failed: 0,
    failures: [],
  }

  return {
    stats,
    async run<T>(
      name: string,
      input: unknown,
      operation: () => Promise<T>,
      summarize: (value: T) => unknown = summarizeGenericObject
    ): Promise<RunResult<T>> {
      stats.total += 1
      const startedAt = Date.now()
      logInfo(`${name} - REQUEST`, {
        input,
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
          error: formatError(error),
        })
        return {
          ok: false,
          error,
        }
      }
    },
  }
}
