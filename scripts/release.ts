import { spawnSync } from 'node:child_process'
import { createRequire } from 'node:module'
import path from 'node:path'
import {
  assertCondition,
  getLockstepVersion,
  loadPublishManifests,
  loadRootManifest,
  publishPackages,
  repoRoot,
  rootManifestPath,
} from './release/manifest-utils'

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
  assertCondition(result.status === 0, `${command} ${args.join(' ')} failed (${String(result.status ?? result.signal)})`)
  return result.stdout?.trim() ?? ''
}

function helper(command: string, args: string[] = [], capture = false): string {
  const fileName = command === 'bump' ? 'bump-version' : command
  return run(process.execPath, [jitiCli, path.join(repoRoot, 'scripts/release', `${fileName}.ts`), ...args], capture)
}

function startRelease(version: string, args: string[]): void {
  assertCondition(['auto', 'patch', 'minor', 'major'].includes(version) || versionPattern.test(version), `Unknown release command: ${version}`)
  assertCondition(
    args.length === 0 || (args.length === 1 && args[0] === '--dry-run'),
    'Usage: pnpm release <auto|patch|minor|major|x.y.z> [--dry-run]'
  )
  assertCondition(run('git', ['branch', '--show-current'], true) === 'develop', 'Run releases from the develop branch')
  assertCondition(run('git', ['status', '--porcelain'], true) === '', 'Commit or stash changes before releasing')

  const fetchUrls = run('git', ['remote', 'get-url', '--all', 'origin'], true).split('\n')
  const pushUrls = run('git', ['remote', 'get-url', '--push', '--all', 'origin'], true).split('\n')
  assertCondition(
    fetchUrls.length === 1 && pushUrls.length === 1 && fetchUrls[0] === pushUrls[0],
    'origin must have one identical fetch and push URL'
  )
  helper('verify-manifests')

  if (args[0] !== '--dry-run') {
    run('git', ['fetch', '--no-tags', 'origin', 'develop', 'main'])
    run('git', ['merge-base', '--is-ancestor', 'refs/remotes/origin/develop', 'HEAD'])
  }

  const versionSpec = version === 'auto' ? helper('resolve-bump', ['--base-ref', 'origin/main', '--print-bump'], true) : version
  const nextVersion = helper('bump', [versionSpec, '--allow-same', '--print-version'], true)
  console.log(`Release: develop → main · ${nextVersion}`)
  if (args[0] === '--dry-run') {
    console.log(
      'Dry run: bump versions, merge origin/main, verify, then atomically push develop and main. No files or remote state changed; remote refs were not fetched.'
    )
    return
  }

  helper('bump', [nextVersion, '--allow-same'])
  const manifestPaths = [rootManifestPath, ...publishPackages.map((target) => target.manifestPath)].map((manifestPath) =>
    path.relative(repoRoot, manifestPath)
  )
  if (run('git', ['diff', '--name-only', '--', ...manifestPaths], true) !== '') {
    run('git', ['add', '--', ...manifestPaths])
    run('git', ['commit', '-m', `chore(release): bump version to ${nextVersion}`, '-m', 'Release: none'])
  }

  run('git', ['merge', '--no-edit', 'origin/main'])
  assertCondition(
    loadRootManifest().version === nextVersion && getLockstepVersion(loadPublishManifests()) === nextVersion,
    `Merged manifests must all use the release version ${nextVersion}`
  )
  assertCondition(
    run('git', ['rev-parse', 'HEAD'], true) !== run('git', ['rev-parse', 'origin/main'], true),
    'This commit is already on origin/main. Retry the existing failed Release run in GitHub Actions.'
  )

  const readiness = JSON.parse(helper('check-readiness', ['--registry', 'https://registry.npmjs.org'], true)) as {
    packages: Array<{ alreadyPublished: boolean }>
  }
  assertCondition(
    readiness.packages.length === publishPackages.length && readiness.packages.every((target) => !target.alreadyPublished),
    'The release version already exists on npm. Choose a new version, or resume the original failed Release run using its original artifact.'
  )

  helper('verify-manifests')
  for (const check of ['build', 'typecheck', 'lint', 'test']) run('pnpm', [check])
  assertCondition(run('git', ['status', '--porcelain'], true) === '', 'Release checks changed files. Review and commit them before retrying.')
  run('git', ['push', '--atomic', '--no-follow-tags', 'origin', 'HEAD:refs/heads/develop', 'HEAD:refs/heads/main'])
  console.log(`Pushed ${nextVersion} to develop and main. The Release workflow will publish through Releaseway.`)
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
