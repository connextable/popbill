import fs from 'node:fs'
import { assertCondition, getLockstepVersion, loadPublishManifests, loadRootManifest, publishPackages, rootManifestPath } from './manifest-utils'
import type { PackageManifest } from './manifest-utils'

type VersionBump = 'major' | 'minor' | 'patch'

interface CliOptions {
  versionSpec: string
  dryRun: boolean
  allowSame: boolean
  printVersion: boolean
}

interface ParsedVersion {
  major: number
  minor: number
  patch: number
}

const exactVersionPattern = /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)$/
const bumpSpecs = new Set<VersionBump>(['major', 'minor', 'patch'])

function readCliOptions(): CliOptions {
  const args = process.argv.slice(2).filter((arg) => arg !== '--')
  const dryRun = args.includes('--dry-run')
  const allowSame = args.includes('--allow-same')
  const printVersion = args.includes('--print-version')
  const versionArgs = args.filter((arg) => arg !== '--dry-run' && arg !== '--allow-same' && arg !== '--print-version')

  assertCondition(versionArgs.length === 1, 'Usage: pnpm release:bump <major|minor|patch|x.y.z> [--dry-run]')

  const versionSpec = versionArgs[0]
  assertCondition(typeof versionSpec === 'string' && versionSpec.length > 0, 'Version spec is required')

  return {
    versionSpec,
    dryRun,
    allowSame,
    printVersion,
  }
}

function parseVersion(version: string): ParsedVersion {
  const match = exactVersionPattern.exec(version)
  assertCondition(match !== null, `Version must use x.y.z semver format: ${version}`)

  return {
    major: Number(match[1]),
    minor: Number(match[2]),
    patch: Number(match[3]),
  }
}

function formatVersion(version: ParsedVersion): string {
  return `${version.major}.${version.minor}.${version.patch}`
}

function compareVersions(left: ParsedVersion, right: ParsedVersion): number {
  if (left.major !== right.major) {
    return left.major - right.major
  }

  if (left.minor !== right.minor) {
    return left.minor - right.minor
  }

  return left.patch - right.patch
}

function incrementVersion(currentVersion: ParsedVersion, bump: VersionBump): ParsedVersion {
  if (bump === 'major') {
    return {
      major: currentVersion.major + 1,
      minor: 0,
      patch: 0,
    }
  }

  if (bump === 'minor') {
    return {
      major: currentVersion.major,
      minor: currentVersion.minor + 1,
      patch: 0,
    }
  }

  return {
    major: currentVersion.major,
    minor: currentVersion.minor,
    patch: currentVersion.patch + 1,
  }
}

function resolveNextVersion(currentVersion: string, versionSpec: string, allowSame: boolean): string {
  const current = parseVersion(currentVersion)

  if (bumpSpecs.has(versionSpec as VersionBump)) {
    return formatVersion(incrementVersion(current, versionSpec as VersionBump))
  }

  const next = parseVersion(versionSpec)
  const comparison = compareVersions(next, current)
  assertCondition(
    allowSame ? comparison >= 0 : comparison > 0,
    `Next version must be ${allowSame ? 'greater than or equal to' : 'greater than'} current version ${currentVersion}: ${versionSpec}`
  )

  return formatVersion(next)
}

function writeManifestVersion(manifestPath: string, nextVersion: string, dryRun: boolean): void {
  const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8')) as PackageManifest
  manifest.version = nextVersion

  if (dryRun) {
    return
  }

  fs.writeFileSync(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`, 'utf8')
}

function main(): void {
  const options = readCliOptions()
  const targets = loadPublishManifests()
  const currentVersion = getLockstepVersion(targets)
  const rootManifest = loadRootManifest()

  assertCondition(
    rootManifest.version === currentVersion,
    `Root version must match publish package version ${currentVersion}: ${rootManifest.version}`
  )

  const nextVersion = resolveNextVersion(currentVersion, options.versionSpec, options.allowSame)

  if (options.printVersion) {
    console.log(nextVersion)
    return
  }

  writeManifestVersion(rootManifestPath, nextVersion, options.dryRun)
  for (const target of publishPackages) {
    writeManifestVersion(target.manifestPath, nextVersion, options.dryRun)
  }

  const mode = options.dryRun ? 'dry-run' : 'updated'
  console.log(`release:bump ${mode} ${currentVersion} -> ${nextVersion}`)
}

try {
  main()
} catch (error) {
  console.error(`release:bump failed: ${error instanceof Error ? error.message : String(error)}`)
  process.exit(1)
}
