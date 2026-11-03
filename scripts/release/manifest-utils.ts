import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const currentFilePath = fileURLToPath(import.meta.url)
const currentDir = path.dirname(currentFilePath)

export const repoRoot = path.resolve(currentDir, '..', '..')

export interface PackageManifest {
  name: string
  version: string
  types?: string
  exports?: unknown
  engines?: {
    node?: string
  }
}

export function readJson<T>(filePath: string): T {
  return JSON.parse(fs.readFileSync(filePath, 'utf8')) as T
}

export function assertCondition(condition: boolean, message: string): asserts condition {
  if (!condition) {
    throw new Error(message)
  }
}

export function collectExportPaths(exportsField: unknown): string[] {
  const paths: string[] = []

  function collect(value: unknown): void {
    if (!value) {
      return
    }

    if (typeof value === 'string') {
      paths.push(value)
      return
    }

    if (typeof value === 'object') {
      for (const childValue of Object.values(value as Record<string, unknown>)) {
        collect(childValue)
      }
    }
  }

  collect(exportsField)
  return paths
}
