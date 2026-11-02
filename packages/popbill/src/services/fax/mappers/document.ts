import type { FaxReceiver, FaxResendOptions, FaxSendOptions } from '@connextable/popbill-compat/factory'
import type { FaxRecipient, FaxResendOverrides, FaxSendInput } from '../types'

export function mapFaxRecipients(recipients: readonly FaxRecipient[]): FaxReceiver[] {
  return recipients.map((recipient) => ({
    receiveNum: recipient.phoneNumber,
    receiveName: recipient.name,
    interOPRefKey: recipient.partnerReferenceKey,
  }))
}
export function mapFaxSendInput(input: FaxSendInput, userId: string): FaxSendOptions {
  return {
    RequestNum: input.requestNumber,
    SenderNum: input.senderPhoneNumber,
    SenderName: input.senderName,
    Receiver: mapFaxRecipients(input.recipients),
    Title: input.title,
    AdsYN: input.isAdvertisement,
    ReserveDT: input.scheduledAt,
    UserID: userId,
  }
}
export function mapFaxResendInput(input: FaxResendOverrides, userId: string): FaxResendOptions {
  return {
    RequestNum: input.newRequestNumber,
    SenderNum: input.senderPhoneNumber,
    SenderName: input.senderName,
    Receiver: input.recipients === undefined ? undefined : mapFaxRecipients(input.recipients),
    Title: input.title,
    ReserveDT: input.scheduledAt,
    UserID: userId,
  }
}
