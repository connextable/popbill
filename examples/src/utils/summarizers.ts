export function summarizeOperationResult(value: any): Record<string, unknown> {
  return pick(value, ['resultCode', 'resultMessage', 'confirmNumber'])
}

export function summarizeAccessUrl(value: any): Record<string, unknown> {
  return pick(value, ['accessUrl'])
}

export function summarizeInvoiceInfo(value: any): Record<string, unknown> {
  return pick(value, [
    'itemKey',
    'stateCode',
    'writeDate',
    'taxType',
    'supplyCostTotalAmount',
    'taxTotalAmount',
    'totalAmount',
    'supplierManagementKey',
  ])
}

export function summarizeDocumentOutput(value: any): Record<string, unknown> {
  const lineItems = Array.isArray(value?.lineItems) ? value.lineItems : []

  return {
    type: typeof value,
    supplierBusinessNumber: value?.supplier?.businessNumber ?? value?.supplier?.corpNum,
    supplierManagementKey: value?.supplier?.managementKey ?? value?.supplier?.mgtKey,
    lineItemCount: lineItems.length,
    lineItems: lineItems.slice(0, 5).map((lineItem: any) => ({
      lineNumber: lineItem?.lineNumber,
      itemName: lineItem?.itemName,
      supplyCostAmount: lineItem?.supplyCostAmount,
      taxAmount: lineItem?.taxAmount,
    })),
  }
}

export function summarizeKeyUsage(value: any): Record<string, unknown> {
  return pick(value, ['isInUse', 'invoiceDocumentKeyType', 'invoiceManagementKey'])
}

export function summarizeXmlOutput(value: any): Record<string, unknown> {
  return {
    operationResult: summarizeOperationResult(value?.operationResult),
    xmlLength: typeof value?.xmlContent === 'string' ? value.xmlContent.length : 0,
  }
}

export function summarizeSearchResult(value: any): Record<string, unknown> {
  return {
    operationResult: summarizeOperationResult(value?.operationResult),
    pageNumber: value?.pageNumber,
    pageSize: value?.pageSize,
    totalCount: value?.totalCount,
    invoiceSummaryCount: Array.isArray(value?.invoiceSummaries) ? value.invoiceSummaries.length : 0,
  }
}

export function summarizeArrayLength(value: unknown): Record<string, unknown> {
  if (!Array.isArray(value)) {
    return {
      isArray: false,
      valueType: typeof value,
    }
  }

  return {
    length: value.length,
    firstItem: value.length > 0 ? summarizeGenericObject(value[0]) : undefined,
  }
}

export function summarizeGenericObject(value: unknown): unknown {
  if (value === null || value === undefined) {
    return value
  }

  if (Array.isArray(value)) {
    return summarizeArrayLength(value)
  }

  if (typeof value === 'object') {
    const entries = Object.entries(value).slice(0, 8)
    return Object.fromEntries(entries)
  }

  return value
}

function pick(source: unknown, keys: string[]): Record<string, unknown> {
  if (!source || typeof source !== 'object') {
    return {}
  }

  const objectSource = source as Record<string, unknown>
  const target: Record<string, unknown> = {}
  for (const key of keys) {
    if (Object.prototype.hasOwnProperty.call(objectSource, key)) {
      target[key] = objectSource[key]
    }
  }

  return target
}
