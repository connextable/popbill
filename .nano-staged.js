import { extname, relative } from 'node:path'

const quoteArg = (value) => JSON.stringify(value)
const lintExtensions = new Set(['.cjs', '.cts', '.js', '.jsx', '.mjs', '.mts', '.ts', '.tsx'])

const stagedFileCommands = ({ filenames }) => {
  const files = filenames.map((filename) => relative(process.cwd(), filename))
  const fileArgs = files.map(quoteArg).join(' ')
  const lintFileArgs = files
    .filter((filename) => lintExtensions.has(extname(filename)))
    .map(quoteArg)
    .join(' ')
  const commands = [`pnpm exec oxfmt --no-error-on-unmatched-pattern ${fileArgs}`]

  if (lintFileArgs) {
    commands.push(`pnpm exec oxlint --fix ${lintFileArgs}`)
  }

  return commands
}

export default {
  '*': stagedFileCommands,
}
