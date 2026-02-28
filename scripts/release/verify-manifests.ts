import { assertCondition, collectExportPaths, getLockstepVersion, loadPublishManifests, loadRootManifest } from './manifest-utils'
import type { PublishPackageTargetWithManifest } from './manifest-utils'

const REQUIRED_NODE_ENGINE = '>=20'

function verifyRootManifest(): void {
  const rootManifest = loadRootManifest()
  assertCondition(rootManifest.private === true, 'Root package.json must remain private=true')
}

function verifyTargetManifest(target: PublishPackageTargetWithManifest): void {
  const { name, manifest } = target

  assertCondition(manifest.name === name, `Unexpected package name in ${name}: ${manifest.name}`)
  assertCondition(manifest.publishConfig?.access === 'public', `${name} must set publishConfig.access=public`)
  assertCondition(Array.isArray(manifest.files) && manifest.files.includes('dist'), `${name} must include dist in files`)
  assertCondition(typeof manifest.types === 'string' && manifest.types.startsWith('./dist/'), `${name} types must point to ./dist`)
  assertCondition(manifest.engines?.node === REQUIRED_NODE_ENGINE, `${name} engines.node must be ${REQUIRED_NODE_ENGINE}`)
  assertCondition(typeof manifest.license === 'string' && manifest.license.length > 0, `${name} license is required`)
  assertCondition(Boolean(manifest.repository?.url), `${name} repository.url is required`)
  assertCondition(Boolean(manifest.bugs?.url), `${name} bugs.url is required`)

  const exportPaths = collectExportPaths(manifest.exports).filter((value) => value.startsWith('./dist/'))
  assertCondition(exportPaths.length > 0, `${name} exports must reference ./dist entries`)
}

function main(): void {
  verifyRootManifest()
  const targets = loadPublishManifests()
  const lockstepVersion = getLockstepVersion(targets)

  for (const target of targets) {
    verifyTargetManifest(target)
  }

  console.log(`release:verify-manifests passed (version=${lockstepVersion})`)
}

try {
  main()
} catch (error) {
  console.error(`release:verify-manifests failed: ${error instanceof Error ? error.message : String(error)}`)
  process.exit(1)
}
