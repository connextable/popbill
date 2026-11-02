import { createHash } from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'
import { assertCondition, tarballNameFromPackage } from './manifest-utils'

export interface NpmArtifactsSource {
  repository: string
  commit: string
}

export function createNpmArtifactsManifest(
  tarballDir: string,
  packages: ReadonlyArray<{ name: string; version: string }>,
  source: NpmArtifactsSource,
  checkoutCommit: string
) {
  assertCondition(source.commit === checkoutCommit, 'Artifact source must match the checked-out commit')

  return {
    schema: 1,
    source,
    packages: packages.map(({ name, version }) => {
      const tarball = tarballNameFromPackage(name, version)
      const tarballPath = path.join(tarballDir, tarball)
      return {
        name,
        version,
        tarball,
        integrity: `sha512-${createHash('sha512').update(fs.readFileSync(tarballPath)).digest('base64')}`,
      }
    }),
  }
}
