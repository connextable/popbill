import { createSharedRunner } from '../../shared/runner.ts'
import { formatError } from './error.ts'
import { summarizeGenericObject, summarizeRequestInput } from './summarizers.ts'
import type { Runner } from '../types.ts'

export function createRunner(): Runner {
  return createSharedRunner({
    formatError,
    summarizeInput: (value) => summarizeRequestInput(value),
    summarizeDefault: (value) => summarizeGenericObject(value),
  })
}
