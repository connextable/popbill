import { spawnSync } from 'node:child_process'
import { mkdtempSync, readFileSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { expect, test } from 'vitest'

test('passes multiline commit Markdown literally to GitHub', () => {
  const markdown =
    'Recommended bump: `patch`\n\nIncluded commits:\n- `abc123` fix: preserve $(printf shell-substitution) and `printf shell-backticks`'
  const workflow = readFileSync(new URL('../../.github/workflows/release-pr.yml', import.meta.url), 'utf8')
  const step = workflow.split('        id: pr\n')[1]?.split('\n      - ')[0]
  const script = step
    ?.split('        run: |\n')[1]
    ?.replace(/^ {10}/gm, '')
    .replaceAll('${{ inputs.bump }}', 'patch')
    .replaceAll('${{ steps.release_commits.outputs.markdown }}', markdown)
  const directory = mkdtempSync(path.join(tmpdir(), 'popbill-release-pr-'))
  const githubStub = `gh() {
    while [[ "$#" -gt 0 ]]; do
      if [[ "$1" == "--body-file" ]]; then cat "$2"; return; fi
      shift
    done
  }`

  try {
    const result = spawnSync('bash', ['-c', `${githubStub}\n${script}`], {
      encoding: 'utf8',
      timeout: 1000,
      env: {
        PATH: process.env['PATH'],
        RUNNER_TEMP: directory,
        VERSION: '1.0.2',
        VERSION_SPEC: 'patch',
        SOURCE_BRANCH: 'develop',
        TARGET_BRANCH: 'main',
        BRANCH_NAME: 'release/v1.0.2',
        GITHUB_REPOSITORY: 'example/popbill',
        INCLUDED_COMMITS: markdown,
      },
    })

    expect(result.status).toBe(0)
    expect(result.stdout).toContain(markdown)
  } finally {
    rmSync(directory, { recursive: true, force: true })
  }
})
