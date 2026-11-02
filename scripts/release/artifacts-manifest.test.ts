import { mkdtempSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { afterEach, expect, test } from 'vitest'
import { createNpmArtifactsManifest } from './artifacts-manifest'

const directories: string[] = []
const source = { repository: 'connextable/popbill', commit: 'a'.repeat(40) }
const packages = [{ name: '@scope/library', version: '1.2.3' }]

function createFixture(): string {
  const directory = mkdtempSync(path.join(tmpdir(), 'popbill-artifacts-'))
  directories.push(directory)
  writeFileSync(path.join(directory, 'scope-library-1.2.3.tgz'), 'abc')
  return directory
}

afterEach(() => {
  for (const directory of directories.splice(0)) rmSync(directory, { recursive: true, force: true })
})

test('seals exact compressed bytes with source identity and portable tarball paths', () => {
  expect(createNpmArtifactsManifest(createFixture(), packages, source, source.commit)).toEqual({
    schema: 1,
    source,
    packages: [
      {
        name: '@scope/library',
        version: '1.2.3',
        tarball: 'scope-library-1.2.3.tgz',
        // SHA-512 known-answer vector for abc, independently verified with openssl.
        integrity: 'sha512-3a81oZNherrMQXNJriBBMRLm+k6JqX6iCp7u5ktV05ohkpkqJ0/BqDa6PCOj/uu9RU1EI2Q86A4qmslPpUyknw==',
      },
    ],
  })
})

test('rejects an artifact source that differs from the producer checkout', () => {
  expect(() => createNpmArtifactsManifest(createFixture(), packages, source, 'b'.repeat(40))).toThrow(
    'Artifact source must match the checked-out commit'
  )
})
