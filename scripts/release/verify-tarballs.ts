import { execFileSync } from 'node:child_process'
import fs from 'node:fs'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { verifyTarballConsumerTypes, verifyTarballConsumerRuntime } from './tarball-consumer'
import { assertCondition, collectExportPaths, readJson, repoRoot } from './manifest-utils'
import type { PackageManifest } from './manifest-utils'

function verifyPackages(tarballDirPath: string): number {
  const tarballs = fs
    .readdirSync(tarballDirPath)
    .filter((entry) => entry.endsWith('.tgz'))
    .sort()
  assertCondition(tarballs.length > 0, `No package tarballs found in ${tarballDirPath}`)
  const consumerDir = fs.mkdtempSync(path.join(tmpdir(), 'popbill-consumer-'))

  try {
    const packages = tarballs.map((tarball, index) => {
      const packageDir = path.join(consumerDir, `package-${index}`)
      fs.mkdirSync(packageDir)
      execFileSync('tar', ['-xf', path.join(tarballDirPath, tarball), '-C', packageDir, '--strip-components=1'])
      const manifest = readJson<PackageManifest>(path.join(packageDir, 'package.json'))
      const { name } = manifest
      assertCondition(/^(?:@[a-z0-9][a-z0-9._-]*\/)?[a-z0-9][a-z0-9._-]*$/.test(name), `Invalid package name in ${tarball}`)
      assertCondition(manifest.engines?.node === '>=20', `${name} engines.node must be >=20`)
      const declarations = new Set(collectExportPaths(manifest.exports).filter((entry) => /\.d\.(?:ts|mts|cts)$/.test(entry)))
      if (manifest.types) declarations.add(manifest.types)
      assertCondition(declarations.size > 0, `${name} must ship TypeScript declarations`)
      for (const entry of declarations) {
        assertCondition(fs.existsSync(path.join(packageDir, entry)), `${name} tarball is missing ${entry}`)
      }
      const installedPackageDir = path.join(consumerDir, 'node_modules', name)
      assertCondition(!fs.existsSync(installedPackageDir), `Duplicate package tarballs for ${name}`)
      fs.mkdirSync(path.dirname(installedPackageDir), { recursive: true })
      fs.renameSync(packageDir, installedPackageDir)
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
    verifyTarballConsumerRuntime(consumerDir)
    return packages.length
  } finally {
    fs.rmSync(consumerDir, { recursive: true, force: true })
  }
}

function main(): void {
  const cliArgs = process.argv.slice(2).filter((arg) => arg !== '--')
  assertCondition(cliArgs.length <= 1 && !cliArgs[0]?.startsWith('--'), 'Usage: pnpm check:packages [tarball-directory]')
  const providedDirectory = cliArgs[0]
  const tarballDirPath = providedDirectory === undefined ? fs.mkdtempSync(path.join(tmpdir(), 'popbill-pack-')) : path.resolve(providedDirectory)

  try {
    if (providedDirectory === undefined) {
      execFileSync('pnpm', ['-r', '--filter', './packages/*', 'pack', '--pack-destination', tarballDirPath], { cwd: repoRoot, stdio: 'inherit' })
    }
    assertCondition(fs.existsSync(tarballDirPath), `Tarball directory does not exist: ${tarballDirPath}`)
    const packageCount = verifyPackages(tarballDirPath)
    console.log(`check:packages passed (packages=${packageCount}, dir=${tarballDirPath})`)
  } finally {
    if (providedDirectory === undefined) fs.rmSync(tarballDirPath, { recursive: true, force: true })
  }
}

try {
  main()
} catch (error) {
  console.error(`check:packages failed: ${error instanceof Error ? error.message : String(error)}`)
  process.exit(1)
}
