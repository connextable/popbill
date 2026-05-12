import type { MethodDefinition } from './types.ts'
import { summarizeAccessUrl, summarizeGenericObject, summarizeOperationResult } from '../utils/summarizers.ts'

export const CERTIFICATE_METHODS = {
  getTaxCertificateRegistrationURL: {
    description: '인증서 등록 URL 조회',
    async run(context, runner) {
      const input = { businessNumber: context.businessNumber }
      await runner.run('getTaxCertificateRegistrationURL', input, () => context.service.getTaxCertificateRegistrationURL(input), summarizeAccessUrl)
    },
  },

  getTaxCertificateExpirationDate: {
    description: '인증서 만료일 조회',
    async run(context, runner) {
      const input = { businessNumber: context.businessNumber }
      await runner.run('getTaxCertificateExpirationDate', input, () => context.service.getTaxCertificateExpirationDate(input), summarizeGenericObject)
    },
  },

  checkTaxCertificateValidation: {
    description: '인증서 유효성 점검',
    async run(context, runner) {
      const input = { businessNumber: context.businessNumber }
      await runner.run('checkTaxCertificateValidation', input, () => context.service.checkTaxCertificateValidation(input), summarizeOperationResult)
    },
  },

  getTaxCertificateInfo: {
    description: '인증서 정보 조회',
    async run(context, runner) {
      const input = { businessNumber: context.businessNumber }
      await runner.run('getTaxCertificateInfo', input, () => context.service.getTaxCertificateInfo(input), summarizeGenericObject)
    },
  },
} as const satisfies Record<string, MethodDefinition>
