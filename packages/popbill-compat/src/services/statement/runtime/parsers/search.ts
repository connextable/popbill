export function parseSearchOptions(options: (string | number | undefined)[]): {
  qString: string | number | undefined
  order: string | number | undefined
  page: string | number | undefined
  perPage: string | number | undefined
  userId: string | number | undefined
} {
  // Full form has QString before string Order; short form has
  // optional numeric Page there. If full-form Order is undefined, callers
  // retain all five options through userId; shorter ambiguous calls use the short form.
  const short = options.length < 5 && typeof options[1] !== 'string'
  const [qString, order, page, perPage, userId] = short ? ['', ...options] : options
  return { qString, order, page, perPage, userId }
}
