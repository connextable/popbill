import { readMember } from './read-member.ts'

const argument = process.argv.slice(2).filter((value) => value !== '--')[0]
if (argument === '--help' || argument === '-h') {
  console.log('Usage: pnpm -C examples common')
  console.log('Set POPBILL_RUN_COMMON_EXAMPLES=true and POPBILL_IS_TEST=true. Reads membership, company information and point balance.')
} else {
  if (argument !== undefined) throw new Error('Unknown common example argument: ' + argument)
  if (process.env.POPBILL_RUN_COMMON_EXAMPLES !== 'true') throw new Error('Set POPBILL_RUN_COMMON_EXAMPLES=true.')
  if (process.env.POPBILL_IS_TEST !== 'true') throw new Error('Common examples require POPBILL_IS_TEST=true.')
  console.log(await readMember())
}
