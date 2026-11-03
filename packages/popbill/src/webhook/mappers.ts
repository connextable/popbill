import type * as Spec from '@connextable/popbill-spec'
import { PopbillWebhookTypes } from '@connextable/popbill-spec/webhook'
import { PopbillWebhookError, type ParsedPopbillWebhookItem } from '@connextable/popbill-runtime'
import { isRecord, optionalResponseNumber, preserveBooleanResponse, preserveNumericCode, removeUndefinedProperties } from '@connextable/popbill-utils'
import { mapTaxInvoiceInfo } from '../services/tax-invoice/mappers/invoice-info'
import { mapTaxInvoiceBulkIssueSubmissionResult } from '../services/tax-invoice/mappers/response'
import { mapCashbillInfo, mapCashbillBulkResult } from '../services/cashbill/mappers/response'
import { mapStatementInfo } from '../services/statement/mappers/statement-info'
import { mapDocument } from '../services/home-tax-tax-invoice/mappers/response'
import { mapCashbill } from '../services/home-tax-cashbill/mappers/response'
import { message as mapKakaoMessage } from '../services/kakao/mappers/response'
import { mapSentMessage } from '../services/message/mappers/response'
import { mapFaxResult } from '../services/fax/mappers/response'
import type { PopbillWebhookEvent, PopbillWebhookEventData, PopbillWebhookDeliveryData } from './types'

const taxInvoiceStateEvents = new Set(['Issue', 'CancelIssue', 'CLOSEDOWN', 'NTS', 'OPEN', 'Request', 'CancelRequest', 'Refuse', 'MANUAL'])
const cashbillStateEvents = new Set(['Issue', 'NTS', 'MANUAL'])
const statementStateEvents = new Set(['Issue', 'Cancel', 'OPEN', 'MANUAL'])

/** Reuses service response mappers so field names and response normalization have one owner. */
export function mapWebhookItem(item: ParsedPopbillWebhookItem, headerEventType?: string): PopbillWebhookEvent {
  const { body, ...metadata } = item
  const bodyEventType = body['eventType']
  const eventType =
    typeof bodyEventType === 'string' ? bodyEventType : bodyEventType === undefined || bodyEventType === null ? headerEventType : undefined
  const source = { ...metadata, eventType, occurredAt: typeof body['eventDT'] === 'string' ? body['eventDT'] : undefined, raw: body }
  const common = eventData(body)
  switch (item.webhookType) {
    case PopbillWebhookTypes.TaxInvoice:
      if (eventType === 'BULK.RESULT' || (eventType === 'MANUAL' && body['submitID'] !== undefined)) {
        const value = payload<Spec.TaxInvoiceGetBulkResultApiResponse>(body, ['submitID', 'receiptID'], ['issueResult'])
        return { ...source, kind: 'taxInvoice.bulkResult', data: { ...mapTaxInvoiceBulkIssueSubmissionResult(value), ...common } }
      }
      if (eventType === 'REGIST' || eventType === 'DELETE') {
        const value = payload<Spec.TaxInvoiceCertificateWebhookBody>(body, ['corpNum'])
        return {
          ...source,
          kind: 'taxInvoice.certificate',
          data: removeUndefinedProperties({
            ...common,
            expiresAt: value.expireDT,
            registeredByUserId: value.regContactID,
            issuerDistinguishedName: value.issuerDN,
            subjectDistinguishedName: value.subjectDN,
            policyIdentifier: value.oid ?? value.OID,
          }),
        }
      }
      if (eventType !== undefined && taxInvoiceStateEvents.has(eventType)) {
        return {
          ...source,
          kind: 'taxInvoice.state',
          data: { ...mapTaxInvoiceInfo(payload<Spec.TaxInvoiceGetInfoApiResponse>(body, ['itemKey'])), ...common },
        }
      }
      break
    case PopbillWebhookTypes.Cashbill:
      if (eventType === 'BULK.RESULT' || (eventType === 'MANUAL' && body['submitID'] !== undefined)) {
        return {
          ...source,
          kind: 'cashbill.bulkResult',
          data: {
            ...mapCashbillBulkResult(payload<Spec.CashbillGetBulkResultApiResponse>(body, ['submitID', 'receiptID'], ['issueResult'])),
            ...common,
          },
        }
      }
      if (eventType !== undefined && cashbillStateEvents.has(eventType)) {
        return { ...source, kind: 'cashbill.state', data: { ...mapCashbillInfo(payload<Spec.CashbillInfoApiModel>(body, ['itemKey'])), ...common } }
      }
      break
    case PopbillWebhookTypes.Statement:
      if (eventType !== undefined && statementStateEvents.has(eventType)) {
        return { ...source, kind: 'statement.state', data: { ...mapStatementInfo(payload<Spec.StatementInfo>(body, ['itemKey'])), ...common } }
      }
      break
    case PopbillWebhookTypes.HomeTaxTaxInvoice: {
      const value = payload<Spec.HomeTaxTaxInvoiceWebhookBody>(body, ['ntsconfirmNum'], ['detailList'])
      return { ...source, kind: 'homeTaxTaxInvoice.collected', data: { ...mapDocument(value), sentDate: value.sendDate } }
    }
    case PopbillWebhookTypes.HomeTaxCashbill:
      return { ...source, kind: 'homeTaxCashbill.collected', data: mapCashbill(payload<Spec.HomeTaxCashbillWebhookBody>(body, ['ntsconfirmNum'])) }
    case PopbillWebhookTypes.Kakao:
      if (eventType === 'RESULT' || eventType === 'MANUAL') {
        const value = payload<Spec.KakaoMessageApiModel>(body, ['receiptNum'])
        const raw = body as Spec.KakaoWebhookBody
        return {
          ...source,
          kind: 'kakao.result',
          data: {
            ...mapKakaoMessage(value),
            ...deliveryData(body),
            contentTypeCode: preserveNumericCode(raw.contentType),
            stateCode: preserveNumericCode(raw.state),
            resultCode: preserveNumericCode(raw.result),
            fallbackResultCode: preserveNumericCode(raw.altResult),
          },
        }
      }
      break
    case PopbillWebhookTypes.Message:
      if (eventType === 'RESULT' || eventType === 'MANUAL') {
        const value = payload<Spec.MessageSentApiModel>(body, ['receiptNum'])
        return {
          ...source,
          kind: 'message.result',
          data: { ...mapSentMessage(value), ...deliveryData(body), senderName: optionalString(body['sendName']) ?? value.senderName },
        }
      }
      break
    case PopbillWebhookTypes.Fax:
      if (eventType === 'RESULT' || eventType === 'MANUAL') {
        const value = payload<Spec.FaxResultApiModel>(body, ['receiptNum'], ['fileNames'], false)
        const raw = body as Spec.FaxWebhookBody
        return {
          ...source,
          kind: 'fax.result',
          data: {
            ...mapFaxResult(value),
            ...deliveryData(body),
            stateCode: preserveNumericCode(raw.state),
            resultCode: preserveNumericCode(raw.result),
            recipientNumberType: raw.receiveNumType,
            convertedFileSize: optionalResponseNumber(raw.tiffFileSize),
          },
        }
      }
      break
    default:
      return { ...source, kind: 'unknown', data: body }
  }
  if (eventType === undefined || eventType.trim() === '')
    throw new PopbillWebhookError('INVALID_PAYLOAD', `Missing or invalid event type at index ${item.index}.`)
  return { ...source, kind: 'unknown', data: body }
}

function eventData(body: Record<string, unknown>): PopbillWebhookEventData {
  const value = body as Spec.PopbillWebhookEventBody
  return removeUndefinedProperties({ businessNumber: value.corpNum, isApiLinkedDocument: preserveBooleanResponse(value.interOPYN) })
}

function deliveryData(body: Record<string, unknown>): PopbillWebhookDeliveryData {
  return { ...eventData(body), sequenceNumber: optionalResponseNumber(body['serialNum']) }
}

/** Validate structures consumed by existing mappers, without rejecting future codes or additional fields. */
function payload<T>(body: Record<string, unknown>, identifiers: string[], arrays: string[] = [], records = true): T {
  if (identifiers.some((key) => typeof body[key] !== 'string' || body[key].trim() === '')) {
    throw new PopbillWebhookError('INVALID_PAYLOAD', 'Missing or invalid webhook identifier.')
  }
  for (const key of arrays) {
    const value = body[key]
    if (value === undefined || value === null) continue
    if (!Array.isArray(value) || !value.every(records ? isRecord : (entry: unknown) => typeof entry === 'string')) {
      throw new PopbillWebhookError('INVALID_PAYLOAD', 'Invalid webhook collection structure.')
    }
  }
  return body as T
}

function optionalString(value: unknown): string | undefined {
  if (value === undefined || value === null) return undefined
  if (typeof value !== 'string') throw new PopbillWebhookError('INVALID_PAYLOAD', 'Invalid webhook event metadata.')
  return value
}
