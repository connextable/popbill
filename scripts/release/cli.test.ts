import { execFileSync, spawnSync } from 'node:child_process'
import { cpSync, existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, symlinkSync, writeFileSync } from 'node:fs'
import { createRequire } from 'node:module'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { afterEach, expect, test } from 'vitest'
import { publishPackages, repoRoot } from './manifest-utils'

const require = createRequire(import.meta.url)
const jitiCli = path.join(path.dirname(require.resolve('jiti/package.json')), 'lib/jiti-cli.mjs')
const realGit = execFileSync('sh', ['-c', 'command -v git'], { encoding: 'utf8' }).trim()
const directories: string[] = []

interface Command {
  tool: 'git' | 'pnpm' | 'npm' | 'gh'
  args: string[]
  commit?: string
}

function createFixture(versions: { develop?: string; main?: string } = {}) {
  const directory = mkdtempSync(path.join(tmpdir(), 'popbill-release-cli-'))
  directories.push(directory)
  const repository = path.join(directory, 'repository')
  const remote = path.join(directory, 'origin.git')
  const bin = path.join(directory, 'bin')
  const commandLog = path.join(directory, 'commands.jsonl')
  mkdirSync(repository)
  mkdirSync(bin)
  mkdirSync(path.join(repository, 'scripts'))
  cpSync(path.join(repoRoot, 'scripts/release.ts'), path.join(repository, 'scripts/release.ts'))
  cpSync(path.join(repoRoot, 'scripts/release'), path.join(repository, 'scripts/release'), { recursive: true })
  const manifestPaths = ['package.json', ...publishPackages.map((target) => path.relative(repoRoot, target.manifestPath))]
  for (const manifestPath of manifestPaths) {
    mkdirSync(path.dirname(path.join(repository, manifestPath)), { recursive: true })
    const manifest = JSON.parse(readFileSync(path.join(repoRoot, manifestPath), 'utf8')) as Record<string, unknown>
    writeFileSync(path.join(repository, manifestPath), `${JSON.stringify({ ...manifest, version: '1.0.1' }, null, 2)}\n`)
  }

  function setVersions(version: string): void {
    for (const manifestPath of manifestPaths) {
      const absolutePath = path.join(repository, manifestPath)
      const manifest = JSON.parse(readFileSync(absolutePath, 'utf8')) as Record<string, unknown>
      writeFileSync(absolutePath, `${JSON.stringify({ ...manifest, version }, null, 2)}\n`)
    }
  }
  symlinkSync(path.join(repoRoot, 'node_modules'), path.join(repository, 'node_modules'), 'dir')
  writeFileSync(path.join(repository, '.gitignore'), 'node_modules/\ndist/\n.env*\n')
  writeFileSync(path.join(repository, '.env.release-test'), 'PRIVATE_FIXTURE_VALUE=local-only\n')

  // Git operations reach a real isolated bare remote; the wrapper only records mutations.
  writeFileSync(
    path.join(bin, 'git'),
    `#!${process.execPath}
const { appendFileSync } = require('node:fs')
const { spawnSync } = require('node:child_process')
const args = process.argv.slice(2)
if (['fetch', 'push', 'add', 'commit', 'merge'].includes(args[0])) {
  appendFileSync(${JSON.stringify(commandLog)}, JSON.stringify({ tool: 'git', args }) + '\\n')
}
const result = spawnSync(${JSON.stringify(realGit)}, args, { stdio: 'inherit' })
process.exit(result.status ?? 1)
`,
    { mode: 0o755 }
  )
  writeFileSync(
    path.join(bin, 'pnpm'),
    `#!${process.execPath}
const { appendFileSync, mkdirSync, writeFileSync } = require('node:fs')
const { execFileSync } = require('node:child_process')
const args = process.argv.slice(2)
const commit = execFileSync(${JSON.stringify(realGit)}, ['rev-parse', 'HEAD'], { encoding: 'utf8' }).trim()
appendFileSync(${JSON.stringify(commandLog)}, JSON.stringify({ tool: 'pnpm', args, commit }) + '\\n')
mkdirSync('dist', { recursive: true })
writeFileSync('dist/generated.txt', 'check output')
if (args.includes(process.env.RELEASE_TEST_FAIL_CHECK)) process.exit(1)
`,
    { mode: 0o755 }
  )
  writeFileSync(
    path.join(bin, 'npm'),
    `#!${process.execPath}
const { appendFileSync } = require('node:fs')
const args = process.argv.slice(2)
appendFileSync(${JSON.stringify(commandLog)}, JSON.stringify({ tool: 'npm', args }) + '\\n')
if (args[0] !== 'view' || args[2] !== 'version' || args[3] !== '--json' || args[4] !== '--registry' || args[5] !== 'https://registry.npmjs.org') process.exit(2)
if (process.env.RELEASE_TEST_PUBLISHED === '1' && args[1].startsWith('@connextable/popbill@')) {
  console.log(JSON.stringify(args[1].slice(args[1].lastIndexOf('@') + 1)))
} else {
  console.error('E404 version not published')
  process.exit(1)
}
`,
    { mode: 0o755 }
  )
  writeFileSync(
    path.join(bin, 'gh'),
    `#!${process.execPath}
require('node:fs').appendFileSync(${JSON.stringify(commandLog)}, JSON.stringify({ tool: 'gh', args: process.argv.slice(2) }) + '\\n')
process.exit(1)
`,
    { mode: 0o755 }
  )

  function git(...args: string[]): string {
    return execFileSync(realGit, args, { cwd: repository, encoding: 'utf8' }).trim()
  }

  git('init', '--quiet', '--initial-branch=develop')
  git('config', 'user.email', 'release-test@example.invalid')
  git('config', 'user.name', 'Release CLI fixture')
  git('config', 'core.hooksPath', '/dev/null')
  git('config', 'commit.gpgSign', 'false')
  git('add', '.')
  git('commit', '--quiet', '-m', 'Release fixture')
  git('checkout', '--quiet', '-b', 'main')
  setVersions(versions.main ?? '1.0.1')
  writeFileSync(path.join(repository, 'main-only.txt'), 'Existing main change\n')
  git('add', '--', 'main-only.txt', ...manifestPaths)
  git('commit', '--quiet', '-m', 'fix: retain main changes')
  git('checkout', '--quiet', 'develop')
  setVersions(versions.develop ?? '1.0.1')
  writeFileSync(path.join(repository, 'feature.txt'), 'Release feature\n')
  git('add', '--', 'feature.txt', ...manifestPaths)
  git('commit', '--quiet', '-m', 'feat: release feature')
  git('init', '--bare', '--quiet', '--initial-branch=main', remote)
  git('remote', 'add', 'origin', remote)
  git('push', '--quiet', 'origin', 'develop', 'main')

  return {
    repository,
    git,
    manifestPaths,
    remoteHeads: () => ['develop', 'main'].map((branch) => git('--git-dir', remote, 'rev-parse', `refs/heads/${branch}`)),
    manifests: () => manifestPaths.map((manifestPath) => readFileSync(path.join(repository, manifestPath), 'utf8')),
    commands: (): Command[] =>
      existsSync(commandLog)
        ? readFileSync(commandLog, 'utf8')
            .trim()
            .split('\n')
            .map((line) => JSON.parse(line) as Command)
        : [],
    run: (args: string[], options: { failCheck?: string; published?: boolean } = {}) => {
      const env: NodeJS.ProcessEnv = {
        ...process.env,
        PATH: `${bin}${path.delimiter}${process.env['PATH'] ?? ''}`,
        RELEASE_TEST_FAIL_CHECK: options.failCheck ?? '',
        RELEASE_TEST_PUBLISHED: options.published ? '1' : '0',
      }
      delete env['GITHUB_OUTPUT']
      return spawnSync(process.execPath, [jitiCli, path.join(repository, 'scripts/release.ts'), ...args], {
        cwd: repository,
        encoding: 'utf8',
        timeout: 20_000,
        env,
      })
    },
  }
}

afterEach(() => {
  for (const directory of directories.splice(0)) rmSync(directory, { recursive: true, force: true })
})

test.each([
  { version: 'minor', develop: '1.0.1', main: '1.1.0', expectedCommits: 2 },
  { version: '1.1.0', develop: '1.1.0', main: '1.0.1', expectedCommits: 1 },
])('releases $version from develop $develop and main $main when unpublished', ({ version, develop, main, expectedCommits }) => {
  const fixture = createFixture({ develop, main })
  const expectedVersion = '1.1.0'
  const before = fixture.git('rev-parse', 'HEAD')
  const mainBefore = fixture.remoteHeads()[1] ?? ''
  const result = fixture.run([version])

  expect(result.status).toBe(0)
  const head = fixture.git('rev-parse', 'HEAD')
  expect(fixture.git('branch', '--show-current')).toBe('develop')
  expect(fixture.remoteHeads()).toEqual([head, head])
  expect(fixture.git('status', '--porcelain')).toBe('')
  expect(fixture.git('merge-base', '--is-ancestor', mainBefore, head)).toBe('')
  expect(readFileSync(path.join(fixture.repository, 'main-only.txt'), 'utf8')).toBe('Existing main change\n')
  expect(fixture.manifests().map((manifest) => (JSON.parse(manifest) as { version: string }).version)).toEqual(
    Array.from({ length: 7 }, () => expectedVersion)
  )
  expect(fixture.git('rev-list', '--count', '--first-parent', `${before}..HEAD`)).toBe(String(expectedCommits))
  const versionCommitFiles = fixture.git('diff', '--name-only', before, 'HEAD^1').split('\n').filter(Boolean).sort()
  expect(versionCommitFiles).toEqual(expectedCommits === 2 ? [...fixture.manifestPaths].sort() : [])
  expect(fixture.git('ls-tree', '-r', '--name-only', 'HEAD')).not.toMatch(/(^|\n)(?:\.env|dist\/)/)
  const commands = fixture.commands()
  expect(commands.filter((command) => command.tool === 'npm').map((command) => command.args)).toEqual(
    publishPackages.map((target) => ['view', `${target.name}@1.1.0`, 'version', '--json', '--registry', 'https://registry.npmjs.org'])
  )
  expect(commands.filter((command) => command.tool === 'pnpm')).toEqual([
    { tool: 'pnpm', args: ['build'], commit: head },
    { tool: 'pnpm', args: ['typecheck'], commit: head },
    { tool: 'pnpm', args: ['lint'], commit: head },
    { tool: 'pnpm', args: ['test'], commit: head },
  ])
  const push = commands.find((command) => command.tool === 'git' && command.args[0] === 'push')
  expect(push?.args).toContain('--atomic')
  expect(push?.args).toContain('--no-follow-tags')
  expect(push?.args).toContain('HEAD:refs/heads/develop')
  expect(push?.args).toContain('HEAD:refs/heads/main')
  expect(commands.at(-1)).toEqual(push)
  expect(commands.some((command) => command.tool === 'gh')).toBe(false)

  const retry = fixture.run([expectedVersion])
  expect(retry.status).not.toBe(0)
  expect(fixture.remoteHeads()).toEqual([head, head])
  expect(fixture.commands().filter((command) => command.tool === 'pnpm')).toHaveLength(4)
  expect(fixture.commands().filter((command) => command.tool === 'git' && command.args[0] === 'push')).toHaveLength(1)
})

test('dry run calculates the next version without fetching, changing files or remote writes', () => {
  const fixture = createFixture()
  const before = fixture.manifests()
  const head = fixture.git('rev-parse', 'HEAD')
  const remoteHeads = fixture.remoteHeads()
  const result = fixture.run(['minor', '--dry-run'])

  expect(result.status).toBe(0)
  expect(result.stdout).toContain('1.1.0')
  expect(fixture.manifests()).toEqual(before)
  expect(fixture.git('rev-parse', 'HEAD')).toBe(head)
  expect(fixture.remoteHeads()).toEqual(remoteHeads)
  expect(fixture.git('status', '--porcelain')).toBe('')
  expect(fixture.commands()).toEqual([])
})

test.each(['dirty', 'wrong branch'])('rejects a %s checkout before remote actions', (state) => {
  const fixture = createFixture()
  if (state === 'dirty') writeFileSync(path.join(fixture.repository, 'uncommitted.txt'), 'unfinished work')
  else fixture.git('checkout', '--quiet', '-b', 'feature/not-a-release')
  const remoteHeads = fixture.remoteHeads()
  const result = fixture.run(['minor'])

  expect(result.status).not.toBe(0)
  expect(fixture.remoteHeads()).toEqual(remoteHeads)
  expect(fixture.commands()).toEqual([])
})

test('a failed project check leaves both remote branches unchanged', () => {
  const fixture = createFixture()
  const remoteHeads = fixture.remoteHeads()
  const result = fixture.run(['minor'], { failCheck: 'lint' })

  expect(result.status).not.toBe(0)
  expect(fixture.remoteHeads()).toEqual(remoteHeads)
  expect(fixture.git('branch', '--show-current')).toBe('develop')
  expect(
    fixture
      .commands()
      .filter((command) => command.tool === 'pnpm')
      .map((command) => command.args)
  ).toEqual([['build'], ['typecheck'], ['lint']])
  expect(fixture.commands().some((command) => command.tool === 'git' && command.args[0] === 'push')).toBe(false)
  expect(fixture.commands().some((command) => command.tool === 'gh')).toBe(false)
})

test('one published package prevents reusing the version for changed source', () => {
  const fixture = createFixture({ develop: '1.1.0', main: '1.1.0' })
  const remoteHeads = fixture.remoteHeads()
  const result = fixture.run(['1.1.0'], { published: true })

  expect(result.status).not.toBe(0)
  expect(fixture.remoteHeads()).toEqual(remoteHeads)
  expect(fixture.commands().filter((command) => command.tool === 'npm')).toHaveLength(6)
  expect(fixture.commands().some((command) => command.tool === 'pnpm')).toBe(false)
  expect(fixture.commands().some((command) => command.tool === 'git' && command.args[0] === 'push')).toBe(false)
  expect(fixture.commands().some((command) => command.tool === 'gh')).toBe(false)
})

test('explicit main baseline excludes old breaking changes after a stale sync marker', () => {
  const fixture = createFixture()
  fixture.git('checkout', '--quiet', 'main')
  fixture.git('merge', '--no-edit', 'develop')
  fixture.git('commit', '--quiet', '--allow-empty', '-m', 'chore(release): sync version to 1.0.0')
  fixture.git('commit', '--quiet', '--allow-empty', '-m', 'feat!: old breaking change')
  fixture.git('push', '--quiet', 'origin', 'main')
  fixture.git('checkout', '--quiet', 'develop')
  fixture.git('merge', '--no-edit', 'main')
  fixture.git('commit', '--quiet', '--allow-empty', '-m', 'fix: current change')

  const result = fixture.run(['resolve-bump', '--base-ref', 'origin/main', '--print-bump'])

  expect(result.status).toBe(0)
  expect(result.stdout.trim()).toBe('patch')
  expect(fixture.commands()).toEqual([])
})
