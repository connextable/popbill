import { spawnSync } from 'node:child_process'
import fs from 'node:fs'
import { assertCondition, getLockstepVersion, loadPublishManifests } from './manifest-utils'

function isVersionPublished(packageName: string, version: string): boolean {
  const result = spawnSync('npm', ['view', `${packageName}@${version}`, 'version', '--json'], {
    encoding: 'utf8',
  })

  if (result.status === 0) {
    const trimmed = result.stdout.trim()
    if (trimmed.length === 0) {
      return false
    }

    const parsed: unknown = JSON.parse(trimmed)
    if (Array.isArray(parsed)) {
      return parsed.some((publishedVersion) => publishedVersion === version)
    }

    return parsed === version
  }

  const errorOutput = `${result.stdout}\n${result.stderr}`
  if (errorOutput.includes('E404')) {
    return false
  }

  throw new Error(`npm view failed for ${packageName}@${version}: ${errorOutput.trim()}`)
}

function writeGithubOutputs(outputs: Record<string, string>): void {
  const githubOutputPath = process.env['GITHUB_OUTPUT']
  if (!githubOutputPath) {
    return
  }

  for (const [key, value] of Object.entries(outputs)) {
    fs.appendFileSync(githubOutputPath, `${key}=${String(value)}\n`, 'utf8')
  }
}

function main(): void {
  const targets = loadPublishManifests()
  const version = getLockstepVersion(targets)

  for (const { name, manifest } of targets) {
    assertCondition(manifest.publishConfig?.access === 'public', `${name} must set publishConfig.access=public`)
  }

  const outputs: Record<string, string> = {
    version,
    publish_any: 'false',
  }

  const summary: Array<{
    package: string
    version: string
    alreadyPublished: boolean
    shouldPublish: boolean
  }> = []
  for (const target of targets) {
    const alreadyPublished = isVersionPublished(target.name, version)
    const shouldPublish = !alreadyPublished
    const outputKey = `publish_${target.alias}`

    outputs[outputKey] = shouldPublish ? 'true' : 'false'
    if (shouldPublish) {
      outputs['publish_any'] = 'true'
    }

    summary.push({
      package: target.name,
      version,
      alreadyPublished,
      shouldPublish,
    })
  }

  writeGithubOutputs(outputs)
  console.log(JSON.stringify(summary, null, 2))
}

try {
  main()
} catch (error) {
  console.error(`release:check-readiness failed: ${error instanceof Error ? error.message : String(error)}`)
  process.exit(1)
}
