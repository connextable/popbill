type Success<TResult> = (result: TResult) => void
type Failure = (error: unknown) => void
type DefinedTail<TArgs extends unknown[]> = TArgs extends [...infer Prefix, infer Last] ? [...Prefix, Exclude<Last, undefined>] : TArgs

interface FullCallback<TArgs extends unknown[], TResult> {
  (...args: TArgs): void
  (...args: [...TArgs, success: Success<TResult> | undefined, error: Failure | undefined]): void
}

/** A single callback after an undefined slot is the legacy error-only form. */
export type LookupCallback<TArgs extends unknown[], TResult> = FullCallback<TArgs, TResult> & {
  (...args: [...DefinedTail<TArgs>, success: Success<TResult> | undefined, error?: Failure]): void
}

export type LookupCallbackWithUserId<TArgs extends unknown[], TResult> = LookupCallback<TArgs, TResult> & {
  (...args: [...TArgs, userId: string | undefined]): void
  (...args: [...TArgs, userId: string, success: Success<TResult> | undefined, error?: Failure]): void
  (...args: [...TArgs, userId: string | undefined, success: Success<TResult> | undefined, error: Failure | undefined]): void
}
