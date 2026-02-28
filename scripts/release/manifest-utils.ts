import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const currentFilePath = fileURLToPath(import.meta.url)
const currentDir = path.dirname(currentFilePath)

export const repoRoot = path.resolve(currentDir, '..', '..')
export const rootManifestPath = path.join(repoRoot, 'package.json')

export interface PackageManifest {
  name: string
  version: string
  private?: boolean
  publishConfig?: {
    access?: string
  }
  files?: string[]
  types?: string
  exports?: unknown
  engines?: {
    node?: string
  }
  license?: string
  repository?: {
    url?: string
  }
  bugs?: {
    url?: string
  }
  dependencies?: Record<string, string>
}

export interface PublishPackageTarget {
  name: string
  alias: string
  manifestPath: string
}

export interface PublishPackageTargetWithManifest extends PublishPackageTarget {
  manifest: PackageManifest
}

export const publishPackages: PublishPackageTarget[] = [
  {
    name: '@connextable/popbill-spec',
    alias: 'popbill_spec',
    manifestPath: path.join(repoRoot, 'packages/popbill-spec/package.json'),
  },
  {
    name: '@connextable/popbill-utils',
    alias: 'popbill_utils',
    manifestPath: path.join(repoRoot, 'packages/popbill-utils/package.json'),
  },
  {
    name: '@connextable/popbill-compat',
    alias: 'popbill_compat',
    manifestPath: path.join(repoRoot, 'packages/popbill-compat/package.json'),
  },
  {
    name: '@connextable/popbill',
    alias: 'popbill',
    manifestPath: path.join(repoRoot, 'packages/popbill/package.json'),
  },
]

export function readJson<T>(filePath: string): T {
  return JSON.parse(fs.readFileSync(filePath, 'utf8')) as T
}

export function loadRootManifest(): PackageManifest {
  return readJson<PackageManifest>(rootManifestPath)
}

export function loadPublishManifests(): PublishPackageTargetWithManifest[] {
  return publishPackages.map((target) => ({
    ...target,
    manifest: readJson<PackageManifest>(target.manifestPath),
  }))
}

export function assertCondition(condition: boolean, message: string): asserts condition {
  if (!condition) {
    throw new Error(message)
  }
}

export function getLockstepVersion(targets: ReadonlyArray<Pick<PublishPackageTargetWithManifest, 'manifest'>>): string {
  const firstTarget = targets[0]
  assertCondition(firstTarget !== undefined, 'Publish target list is empty')
  const versions = new Set(targets.map((target) => target.manifest.version))
  assertCondition(versions.size === 1, `Lockstep version mismatch: ${JSON.stringify([...versions])}`)
  return firstTarget.manifest.version
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

export function tarballNameFromPackage(packageName: string, version: string): string {
  const normalized = packageName.replace(/^@/, '').replaceAll('/', '-')
  return `${normalized}-${version}.tgz`
}

export function hasDependency(manifest: PackageManifest, dependencyName: string): boolean {
  return Boolean(manifest.dependencies && manifest.dependencies[dependencyName])
}
