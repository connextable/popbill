import type { CompatConfig } from '../../config'
import {
  createTypedCallbackServiceStub,
} from '../../adapters/callback-adapter'
import {
  createTypedPromiseServiceStub,
} from '../../adapters/promise-adapter'
import { TAXINVOICE_METHODS } from './methods'
import { createTaxinvoiceRuntimeMethods } from './runtime'
import type {
  TaxinvoiceCallbackService,
  TaxinvoicePromiseService,
} from './types'

const SERVICE_NAME = 'TaxinvoiceService'

export function createTaxinvoiceService(config: CompatConfig): TaxinvoiceCallbackService {
  const service = createTypedCallbackServiceStub<TaxinvoiceCallbackService>(SERVICE_NAME, TAXINVOICE_METHODS)
  const runtimeMethods = createTaxinvoiceRuntimeMethods(config)

  service.issue = runtimeMethods.callback.issue
  service.cancelIssue = runtimeMethods.callback.cancelIssue
  service.getURL = runtimeMethods.callback.getURL
  service.getPopUpURL = runtimeMethods.callback.getPopUpURL
  service.getViewURL = runtimeMethods.callback.getViewURL
  service.getPrintURL = runtimeMethods.callback.getPrintURL
  service.getPDFURL = runtimeMethods.callback.getPDFURL
  service.getMassPrintURL = runtimeMethods.callback.getMassPrintURL
  service.getEPrintURL = runtimeMethods.callback.getEPrintURL
  service.getMailURL = runtimeMethods.callback.getMailURL

  return service
}

export function createTaxinvoicePromiseService(config: CompatConfig): TaxinvoicePromiseService {
  const service = createTypedPromiseServiceStub<TaxinvoicePromiseService>(SERVICE_NAME, TAXINVOICE_METHODS)
  const runtimeMethods = createTaxinvoiceRuntimeMethods(config)

  service.issue = runtimeMethods.promise.issue
  service.cancelIssue = runtimeMethods.promise.cancelIssue
  service.getURL = runtimeMethods.promise.getURL
  service.getPopUpURL = runtimeMethods.promise.getPopUpURL
  service.getViewURL = runtimeMethods.promise.getViewURL
  service.getPrintURL = runtimeMethods.promise.getPrintURL
  service.getPDFURL = runtimeMethods.promise.getPDFURL
  service.getMassPrintURL = runtimeMethods.promise.getMassPrintURL
  service.getEPrintURL = runtimeMethods.promise.getEPrintURL
  service.getMailURL = runtimeMethods.promise.getMailURL

  return service
}
