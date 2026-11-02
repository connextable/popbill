import { assertCondition, getLockstepVersion, loadPublishManifests, loadRootManifest } from './manifest-utils'
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
  assertCondition(manifest.engines?.node === REQUIRED_NODE_ENGINE, `${name} engines.node must be ${REQUIRED_NODE_ENGINE}`)
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
