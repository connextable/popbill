import { spawnSync } from 'node:child_process'
import fs from 'node:fs'
import { assertCondition } from './manifest-utils'

type ReleaseImpact = 'none' | 'patch' | 'minor' | 'major'

interface CliOptions {
  allowNone: boolean
  baseRef?: string
  printBump: boolean
  printMarkdown: boolean
  requireSyncMarker: boolean
}

interface CommitInfo {
  hash: string
  subject: string
  body: string
}

const impactRank: Record<ReleaseImpact, number> = {
  none: 0,
  patch: 1,
  minor: 2,
  major: 3,
}

function readCliOptions(): CliOptions {
  const args = process.argv.slice(2).filter((arg) => arg !== '--')
  const options: CliOptions = {
    allowNone: false,
    printBump: false,
    printMarkdown: false,
    requireSyncMarker: false,
  }

  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index]

    if (arg === '--print-bump') {
      options.printBump = true
      continue
    }

    if (arg === '--print-markdown') {
      options.printMarkdown = true
      continue
    }

    if (arg === '--allow-none') {
      options.allowNone = true
      continue
    }

    if (arg === '--require-sync-marker') {
      options.requireSyncMarker = true
      continue
    }

    if (arg === '--base-ref') {
      const baseRef = args[index + 1]
      assertCondition(typeof baseRef === 'string' && baseRef.length > 0, '--base-ref requires a value')
      options.baseRef = baseRef
      index += 1
      continue
    }

    if (arg?.startsWith('--base-ref=')) {
      options.baseRef = arg.slice('--base-ref='.length)
      assertCondition(options.baseRef.length > 0, '--base-ref requires a value')
      continue
    }

    throw new Error(`Unknown argument: ${String(arg)}`)
  }

  return options
}

function git(args: string[]): string {
  const result = spawnSync('git', args, {
    encoding: 'utf8',
  })

  if (result.status !== 0) {
    throw new Error(`git ${args.join(' ')} failed: ${result.stderr.trim()}`)
  }

  return result.stdout.trim()
}

function tryGit(args: string[]): string | undefined {
  const result = spawnSync('git', args, {
    encoding: 'utf8',
  })

  if (result.status !== 0) {
    return undefined
  }

  const output = result.stdout.trim()
  return output.length > 0 ? output : undefined
}

function resolveRangeStart(options: CliOptions): string {
  const lastSyncCommit = tryGit([
    'log',
    '--extended-regexp',
    '--format=%H',
    '--grep=^chore\\(release\\): sync version to [0-9]+\\.[0-9]+\\.[0-9]+$',
    '-n',
    '1',
    'HEAD',
  ])
  if (lastSyncCommit) {
    return lastSyncCommit
  }

  assertCondition(
    !options.requireSyncMarker,
    'No release sync commit found. Select patch, minor, major, or custom manually for the first release after enabling auto bump.'
  )

  assertCondition(Boolean(options.baseRef), 'No release sync commit found. Pass --base-ref to infer a first release range.')
  return git(['merge-base', String(options.baseRef), 'HEAD'])
}

function parseCommits(rangeStart: string): CommitInfo[] {
  const output = git(['log', '--format=%H%x1f%s%x1f%b%x1e', `${rangeStart}..HEAD`])
  if (output.length === 0) {
    return []
  }

  return output
    .split('\x1e')
    .map((record) => record.trim())
    .filter((record) => record.length > 0)
    .map((record) => {
      const [hash, subject, body] = record.split('\x1f')
      assertCondition(typeof hash === 'string' && hash.length > 0, `Invalid git log record: ${record}`)
      assertCondition(typeof subject === 'string', `Invalid git log record: ${record}`)

      return {
        hash,
        subject,
        body: body ?? '',
      }
    })
}

function parseReleaseOverride(commit: CommitInfo): ReleaseImpact | undefined {
  const match = /^Release:\s*(none|patch|minor|major)\s*$/im.exec(commit.body)
  return match?.[1] as ReleaseImpact | undefined
}

function inferConventionalImpact(commit: CommitInfo): ReleaseImpact {
  if (/^BREAKING CHANGE:/im.test(commit.body) || /^[a-z]+(?:\([^)]+\))?!:/.test(commit.subject)) {
    return 'major'
  }

  const typeMatch = /^([a-z]+)(?:\([^)]+\))?:/.exec(commit.subject)
  const type = typeMatch?.[1]

  if (type === 'feat') {
    return 'minor'
  }

  if (type === 'fix' || type === 'perf') {
    return 'patch'
  }

  return 'none'
}

function inferCommitImpact(commit: CommitInfo): ReleaseImpact {
  if (/^chore\(release\): (sync version to|bump version to) [0-9]+\.[0-9]+\.[0-9]+$/.test(commit.subject)) {
    return 'none'
  }

  return parseReleaseOverride(commit) ?? inferConventionalImpact(commit)
}

function maxImpact(left: ReleaseImpact, right: ReleaseImpact): ReleaseImpact {
  return impactRank[left] >= impactRank[right] ? left : right
}

function formatMarkdownSummary(recommendedBump: ReleaseImpact, summary: Array<{ hash: string; subject: string; impact: ReleaseImpact }>): string {
  return [
    `Recommended bump: \`${recommendedBump}\``,
    '',
    'Included commits:',
    ...summary.map((commit) => `- \`${commit.hash}\` ${commit.subject} (\`${commit.impact}\`)`),
  ].join('\n')
}

function main(): void {
  const options = readCliOptions()
  const rangeStart = resolveRangeStart(options)
  const commits = parseCommits(rangeStart)

  assertCondition(commits.length > 0, `No commits found in release range ${rangeStart}..HEAD`)

  let recommendedBump: ReleaseImpact = 'none'
  const summary = commits.map((commit) => {
    const impact = inferCommitImpact(commit)
    recommendedBump = maxImpact(recommendedBump, impact)

    return {
      hash: commit.hash.slice(0, 12),
      subject: commit.subject,
      impact,
    }
  })

  assertCondition(
    options.allowNone || recommendedBump !== 'none',
    'No releasable changes found. Select patch, minor, major, or custom manually if this release should publish.'
  )

  const githubOutputPath = process.env['GITHUB_OUTPUT']
  if (githubOutputPath) {
    fs.appendFileSync(githubOutputPath, `bump=${recommendedBump}\n`, 'utf8')
  }

  if (options.printBump) {
    console.log(recommendedBump)
    return
  }

  if (options.printMarkdown) {
    console.log(formatMarkdownSummary(recommendedBump, summary))
    return
  }

  console.log(
    JSON.stringify(
      {
        rangeStart,
        recommendedBump,
        commits: summary,
      },
      null,
      2
    )
  )
}

try {
  main()
} catch (error) {
  console.error(`release:resolve-bump failed: ${error instanceof Error ? error.message : String(error)}`)
  process.exit(1)
}
