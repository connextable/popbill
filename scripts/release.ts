import { spawnSync } from 'node:child_process'
import { createRequire } from 'node:module'
import path from 'node:path'
import { assertCondition, repoRoot } from './release/manifest-utils'

const require = createRequire(import.meta.url)
const jitiCli = path.join(path.dirname(require.resolve('jiti/package.json')), 'lib/jiti-cli.mjs')
const helpers = new Set(['bump', 'resolve-bump', 'verify-manifests', 'check-readiness', 'verify-tarballs'])
const versionPattern = /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)$/

function run(command: string, args: string[], capture = false): string {
  const result = spawnSync(command, args, {
    cwd: repoRoot,
    encoding: 'utf8',
    stdio: ['ignore', capture ? 'pipe' : 'inherit', 'inherit'],
  })
  if (result.error) throw result.error
  assertCondition(result.status === 0, `${command} failed (${String(result.status ?? result.signal)})`)
  return result.stdout?.trim() ?? ''
}

function helper(command: string, args: string[] = [], capture = false): string {
  const fileName = command === 'bump' ? 'bump-version' : command
  return run(process.execPath, [jitiCli, path.join(repoRoot, 'scripts/release', `${fileName}.ts`), ...args], capture)
}

function githubRepository(remote: string): string {
  const url = new URL(remote.replace(/^git@([^:]+):/, 'https://$1/'))
  const repositoryPath = url.pathname.replace(/^\//, '').replace(/\.git$/, '')
  assertCondition(['https:', 'ssh:'].includes(url.protocol) && /^[^/]+\/[^/]+$/.test(repositoryPath), 'origin must be a GitHub repository URL')
  return `${url.hostname}/${repositoryPath}`
}

function startRelease(version: string, args: string[]): void {
  assertCondition(['auto', 'patch', 'minor', 'major'].includes(version) || versionPattern.test(version), `Unknown release command: ${version}`)
  assertCondition(
    args.length === 0 || (args.length === 1 && args[0] === '--dry-run'),
    'Usage: pnpm release <auto|patch|minor|major|x.y.z> [--dry-run]'
  )
  assertCondition(run('git', ['branch', '--show-current'], true) === 'develop', 'Run releases from the develop branch')
  assertCondition(run('git', ['status', '--porcelain'], true) === '', 'Commit or stash changes before releasing')

  const origin = githubRepository(run('git', ['remote', 'get-url', 'origin'], true))
  const pushUrls = run('git', ['remote', 'get-url', '--push', '--all', 'origin'], true).split('\n')
  assertCondition(pushUrls.length === 1 && githubRepository(pushUrls[0] ?? '') === origin, 'origin fetch and push must identify the same repository')
  helper('verify-manifests')

  const nextVersion = version === 'auto' ? 'auto (resolved by GitHub Actions)' : helper('bump', [version, '--print-version'], true)
  console.log(`Release: ${origin} · develop → main · ${nextVersion}`)

  const workflowArgs = [
    'workflow',
    'run',
    'release-pr.yml',
    '--repo',
    origin,
    '--ref',
    'develop',
    '-f',
    `bump=${versionPattern.test(version) ? 'custom' : version}`,
    '-f',
    'source_branch=develop',
    '-f',
    'target_branch=main',
  ]
  if (versionPattern.test(version)) workflowArgs.push('-f', `custom_version=${version}`)

  if (args[0] === '--dry-run') {
    console.log('Dry run: push origin develop, then request the release PR workflow. No versions or remote state changed.')
    return
  }

  const repositoryUrl = run('gh', ['repo', 'view', origin, '--json', 'url', '--jq', '.url'], true)
  const sourceCommit = run('git', ['rev-parse', 'HEAD'], true)
  run('git', ['push', 'origin', `${sourceCommit}:refs/heads/develop`])
  run('gh', workflowArgs)
  console.log(`Release PR workflow: ${repositoryUrl}/actions/workflows/release-pr.yml`)
  console.log('Merge the release PR after CI passes to publish through Releaseway.')
}

function main(): void {
  const [command, ...args] = process.argv.slice(2).filter((arg) => arg !== '--')
  if (!command || command === '--help' || command === '-h') {
    console.log('Usage: pnpm release <auto|patch|minor|major|x.y.z> [--dry-run]')
    console.log('Checks: pnpm release verify')
    console.log(`CI steps: pnpm release <${[...helpers].join('|')}> [arguments]`)
    return
  }
  if (helpers.has(command)) {
    helper(command, args)
    return
  }
  if (command === 'verify') {
    assertCondition(args.length === 0, 'Usage: pnpm release verify')
    helper('verify-manifests')
    run('pnpm', ['build'])
    helper('check-readiness', ['--registry', 'https://registry.npmjs.org'])
    return
  }
  startRelease(command, args)
}

try {
  main()
} catch (error) {
  console.error(`release failed: ${error instanceof Error ? error.message : String(error)}`)
  process.exitCode = 1
}
