import type { ExampleContext, Runner } from '../types.ts'

export interface MethodDefinition {
  description: string
  run: (context: ExampleContext, runner: Runner) => Promise<void>
}
