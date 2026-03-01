import * as Spec from '@connextable/popbill-spec'

export const PopbillServiceIds = Spec.PopbillServiceIds

export const LinkhubServiceIds = Spec.LinkhubServiceIds

export type LinkhubServiceId = Spec.LinkhubServiceId

export const PopbillApiBaseUrls = Spec.PopbillApiBaseUrls

export const LinkhubApiBaseUrls = {
  PopbillTest: PopbillApiBaseUrls.Test,
  PopbillProduction: PopbillApiBaseUrls.Production,
  PopbillStaticTest: PopbillApiBaseUrls.StaticTest,
  PopbillStaticProduction: PopbillApiBaseUrls.StaticProduction,
  PopbillGaTest: PopbillApiBaseUrls.GaTest,
  PopbillGaProduction: PopbillApiBaseUrls.GaProduction,
  JusoLink: 'https://jusolink.linkhub.co.kr',
} as const

export const PopbillAuthBaseUrls = Spec.PopbillAuthBaseUrls

export const PopbillAcceptLanguages = Spec.PopbillAcceptLanguages

export const PopbillHttpMethodOverrides = Spec.PopbillHttpMethodOverrides

export const PopbillLinkhubApiVersion = Spec.PopbillLinkhubApiVersion

export const PopbillAuthScopes = Spec.PopbillAuthScopes
