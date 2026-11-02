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
  tool: 'git' | 'gh'
  args: string[]
}

function createFixture() {
  const directory = mkdtempSync(path.join(tmpdir(), 'popbill-release-cli-'))
  directories.push(directory)
  const repository = path.join(directory, 'repository')
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
  symlinkSync(path.join(repoRoot, 'node_modules'), path.join(repository, 'node_modules'), 'dir')
  writeFileSync(path.join(repository, '.gitignore'), 'node_modules/\n')

  // Only remote publication is substituted: manifest checks, version calculation and local Git remain real.
  writeFileSync(
    path.join(bin, 'git'),
    `#!${process.execPath}
const { appendFileSync } = require('node:fs')
const { spawnSync } = require('node:child_process')
const args = process.argv.slice(2)
if (args[0] === 'push') {
  appendFileSync(${JSON.stringify(commandLog)}, JSON.stringify({ tool: 'git', args }) + '\\n')
  process.exit(process.env.RELEASE_TEST_FAIL_PUSH === '1' ? 1 : 0)
}
const result = spawnSync(${JSON.stringify(realGit)}, args, { stdio: 'inherit' })
process.exit(result.status ?? 1)
`,
    { mode: 0o755 }
  )
  writeFileSync(
    path.join(bin, 'gh'),
    `#!${process.execPath}
const { appendFileSync } = require('node:fs')
const args = process.argv.slice(2)
appendFileSync(${JSON.stringify(commandLog)}, JSON.stringify({ tool: 'gh', args }) + '\\n')
if (args[0] === 'repo' && args[1] === 'view') {
  if (args[2] !== 'github.com/connextable/popbill' || args.includes('--repo')) process.exit(2)
  console.log('https://github.com/connextable/popbill')
}
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
  git('remote', 'add', 'origin', 'git@github.com:connextable/popbill.git')
  git('remote', 'set-url', '--push', 'origin', 'https://github.com/connextable/popbill.git')
  git('remote', 'add', 'upstream', 'https://github.com/elsewhere/other.git')
  git('config', 'branch.develop.remote', 'upstream')
  git('config', 'branch.develop.merge', 'refs/heads/develop')
  git('add', '.')
  git('-c', 'commit.gpgSign=false', 'commit', '--quiet', '-m', 'Release fixture')

  return {
    repository,
    git,
    manifests: () => manifestPaths.map((manifestPath) => readFileSync(path.join(repository, manifestPath), 'utf8')),
    commands: (): Command[] =>
      existsSync(commandLog)
        ? readFileSync(commandLog, 'utf8')
            .trim()
            .split('\n')
            .map((line) => JSON.parse(line) as Command)
        : [],
    run: (args: string[], failPush = false) =>
      spawnSync(process.execPath, [jitiCli, path.join(repository, 'scripts/release.ts'), ...args], {
        cwd: repository,
        encoding: 'utf8',
        timeout: 20_000,
        env: {
          ...process.env,
          PATH: `${bin}${path.delimiter}${process.env['PATH'] ?? ''}`,
          GH_REPO: 'elsewhere/other',
          RELEASE_TEST_FAIL_PUSH: failPush ? '1' : '0',
        },
      }),
  }
}

afterEach(() => {
  for (const directory of directories.splice(0)) rmSync(directory, { recursive: true, force: true })
})

test.each([
  { version: 'minor', expectedVersion: '1.1.0', workflowInputs: ['bump=minor'] },
  { version: '1.2.3', expectedVersion: '1.2.3', workflowInputs: ['bump=custom', 'custom_version=1.2.3'] },
])('starts a $version release for the exact develop commit without changing local versions', ({ version, expectedVersion, workflowInputs }) => {
  const fixture = createFixture()
  const before = fixture.manifests()
  const head = fixture.git('rev-parse', 'HEAD')
  const result = fixture.run([version])

  expect(result.status).toBe(0)
  expect(result.stdout).toContain(expectedVersion)
  expect(fixture.manifests()).toEqual(before)
  expect(fixture.git('status', '--porcelain')).toBe('')
  const commands = fixture.commands()
  const pushIndex = commands.findIndex((command) => command.tool === 'git')
  expect(commands[pushIndex]).toEqual({ tool: 'git', args: ['push', 'origin', `${head}:refs/heads/develop`] })
  const dispatchIndex = commands.findIndex((command) => command.tool === 'gh' && command.args[0] === 'workflow')
  expect(dispatchIndex).toBeGreaterThan(pushIndex)
  expect(commands[dispatchIndex]?.args).toEqual([
    'workflow',
    'run',
    'release-pr.yml',
    '--repo',
    'github.com/connextable/popbill',
    '--ref',
    'develop',
    '-f',
    workflowInputs[0],
    '-f',
    'source_branch=develop',
    '-f',
    'target_branch=main',
    ...workflowInputs.slice(1).flatMap((input) => ['-f', input]),
  ])
  for (const command of commands.filter((command) => command.tool === 'gh')) {
    const repository = command.args[0] === 'repo' && command.args[1] === 'view' ? command.args[2] : command.args[command.args.indexOf('--repo') + 1]
    expect(repository).toBe('github.com/connextable/popbill')
  }
})

test('dry run calculates the real next version without invoking GitHub or pushing', () => {
  const fixture = createFixture()
  const before = fixture.manifests()
  const result = fixture.run(['minor', '--dry-run'])

  expect(result.status).toBe(0)
  expect(result.stdout).toContain('1.1.0')
  expect(fixture.manifests()).toEqual(before)
  expect(fixture.git('status', '--porcelain')).toBe('')
  expect(fixture.commands()).toEqual([])
})

test.each(['dirty', 'wrong branch'])('rejects a %s checkout before any remote action', (state) => {
  const fixture = createFixture()
  if (state === 'dirty') writeFileSync(path.join(fixture.repository, 'uncommitted.txt'), 'unfinished work')
  else fixture.git('checkout', '--quiet', '-b', 'feature/not-a-release')

  const result = fixture.run(['minor'])

  expect(result.status).not.toBe(0)
  expect(fixture.commands()).toEqual([])
})

test('a failed push prevents release workflow dispatch', () => {
  const fixture = createFixture()
  const result = fixture.run(['minor'], true)

  expect(result.status).not.toBe(0)
  expect(fixture.commands().some((command) => command.tool === 'git' && command.args[0] === 'push')).toBe(true)
  expect(fixture.commands().some((command) => command.tool === 'gh' && command.args[0] === 'workflow')).toBe(false)
})
