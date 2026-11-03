import { mkdtemp, readFile, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { afterEach, expect, test, vi } from 'vitest'
import { mirrorGitHubPackages, readPublishedPackages } from './mirror-github-packages'

// SHA-512 known-answer vector for abc, independently verified with openssl.
const integrity = 'sha512-3a81oZNherrMQXNJriBBMRLm+k6JqX6iCp7u5ktV05ohkpkqJ0/BqDa6PCOj/uu9RU1EI2Q86A4qmslPpUyknw=='
const target = { name: '@connextable/popbill', version: '2.0.1', state: 'published' as const }
const token = 'github-secret-test-token'
const directories: string[] = []

async function fixture(): Promise<string> {
  const directory = await mkdtemp(path.join(tmpdir(), 'popbill-mirror-'))
  directories.push(directory)
  return directory
}

function metadata(version = target.version, digest = integrity, name = target.name): Response {
  return Response.json({
    name,
    version,
    dist: { integrity: digest, tarball: `https://registry.npmjs.org/@connextable/popbill/-/popbill-${version}.tgz` },
  })
}

function githubMetadata(version = target.version, digest = integrity, name = target.name): Response {
  return Response.json({ name, versions: { [version]: { name, version, dist: { integrity: digest } } } })
}

function requests(...responses: Response[]): typeof fetch {
  return vi.fn<typeof fetch>(async () => {
    const response = responses.shift()
    if (!response) throw new Error('Unexpected registry request')
    return response
  })
}

afterEach(async () => {
  await Promise.all(directories.splice(0).map((directory) => rm(directory, { recursive: true, force: true })))
})

test('uses Releaseway published identities and rejects unpublished, duplicate or out-of-scope packages', () => {
  expect(readPublishedPackages(JSON.stringify([{ ...target, state: 'already-published', extra: true }]))).toEqual([
    { ...target, state: 'already-published' },
  ])
  for (const [value, message] of [
    [[], 'NPM_PACKAGES must contain'],
    [[{ ...target, state: 'planned' }], 'has not confirmed npm publication'],
    [[target, target], 'Duplicate Releaseway package'],
    [[{ ...target, name: '@other/package' }], 'only accepts @connextable packages'],
  ] as const) {
    expect(() => readPublishedPackages(JSON.stringify(value))).toThrow(message)
  }
  expect(() => readPublishedPackages(JSON.stringify([{ ...target, version: '../../elsewhere' }]))).toThrow('Invalid published version')
})

test('publishes verified npm bytes to GitHub Packages and keeps credentials out of npm requests', async () => {
  const directory = await fixture()
  const request = requests(
    metadata(),
    new Response('abc'),
    new Response(null, { status: 404 }),
    Response.json({ latest: target.version }),
    githubMetadata()
  )
  const publish = vi.fn<(tarball: string, tag: string, token: string) => void>()
  await expect(mirrorGitHubPackages({ packages: [target], directory, token }, { fetch: request, publish })).resolves.toEqual([
    { ...target, state: 'published' },
  ])
  const tarball = path.join(directory, 'connextable-popbill-2.0.1.tgz')
  expect(await readFile(tarball, 'utf8')).toBe('abc')
  expect(publish).toHaveBeenCalledExactlyOnceWith(tarball, 'latest', token)
  expect(request).toHaveBeenNthCalledWith(
    1,
    'https://registry.npmjs.org/%40connextable%2Fpopbill/2.0.1',
    expect.objectContaining({ headers: {}, redirect: 'error' })
  )
  expect(request).toHaveBeenNthCalledWith(2, expect.any(URL), expect.not.objectContaining({ headers: expect.anything() }))
  expect(request).toHaveBeenNthCalledWith(
    3,
    'https://npm.pkg.github.com/@connextable%2fpopbill',
    expect.objectContaining({ headers: { authorization: `Bearer ${token}` }, redirect: 'error' })
  )
})

test('reruns skip an identical GitHub Packages version without republishing', async () => {
  const directory = await fixture()
  const publish = vi.fn<(tarball: string, tag: string, token: string) => void>()
  await expect(
    mirrorGitHubPackages(
      { packages: [{ ...target, state: 'already-published' }], directory, token },
      { fetch: requests(metadata(), new Response('abc'), githubMetadata()), publish }
    )
  ).resolves.toEqual([{ ...target, state: 'already-published' }])
  expect(publish).not.toHaveBeenCalled()
})

test('keeps the package order supplied by Releaseway', async () => {
  const first = { ...target, name: '@connextable/popbill-utils' }
  const publish = vi.fn<(tarball: string, tag: string, token: string) => void>()
  const results = await mirrorGitHubPackages(
    { packages: [first, target], directory: await fixture(), token },
    {
      fetch: requests(
        metadata(first.version, integrity, first.name),
        new Response('abc'),
        githubMetadata(first.version, integrity, first.name),
        metadata(),
        new Response('abc'),
        githubMetadata()
      ),
      publish,
    }
  )
  expect(results.map(({ name }) => name)).toEqual([first.name, target.name])
  expect(publish).not.toHaveBeenCalled()
})

test('confirms an eventually visible GitHub Packages version after publication', async () => {
  const publish = vi.fn<(tarball: string, tag: string, token: string) => void>()
  await expect(
    mirrorGitHubPackages(
      { packages: [target], directory: await fixture(), token },
      {
        fetch: requests(
          metadata(),
          new Response('abc'),
          new Response(null, { status: 404 }),
          Response.json({ latest: target.version }),
          new Response(null, { status: 404 }),
          githubMetadata()
        ),
        publish,
      }
    )
  ).resolves.toEqual([{ ...target, state: 'published' }])
  expect(publish).toHaveBeenCalledOnce()
})

test('rejects corrupted npm tarballs before any GitHub request or publication', async () => {
  const publish = vi.fn<(tarball: string, tag: string, token: string) => void>()
  const request = requests(metadata(), new Response('corrupt'))
  await expect(mirrorGitHubPackages({ packages: [target], directory: await fixture(), token }, { fetch: request, publish })).rejects.toThrow(
    'npm tarball SHA-512 mismatch'
  )
  expect(request).toHaveBeenCalledTimes(2)
  expect(publish).not.toHaveBeenCalled()
})

test('rejects an existing mirror with different bytes', async () => {
  const publish = vi.fn<(tarball: string, tag: string, token: string) => void>()
  const different = `sha512-${Buffer.alloc(64).toString('base64')}`
  await expect(
    mirrorGitHubPackages(
      { packages: [target], directory: await fixture(), token },
      { fetch: requests(metadata(), new Response('abc'), githubMetadata(target.version, different)), publish }
    )
  ).rejects.toThrow('GitHub Packages integrity differs from npm')
  expect(publish).not.toHaveBeenCalled()
})

test.each([401, 403, 405, 429, 500])('does not treat GitHub HTTP %i as a missing version', async (status) => {
  const publish = vi.fn<(tarball: string, tag: string, token: string) => void>()
  await expect(
    mirrorGitHubPackages(
      { packages: [target], directory: await fixture(), token },
      { fetch: requests(metadata(), new Response('abc'), new Response(null, { status })), publish }
    )
  ).rejects.toThrow(`HTTP ${status}`)
  expect(publish).not.toHaveBeenCalled()
})

test('requires source SHA-512 integrity instead of accepting only a legacy SHA-1 checksum', async () => {
  const publish = vi.fn<(tarball: string, tag: string, token: string) => void>()
  await expect(
    mirrorGitHubPackages(
      { packages: [target], directory: await fixture(), token },
      { fetch: requests(metadata(target.version, 'sha1-qZk+NkcGgWq6PiVxeFDCbJzQ2J0=')), publish }
    )
  ).rejects.toThrow('missing SHA-512 integrity')
  expect(publish).not.toHaveBeenCalled()
})

test('publishes prereleases using next and confirms the published digest', async () => {
  const prerelease = { ...target, version: '2.1.0-beta.1' }
  const publish = vi.fn<(tarball: string, tag: string, token: string) => void>()
  const different = `sha512-${Buffer.alloc(64).toString('base64')}`
  await expect(
    mirrorGitHubPackages(
      { packages: [prerelease], directory: await fixture(), token },
      {
        fetch: requests(
          metadata(prerelease.version),
          new Response('abc'),
          new Response(null, { status: 404 }),
          Response.json({ next: prerelease.version }),
          githubMetadata(prerelease.version, different)
        ),
        publish,
      }
    )
  ).rejects.toThrow('publication integrity could not be confirmed')
  expect(publish).toHaveBeenCalledWith(expect.any(String), 'next', token)
})

test.each([
  { version: '2.0.1', tags: { latest: '2.1.0' } },
  { version: '2.1.0-beta.1', tags: { next: '2.1.0-beta.2' } },
])('replaying $version preserves a newer npm mirror channel', async ({ version, tags }) => {
  const publish = vi.fn<(tarball: string, tag: string, token: string) => void>()
  await expect(
    mirrorGitHubPackages(
      { packages: [{ ...target, version }], directory: await fixture(), token },
      {
        fetch: requests(metadata(version), new Response('abc'), new Response(null, { status: 404 }), Response.json(tags), githubMetadata(version)),
        publish,
      }
    )
  ).resolves.toEqual([{ ...target, version, state: 'published' }])
  expect(publish).toHaveBeenCalledWith(expect.any(String), `mirror-${version}`, token)
})

test('publishes a version missing from an existing GitHub Packages packument', async () => {
  const publish = vi.fn<(tarball: string, tag: string, token: string) => void>()
  await expect(
    mirrorGitHubPackages(
      { packages: [target], directory: await fixture(), token },
      {
        fetch: requests(
          metadata(),
          new Response('abc'),
          Response.json({ name: target.name, versions: {} }),
          Response.json({ latest: target.version }),
          githubMetadata()
        ),
        publish,
      }
    )
  ).resolves.toEqual([{ ...target, state: 'published' }])
  expect(publish).toHaveBeenCalledWith(expect.any(String), 'latest', token)
})

test.each([
  { name: '@connextable/another-package', versions: {} },
  { name: target.name, versions: null },
  { name: target.name, versions: { [target.version]: { name: target.name, version: target.version, dist: { integrity: 'sha1-only' } } } },
])('rejects malformed GitHub Packages metadata instead of treating it as an absent version', async (document) => {
  const publish = vi.fn<(tarball: string, tag: string, token: string) => void>()
  await expect(
    mirrorGitHubPackages(
      { packages: [target], directory: await fixture(), token },
      { fetch: requests(metadata(), new Response('abc'), Response.json(document)), publish }
    )
  ).rejects.toThrow(/invalid package versions|invalid identity or missing SHA-512/)
  expect(publish).not.toHaveBeenCalled()
})

test('does not follow npm tarball URLs outside the public npm registry', async () => {
  const source = Response.json({
    name: target.name,
    version: target.version,
    dist: { integrity, tarball: 'https://another-registry.example/package.tgz' },
  })
  const request = requests(source)
  await expect(
    mirrorGitHubPackages(
      { packages: [target], directory: await fixture(), token },
      { fetch: request, publish: vi.fn<(tarball: string, tag: string, token: string) => void>() }
    )
  ).rejects.toThrow('Unexpected npm tarball origin')
  expect(request).toHaveBeenCalledTimes(1)
})
