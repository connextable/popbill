import { execFileSync } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'
import { assertCondition, collectExportPaths, getLockstepVersion, loadPublishManifests, tarballNameFromPackage } from './manifest-utils'
import type { PackageManifest, PublishPackageTargetWithManifest } from './manifest-utils'

function readTarballPackageJson(tarballPath: string): PackageManifest {
  const output = execFileSync('tar', ['-xOf', tarballPath, 'package/package.json'], { encoding: 'utf8' })
  return JSON.parse(output) as PackageManifest
}

function readTarballEntries(tarballPath: string): string[] {
  const output = execFileSync('tar', ['-tf', tarballPath], { encoding: 'utf8' })
  return output
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.length > 0)
}

function verifyTarball(target: PublishPackageTargetWithManifest, version: string, tarballDirPath: string): void {
  const tarballFileName = tarballNameFromPackage(target.name, version)
  const tarballPath = path.join(tarballDirPath, tarballFileName)

  assertCondition(fs.existsSync(tarballPath), `Missing tarball: ${tarballPath}`)

  const manifest = readTarballPackageJson(tarballPath)
  const entries = readTarballEntries(tarballPath)

  assertCondition(manifest.version === version, `${target.name} tarball version mismatch: ${manifest.version}`)
  assertCondition(
    entries.some((entry) => entry.startsWith('package/dist/')),
    `${target.name} tarball has no dist files`
  )

  const expectedEntryPaths = new Set<string>()
  if (typeof manifest.types === 'string' && manifest.types.startsWith('./dist/')) {
    expectedEntryPaths.add(`package/${manifest.types.slice(2)}`)
  }

  for (const exportPath of collectExportPaths(manifest.exports)) {
    if (exportPath.startsWith('./dist/')) {
      expectedEntryPaths.add(`package/${exportPath.slice(2)}`)
    }
  }

  for (const expectedPath of expectedEntryPaths) {
    assertCondition(entries.includes(expectedPath), `${target.name} tarball is missing ${String(expectedPath)}`)
  }
}

function main(): void {
  const cliArgs = process.argv.slice(2).filter((arg) => arg !== '--')
  const tarballDirPath = path.resolve(cliArgs[0] ?? path.join(process.cwd(), '.tmp/release-pack'))
  assertCondition(fs.existsSync(tarballDirPath), `Tarball directory does not exist: ${tarballDirPath}`)

  const targets = loadPublishManifests()
  const version = getLockstepVersion(targets)

  for (const target of targets) {
    verifyTarball(target, version, tarballDirPath)
  }

  console.log(`release:verify-tarballs passed (version=${version}, dir=${tarballDirPath})`)
}

try {
  main()
} catch (error) {
  console.error(`release:verify-tarballs failed: ${error instanceof Error ? error.message : String(error)}`)
  process.exit(1)
}
