import type { ExampleContext, Runner, ScenarioDefinition } from '../types.ts'
import { ensureIssuedInvoice } from '../workflows/invoice.ts'
import { summarizeArrayLength, summarizeGenericObject, summarizeOperationResult } from '../utils/summarizers.ts'

export const notifyScenario: ScenarioDefinition = {
  description: '메일/SMS/FAX 재전송, 이메일전송설정 조회/수정, 국세청전송설정 조회',
  async run(context: ExampleContext, runner: Runner): Promise<void> {
    const managementKey = await ensureIssuedInvoice(context, runner, 'NTF')
    if (!managementKey) {
      return
    }

    const documentInput = {
      businessNumber: context.businessNumber,
      invoiceDocumentKeyType: context.invoiceDocumentKeyType,
      invoiceManagementKey: managementKey,
    }

    const resendEmailInput = {
      ...documentInput,
      receiverEmailAddress: context.config.receiverEmail,
    }
    await runner.run(
      'resendInvoiceEmail',
      resendEmailInput,
      () => context.service.resendInvoiceEmail(resendEmailInput),
      summarizeOperationResult
    )

    const resendSMSInput = {
      ...documentInput,
      senderPhoneNumber: context.config.senderPhoneNumber,
      receiverPhoneNumber: context.config.receiverPhoneNumber,
      messageBody: 'examples resend sms',
    }
    await runner.run(
      'resendInvoiceSMS',
      resendSMSInput,
      () => context.service.resendInvoiceSMS(resendSMSInput),
      summarizeOperationResult
    )

    const resendFAXInput = {
      ...documentInput,
      senderNumber: context.config.senderFaxNumber,
      receiverNumber: context.config.receiverFaxNumber,
    }
    await runner.run(
      'resendInvoiceFAX',
      resendFAXInput,
      () => context.service.resendInvoiceFAX(resendFAXInput),
      summarizeOperationResult
    )

    const emailSendSettingsInput = {
      businessNumber: context.businessNumber,
    }
    const settingsResult = await runner.run(
      'getEmailSendSettings',
      emailSendSettingsInput,
      () => context.service.getEmailSendSettings(emailSendSettingsInput),
      summarizeArrayLength
    )

    const emailType =
      settingsResult.ok && Array.isArray(settingsResult.value)
        ? settingsResult.value.find((setting) => typeof setting.emailTypeCode === 'string')?.emailTypeCode
        : undefined

    const updateEmailSendSettingsInput = {
      businessNumber: context.businessNumber,
      emailType: emailType ?? 'TAX_ISSUE',
      sendEnabled: true,
    }
    await runner.run(
      'updateEmailSendSettings',
      updateEmailSendSettingsInput,
      () => context.service.updateEmailSendSettings(updateEmailSendSettingsInput),
      summarizeOperationResult
    )

    await runner.run(
      'getSendToNTSSettings',
      emailSendSettingsInput,
      () => context.service.getSendToNTSSettings(emailSendSettingsInput),
      summarizeGenericObject
    )
  },
}
