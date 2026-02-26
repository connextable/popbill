import type { ScenarioDefinition } from '../types.ts'
import { attachmentScenario } from './attachment.ts'
import { bulkScenario } from './bulk.ts'
import { certificateScenario } from './certificate.ts'
import { inquiryScenario } from './inquiry.ts'
import { issueScenario } from './issue.ts'
import { notifyScenario } from './notify.ts'
import { reverseScenario } from './reverse.ts'
import { searchScenario } from './search.ts'
import { urlsScenario } from './urls.ts'

export const SCENARIOS = {
  issue: issueScenario,
  inquiry: inquiryScenario,
  urls: urlsScenario,
  attachment: attachmentScenario,
  notify: notifyScenario,
  reverse: reverseScenario,
  bulk: bulkScenario,
  search: searchScenario,
  certificate: certificateScenario,
} as const satisfies Record<string, ScenarioDefinition>

export type ScenarioName = keyof typeof SCENARIOS
