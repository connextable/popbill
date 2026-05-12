import type { MethodDefinition } from './types.ts'
import { DEFAULT_TAX_INVOICE_EMAIL_TYPE, type TaxInvoiceEmailType, type UpdateEmailSendSettingsInput } from '../types.ts'
import { createDocumentRequest, prepareIssuedInvoiceKey } from './helpers.ts'
import { summarizeArrayLength, summarizeGenericObject, summarizeOperationResult } from '../utils/summarizers.ts'

export const NOTIFY_METHODS = {
  resendInvoiceEmail: {
    description: '메일 재전송',
    async run(context, runner) {
      const managementKey = await prepareIssuedInvoiceKey(context, runner, 'EML')
      if (!managementKey) {
        return
      }

      const input = {
        ...createDocumentRequest(context, managementKey),
        receiverEmailAddress: context.config.receiverEmail,
      }
      await runner.run('resendInvoiceEmail', input, () => context.service.resendInvoiceEmail(input), summarizeOperationResult)
    },
  },

  resendInvoiceSMS: {
    description: 'SMS 재전송',
    async run(context, runner) {
      const managementKey = await prepareIssuedInvoiceKey(context, runner, 'SMS')
      if (!managementKey) {
        return
      }

      const input = {
        ...createDocumentRequest(context, managementKey),
        senderPhoneNumber: context.config.senderPhoneNumber,
        receiverPhoneNumber: context.config.receiverPhoneNumber,
        messageBody: 'examples resend sms by method',
      }
      await runner.run('resendInvoiceSMS', input, () => context.service.resendInvoiceSMS(input), summarizeOperationResult)
    },
  },

  resendInvoiceFAX: {
    description: 'FAX 재전송',
    async run(context, runner) {
      const managementKey = await prepareIssuedInvoiceKey(context, runner, 'FAX')
      if (!managementKey) {
        return
      }

      const input = {
        ...createDocumentRequest(context, managementKey),
        senderNumber: context.config.senderFaxNumber,
        receiverNumber: context.config.receiverFaxNumber,
      }
      await runner.run('resendInvoiceFAX', input, () => context.service.resendInvoiceFAX(input), summarizeOperationResult)
    },
  },

  getEmailSendSettings: {
    description: '이메일 발송설정 조회',
    async run(context, runner) {
      const input = {
        businessNumber: context.businessNumber,
      }
      await runner.run('getEmailSendSettings', input, () => context.service.getEmailSendSettings(input), summarizeArrayLength)
    },
  },

  updateEmailSendSettings: {
    description: '이메일 발송설정 수정',
    async run(context, runner) {
      const businessInput = {
        businessNumber: context.businessNumber,
      }

      const settingsResult = await runner.run(
        'setup.getEmailSendSettings',
        businessInput,
        () => context.service.getEmailSendSettings(businessInput),
        summarizeArrayLength
      )

      const emailType =
        settingsResult.ok && Array.isArray(settingsResult.value)
          ? (settingsResult.value.find((setting) => typeof setting.emailTypeCode === 'string')?.emailTypeCode as TaxInvoiceEmailType | undefined)
          : undefined

      const input: UpdateEmailSendSettingsInput = {
        businessNumber: context.businessNumber,
        emailType: emailType ?? DEFAULT_TAX_INVOICE_EMAIL_TYPE,
        sendEnabled: true,
      }
      await runner.run('updateEmailSendSettings', input, () => context.service.updateEmailSendSettings(input), summarizeOperationResult)
    },
  },

  getSendToNTSSettings: {
    description: '국세청 전송설정 조회',
    async run(context, runner) {
      const input = {
        businessNumber: context.businessNumber,
      }
      await runner.run('getSendToNTSSettings', input, () => context.service.getSendToNTSSettings(input), summarizeGenericObject)
    },
  },
} as const satisfies Record<string, MethodDefinition>
