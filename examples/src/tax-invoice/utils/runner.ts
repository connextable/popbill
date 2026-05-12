import { createSharedRunner } from '../../shared/runner.ts'
import { formatError } from './error.ts'
import { summarizeGenericObject } from './summarizers.ts'
import type { Runner } from '../types.ts'

export function createRunner(): Runner {
  return createSharedRunner({
    formatError,
    summarizeDefault: (value) => summarizeGenericObject(value),
  })
}
