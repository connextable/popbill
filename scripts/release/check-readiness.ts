import { spawnSync } from 'node:child_process'
import fs from 'node:fs'
import { assertCondition, getLockstepVersion, loadPublishManifests } from './manifest-utils'

interface CliOptions {
  registryUrl?: string
}

function readCliOptions(): CliOptions {
  const args = process.argv.slice(2).filter((arg) => arg !== '--')
  const options: CliOptions = {}

  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index]

    if (arg === '--registry') {
      const registryUrl = args[index + 1]
      assertCondition(Boolean(registryUrl), '--registry requires a value')
      options.registryUrl = registryUrl
      index += 1
      continue
    }

    if (arg?.startsWith('--registry=')) {
      options.registryUrl = arg.slice('--registry='.length)
      assertCondition(options.registryUrl.length > 0, '--registry requires a value')
      continue
    }

    throw new Error(`Unknown argument: ${String(arg)}`)
  }

  return options
}

function isVersionPublished(packageName: string, version: string, options: CliOptions): boolean {
  const args = ['view', `${packageName}@${version}`, 'version', '--json']
  if (options.registryUrl) {
    args.push('--registry', options.registryUrl)
  }

  const result = spawnSync('npm', args, {
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

  const registryLabel = options.registryUrl ? ` on ${options.registryUrl}` : ''
  throw new Error(`npm view failed for ${packageName}@${version}${registryLabel}: ${errorOutput.trim()}`)
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
  const options = readCliOptions()
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
    const alreadyPublished = isVersionPublished(target.name, version, options)
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
  console.log(JSON.stringify({ registry: options.registryUrl ?? 'default', packages: summary }, null, 2))
}

try {
  main()
} catch (error) {
  console.error(`release:check-readiness failed: ${error instanceof Error ? error.message : String(error)}`)
  process.exit(1)
}
