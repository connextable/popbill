import { spawnSync } from 'node:child_process'
import { createHash } from 'node:crypto'
import { mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { setTimeout } from 'node:timers/promises'
import { pathToFileURL } from 'node:url'

const npmRegistry = 'https://registry.npmjs.org'
const githubRegistry = 'https://npm.pkg.github.com'

interface PublishedPackage {
  name: string
  version: string
  state: 'published' | 'already-published'
}

interface MirrorOptions {
  packages: PublishedPackage[]
  directory: string
  token: string
}

interface MirrorDependencies {
  fetch: typeof fetch
  publish: (tarball: string, tag: string, token: string) => void
}

interface PackageMetadata {
  integrity: string
  tarball?: string
}

export function readPublishedPackages(value: string): PublishedPackage[] {
  const parsed: unknown = JSON.parse(value)
  if (!Array.isArray(parsed) || parsed.length === 0) {
    throw new Error('NPM_PACKAGES must contain the packages published by Releaseway')
  }

  const names = new Set<string>()
  return parsed.map((entry: unknown) => {
    if (typeof entry !== 'object' || entry === null) throw new Error('Invalid Releaseway package entry')
    const { name, version, state } = entry as Record<string, unknown>
    if (typeof name !== 'string' || !/^@connextable\/[a-z0-9][a-z0-9._-]*$/.test(name)) {
      throw new Error('GitHub Packages mirror only accepts @connextable packages')
    }
    if (typeof version !== 'string' || !/^\d+\.\d+\.\d+(?:-[\dA-Za-z.-]+)?(?:\+[\dA-Za-z.-]+)?$/.test(version)) {
      throw new Error(`Invalid published version for ${name}`)
    }
    if (state !== 'published' && state !== 'already-published') {
      throw new Error(`Releaseway has not confirmed npm publication of ${name}@${version}`)
    }
    if (names.has(name)) throw new Error(`Duplicate Releaseway package: ${name}`)
    names.add(name)
    return { name, version, state }
  })
}

function sha512Digests(integrity: string): string[] {
  return integrity.split(/\s+/).flatMap((entry) => {
    if (!entry.startsWith('sha512-')) return []
    const digest = entry.slice('sha512-'.length)
    const bytes = Buffer.from(digest, 'base64')
    return bytes.length === 64 && bytes.toString('base64') === digest ? [digest] : []
  })
}

async function readMetadata(registry: string, target: PublishedPackage, request: typeof fetch, token?: string): Promise<PackageMetadata | undefined> {
  const targetPath =
    registry === githubRegistry ? target.name.replace('/', '%2f') : `${encodeURIComponent(target.name)}/${encodeURIComponent(target.version)}`
  const response = await request(`${registry}/${targetPath}`, {
    headers: token ? { authorization: `Bearer ${token}` } : {},
    redirect: 'error',
    signal: AbortSignal.timeout(30_000),
  })
  if (response.status === 404) return undefined
  if (!response.ok) throw new Error(`${registry}: ${target.name}@${target.version} metadata returned HTTP ${response.status}`)
  const document: unknown = await response.json()
  if (typeof document !== 'object' || document === null) throw new Error(`${registry}: invalid package metadata for ${target.name}`)
  let metadata = document as Record<string, unknown>
  if (registry === githubRegistry) {
    const versions = metadata['versions']
    if (metadata['name'] !== target.name || typeof versions !== 'object' || versions === null || Array.isArray(versions)) {
      throw new Error(`${registry}: invalid package versions for ${target.name}`)
    }
    const version = (versions as Record<string, unknown>)[target.version]
    if (version === undefined) return undefined
    if (typeof version !== 'object' || version === null) throw new Error(`${registry}: invalid version metadata for ${target.name}@${target.version}`)
    metadata = version as Record<string, unknown>
  }
  const dist = metadata['dist'] as Record<string, unknown> | undefined
  if (
    metadata['name'] !== target.name ||
    metadata['version'] !== target.version ||
    typeof dist?.['integrity'] !== 'string' ||
    sha512Digests(dist['integrity']).length === 0
  ) {
    throw new Error(`${registry}: invalid identity or missing SHA-512 integrity for ${target.name}@${target.version}`)
  }
  return {
    integrity: dist['integrity'],
    tarball: typeof dist['tarball'] === 'string' ? dist['tarball'] : undefined,
  }
}

async function readMirrorTag(target: PublishedPackage, request: typeof fetch): Promise<string> {
  const response = await request(`${npmRegistry}/-/package/${encodeURIComponent(target.name)}/dist-tags`, {
    redirect: 'error',
    signal: AbortSignal.timeout(30_000),
  })
  if (!response.ok) throw new Error(`npm dist-tags lookup failed for ${target.name}: HTTP ${response.status}`)
  const tags: unknown = await response.json()
  if (typeof tags !== 'object' || tags === null || Array.isArray(tags))
    throw new Error(`npm dist-tags lookup returned invalid data for ${target.name}`)
  const channel = /^\d+\.\d+\.\d+-/.test(target.version) ? 'next' : 'latest'
  // Replaying an older npm release must not move an established mirror channel backwards.
  return (tags as Record<string, unknown>)[channel] === target.version ? channel : `mirror-${target.version.replaceAll('+', '-')}`
}

function publishTarball(tarball: string, tag: string, token: string): void {
  const result = spawnSync('npm', ['publish', tarball, '--registry', githubRegistry, '--tag', tag, '--ignore-scripts', '--provenance=false'], {
    encoding: 'utf8',
  })
  if (result.error || result.status !== 0) {
    const output = `${result.stdout ?? ''}\n${result.stderr ?? ''}`.trim().replaceAll(token, '[REDACTED]')
    throw new Error(`GitHub Packages publication failed (exit ${String(result.status)}): ${output}`)
  }
}

export async function mirrorGitHubPackages(
  options: MirrorOptions,
  dependencies: MirrorDependencies = { fetch: globalThis.fetch, publish: publishTarball }
): Promise<PublishedPackage[]> {
  await mkdir(options.directory, { recursive: true })
  const results: PublishedPackage[] = []

  for (const target of options.packages) {
    const source = await readMetadata(npmRegistry, target, dependencies.fetch)
    if (!source?.tarball) throw new Error(`npm tarball is unavailable for ${target.name}@${target.version}`)
    const tarballUrl = new URL(source.tarball)
    if (tarballUrl.origin !== npmRegistry) throw new Error(`Unexpected npm tarball origin for ${target.name}@${target.version}`)
    const response = await dependencies.fetch(tarballUrl, { redirect: 'error', signal: AbortSignal.timeout(30_000) })
    if (!response.ok) throw new Error(`npm tarball download failed for ${target.name}@${target.version}: HTTP ${response.status}`)
    const bytes = Buffer.from(await response.arrayBuffer())
    const digest = createHash('sha512').update(bytes).digest('base64')
    if (!sha512Digests(source.integrity).includes(digest)) {
      throw new Error(`npm tarball SHA-512 mismatch for ${target.name}@${target.version}`)
    }

    const existing = await readMetadata(githubRegistry, target, dependencies.fetch, options.token)
    if (existing) {
      if (!sha512Digests(existing.integrity).includes(digest)) {
        throw new Error(`GitHub Packages integrity differs from npm for ${target.name}@${target.version}`)
      }
      results.push({ name: target.name, version: target.version, state: 'already-published' })
      continue
    }

    const filename = `${target.name.slice(1).replace('/', '-')}-${target.version}.tgz`
    const tarball = path.join(options.directory, filename)
    await writeFile(tarball, bytes)
    dependencies.publish(tarball, await readMirrorTag(target, dependencies.fetch), options.token)

    let mirrored: PackageMetadata | undefined
    for (let attempt = 0; attempt < 3; attempt += 1) {
      if (attempt > 0) await setTimeout(500)
      mirrored = await readMetadata(githubRegistry, target, dependencies.fetch, options.token)
      if (mirrored) break
    }
    if (!mirrored || !sha512Digests(mirrored.integrity).includes(digest)) {
      throw new Error(`GitHub Packages publication integrity could not be confirmed for ${target.name}@${target.version}`)
    }
    results.push({ name: target.name, version: target.version, state: 'published' })
  }
  return results
}

async function main(): Promise<void> {
  const packages = process.env['NPM_PACKAGES']
  const directory = process.env['MIRROR_DIRECTORY']
  const token = process.env['NODE_AUTH_TOKEN']
  if (!packages || !directory || !token) throw new Error('NPM_PACKAGES, MIRROR_DIRECTORY and NODE_AUTH_TOKEN are required')
  const results = await mirrorGitHubPackages({ packages: readPublishedPackages(packages), directory, token })
  for (const result of results) console.log(`${result.name}@${result.version}: ${result.state}`)
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  main().catch((error: unknown) => {
    const message = error instanceof Error ? error.message : String(error)
    const token = process.env['NODE_AUTH_TOKEN']
    console.error(`GitHub Packages mirror failed: ${token ? message.replaceAll(token, '[REDACTED]') : message}`)
    process.exitCode = 1
  })
}
