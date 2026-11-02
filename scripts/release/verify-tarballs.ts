import { execFileSync } from 'node:child_process'
import fs from 'node:fs'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { createNpmArtifactsManifest } from './artifacts-manifest'
import { verifyTarballConsumerTypes } from './tarball-consumer'
import {
  assertCondition,
  collectExportPaths,
  getLockstepVersion,
  loadPublishManifests,
  readJson,
  repoRoot,
  tarballNameFromPackage,
} from './manifest-utils'
import type { PackageManifest, PublishPackageTargetWithManifest } from './manifest-utils'

function verifyPackages(targets: PublishPackageTargetWithManifest[], version: string, tarballDirPath: string): void {
  const consumerDir = fs.mkdtempSync(path.join(tmpdir(), 'popbill-consumer-'))

  try {
    const packages = targets.map((target) => {
      const packageDir = path.join(consumerDir, 'node_modules', target.name)
      fs.mkdirSync(packageDir, { recursive: true })
      execFileSync('tar', ['-xf', path.join(tarballDirPath, tarballNameFromPackage(target.name, version)), '-C', packageDir, '--strip-components=1'])

      const manifest = readJson<PackageManifest>(path.join(packageDir, 'package.json'))
      assertCondition(manifest.name === target.name, `${target.name} tarball name mismatch: ${manifest.name}`)
      assertCondition(manifest.version === version, `${target.name} tarball version mismatch: ${manifest.version}`)
      const declarations = new Set(collectExportPaths(manifest.exports).filter((entry) => /\.d\.(?:ts|mts|cts)$/.test(entry)))
      if (manifest.types) declarations.add(manifest.types)
      assertCondition(declarations.size > 0, `${target.name} must ship TypeScript declarations`)
      for (const entry of declarations) {
        assertCondition(fs.existsSync(path.join(packageDir, entry)), `${target.name} tarball is missing ${entry}`)
      }
      return manifest
    })

    for (const manifest of packages) {
      const { name } = manifest
      assertCondition(manifest.exports !== null && typeof manifest.exports === 'object', `${name} exports must be a subpath map`)
      assertCondition(Object.hasOwn(manifest.exports, '.'), `${name} must export its public root entrypoint`)

      for (const [subpath, conditions] of Object.entries(manifest.exports)) {
        if (subpath === './package.json') continue
        const specifier = subpath === '.' ? name : `${name}${subpath.slice(1)}`
        const childOptions = { cwd: consumerDir, timeout: 10_000, env: {} }

        // Each entrypoint gets a fresh module cache, including /errors before any service is loaded.
        execFileSync(process.execPath, ['--input-type=module', '--eval', `await import(${JSON.stringify(specifier)})`], childOptions)
        if (collectExportPaths(conditions).some((entry) => entry.endsWith('.cjs'))) {
          execFileSync(process.execPath, ['--input-type=commonjs', '--eval', `require(${JSON.stringify(specifier)})`], childOptions)
        }
      }
    }

    verifyTarballConsumerTypes(consumerDir)
  } finally {
    fs.rmSync(consumerDir, { recursive: true, force: true })
  }
}

function main(): void {
  const cliArgs = process.argv.slice(2).filter((arg) => arg !== '--')
  const positionalArgs = cliArgs.filter((arg) => arg !== '--artifacts-manifest')
  assertCondition(
    positionalArgs.length <= 1 && !positionalArgs.some((arg) => arg.startsWith('--')),
    'Expected [tarball-directory] [--artifacts-manifest]'
  )
  const tarballDirPath = path.resolve(positionalArgs[0] ?? path.join(process.cwd(), '.tmp/release-pack'))
  assertCondition(fs.existsSync(tarballDirPath), `Tarball directory does not exist: ${tarballDirPath}`)

  const targets = loadPublishManifests()
  const version = getLockstepVersion(targets)

  verifyPackages(targets, version, tarballDirPath)

  if (cliArgs.includes('--artifacts-manifest')) {
    const checkoutCommit = execFileSync('git', ['rev-parse', 'HEAD'], { cwd: repoRoot, encoding: 'utf8' }).trim()
    const manifest = createNpmArtifactsManifest(
      tarballDirPath,
      targets.map((target) => ({ name: target.name, version })),
      { repository: process.env['GITHUB_REPOSITORY'] ?? '', commit: process.env['GITHUB_SHA'] ?? '' },
      checkoutCommit
    )
    fs.writeFileSync(path.join(tarballDirPath, 'artifacts.json'), `${JSON.stringify(manifest, null, 2)}\n`, 'utf8')
  }

  console.log(`release:verify-tarballs passed (version=${version}, dir=${tarballDirPath})`)
}

try {
  main()
} catch (error) {
  console.error(`release:verify-tarballs failed: ${error instanceof Error ? error.message : String(error)}`)
  process.exit(1)
}
