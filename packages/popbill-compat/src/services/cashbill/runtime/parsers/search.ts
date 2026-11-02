type Filter = string[] | undefined
type Value = string | number | string[] | undefined

/** 레거시 11/12/13/14/15개 인자 형식을 전체 형식으로 정규화합니다. */
export function parseSearchOptions(options: Value[]): {
  tradeOpt?: Filter
  taxationType?: Filter
  qString?: string
  order?: string
  page?: number
  perPage?: number
  franchiseTaxRegID?: string
  userId?: string
} {
  // Seven common arguments precede these options. The two oldest overloads omit TradeOpt.
  const full =
    options.length === 4 ? [undefined, options[0], undefined, ...options.slice(1)] : options.length === 5 ? [undefined, ...options] : options
  return {
    tradeOpt: full[0] as Filter,
    taxationType: full[1] as Filter,
    qString: full[2] as string | undefined,
    order: full[3] as string | undefined,
    page: full[4] as number | undefined,
    perPage: full[5] as number | undefined,
    franchiseTaxRegID: full[6] as string | undefined,
    userId: full[7] as string | undefined,
  }
}
