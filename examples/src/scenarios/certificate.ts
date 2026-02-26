import type { ExampleContext, Runner, ScenarioDefinition } from '../types.ts'
import { summarizeAccessUrl, summarizeGenericObject, summarizeOperationResult } from '../utils/summarizers.ts'

export const certificateScenario: ScenarioDefinition = {
  description: '인증서 URL/만료일/유효성/인증서정보',
  async run(context: ExampleContext, runner: Runner): Promise<void> {
    const businessInput = {
      businessNumber: context.businessNumber,
    }

    await runner.run(
      'getTaxCertificateRegistrationURL',
      businessInput,
      () => context.service.getTaxCertificateRegistrationURL(businessInput),
      summarizeAccessUrl
    )
    await runner.run(
      'getTaxCertificateExpirationDate',
      businessInput,
      () => context.service.getTaxCertificateExpirationDate(businessInput),
      summarizeGenericObject
    )
    await runner.run(
      'checkTaxCertificateValidation',
      businessInput,
      () => context.service.checkTaxCertificateValidation(businessInput),
      summarizeOperationResult
    )
    await runner.run(
      'getTaxCertificateInfo',
      businessInput,
      () => context.service.getTaxCertificateInfo(businessInput),
      summarizeGenericObject
    )
  },
}
