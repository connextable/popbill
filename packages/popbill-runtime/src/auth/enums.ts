import { JusoLinkAuthScopes, PopbillAuthScopes } from '@/spec-constants'
import type * as Spec from '@connextable/popbill-spec'

export const LinkhubAuthScope = { ...PopbillAuthScopes, ...JusoLinkAuthScopes } as const
export type LinkhubAuthScope = Spec.LinkhubAuthScope
