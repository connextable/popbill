import type { KakaoBrandTargeting, KakaoMessageType } from './common'
/** Official Kakao wire button fields. */
export interface KakaoButtonApiModel {
  n: string
  t: string
  u1?: string
  u2?: string
  tg?: string
  telNum?: string
}
export interface KakaoCouponApiModel {
  title: string
  description: string
  linkMobile?: string
  linkPc?: string
  linkAndroid?: string
  linkIos?: string
}
export interface KakaoCommerceApiModel {
  title: string
  regularPrice: number
  discountPrice?: number
  discountType?: 'R' | 'F'
  discount?: number
}
export interface KakaoWideListItemApiModel {
  title: string
  imageUrl: string
  linkMobile: string
  linkPc?: string
  linkAndroid?: string
  linkIos?: string
}
export interface KakaoCarouselItemApiModel {
  header?: string
  content?: string
  imageUrl: string
  imageLink?: string
  btns?: KakaoButtonApiModel[]
  coupon?: KakaoCouponApiModel
  commerce?: KakaoCommerceApiModel
  addContent?: string
}
export interface KakaoCarouselHeadApiModel {
  header: string
  content: string
  imageUrl: string
  linkMobile?: string
  linkPc?: string
  linkAndroid?: string
  linkIos?: string
}
export interface KakaoCarouselTailApiModel {
  linkMobile: string
  linkPc?: string
  linkAndroid?: string
  linkIos?: string
}
export interface KakaoCarouselVariableApiModel {
  contentVariable?: Record<string, string>
  buttonVariable?: Record<string, string>
  couponVariable?: Record<string, string>
  commerceVariable?: Record<string, string>
}
export interface KakaoLegacyReceiverApiModel {
  rcv: string
  rcvnm?: string
  interOPRefKey?: string
  msg?: string
  emphasizeTitle?: string
  btns?: KakaoButtonApiModel[]
  altsjt?: string
  altmsg?: string
}
/** Shared visual content used by requests, templates, and delivery results. */
export interface KakaoContentApiModel {
  header?: string
  content?: string
  imageUrl?: string
  imageLink?: string
  item?: KakaoWideListItemApiModel[]
  commerce?: KakaoCommerceApiModel
  head?: KakaoCarouselHeadApiModel
  carousel?: KakaoCarouselItemApiModel[]
  tail?: KakaoCarouselTailApiModel
  btns?: KakaoButtonApiModel[]
  coupon?: KakaoCouponApiModel
  addContent?: string
  adultYN?: boolean
}
export interface KakaoBrandReceiverApiModel extends KakaoContentApiModel {
  receiveNum: string
  receiveName?: string
  interOPRefKey?: string
  contentVariable?: Record<string, string>
  buttonVariable?: Record<string, string>
  couponVariable?: Record<string, string>
  commerceVariable?: Record<string, string>
  carouselVariable?: KakaoCarouselVariableApiModel[]
  altSubject?: string
  altContent?: string
}
/** SDK BMS input; receivers becomes msgs in the HTTP body. */
export interface KakaoBrandMessageApiModel extends KakaoContentApiModel {
  plusFriendID?: string
  templateCode?: string
  targeting: KakaoBrandTargeting
  sendNum?: string
  receivers: KakaoBrandReceiverApiModel[]
  contentVariable?: Record<string, string>
  buttonVariable?: Record<string, string>
  couponVariable?: Record<string, string>
  commerceVariable?: Record<string, string>
  carouselVariable?: KakaoCarouselVariableApiModel[]
  unsubscribeNo?: string
  altYN?: boolean
  altSubject?: string
  altContent?: string
  altUnsubscribeNo?: string
  requestNum?: string
  reserveDT?: string
}
export type KakaoBrandMessageApiBody = Omit<KakaoBrandMessageApiModel, 'receivers'> & { msgs: KakaoBrandReceiverApiModel[] }
export interface KakaoNotificationApiBody {
  templateCode: string
  requestNum?: string
  snd?: string
  msgs: KakaoLegacyReceiverApiModel[]
  content?: string
  emphasizeTitle?: string
  btns?: KakaoButtonApiModel[]
  altSubject?: string
  altContent?: string
  altSendType?: string
  sndDT?: string
}
export interface KakaoFriendApiBody extends Omit<KakaoNotificationApiBody, 'templateCode'> {
  plusFriendID: string
  adsYN?: boolean
  imageURL?: string
}
export interface KakaoChargeInfoApiModel {
  unitCost: string
  chargeMethod: string
  rateSystem: string
}
export interface KakaoBusinessChannelApiModel {
  plusFriendID: string
  plusFriendName?: string
  state?: string
  bmsState?: number
  regDT?: string
  stateDT?: string
  bmsStateDT?: string
}
export interface KakaoSenderNumberApiModel {
  number: string
  representYN?: boolean
  state?: number
  memo?: string | null
}
export interface KakaoNotificationTemplateApiModel {
  plusFriendID?: string
  templateCode: string
  templateName?: string
  template?: string
  ads?: string
  appendix?: string
  btns?: KakaoButtonApiModel[]
  secureYN?: boolean
  emphasizeType?: string
  emphasizeTitle?: string
  emphasizeSubtitle?: string
  state?: string
  stateDT?: string
}
export interface KakaoBrandTemplateApiModel extends KakaoContentApiModel {
  plusFriendID?: string
  templateCode: string
  templateName?: string
  templateType?: string
  state?: number
  stateDT?: string
}
export interface KakaoMessageApiModel extends KakaoContentApiModel {
  receiptNum?: string
  requestNum?: string
  interOPRefKey?: string
  plusFriendID?: string
  templateCode?: string
  type?: KakaoMessageType
  contentType?: number | string
  sendNum?: string
  receiveNum?: string
  receiveName?: string
  subject?: string
  emphasizeTitle?: string
  state?: number
  result?: number
  receiptDT?: string
  reserveDT?: string
  sendDT?: string
  resultDT?: string
  altSubject?: string
  altContent?: string
  altContentType?: number
  altResult?: number | string
  altSendDT?: string
  altResultDT?: string
}
export interface KakaoMessagesApiModel {
  receiptNum?: string
  requestNum?: string
  plusFriendID?: string
  templateCode?: string
  bmsTemplateCode?: string
  contentType?: number | string
  targeting?: KakaoBrandTargeting
  sendNum?: string
  content?: string
  btns?: KakaoButtonApiModel[]
  msgs: KakaoMessageApiModel[]
  adsYN?: boolean
  unsubscribeNo?: string
  sendCnt?: string
  successCnt?: string
  failCnt?: string
  cancelCnt?: string
  sndDT?: string
  reserveDT?: string
  altSubject?: string
  altContent?: string
  altSendType?: string | null
  altUnsubscribeNo?: string
  altCnt?: string
}
export interface KakaoSearchApiModel {
  code: number
  message: string
  pageNum: number
  perPage: number
  pageCount: number
  total: number
  list: KakaoMessageApiModel[]
}
export interface KakaoImageApiModel {
  imageUrl: string
  formField?: string
  code?: number | string
  message?: string
}
export interface KakaoImagesApiModel {
  code: number
  message: string
  result: KakaoImageApiModel[]
}
export interface KakaoSearchApiQuery {
  SDate: string
  EDate: string
  State?: string
  Item?: string
  ReserveYN?: string
  /** HTTP boolean; legacy SDK encodes this flag as 0 or 1. */
  SenderOnly?: boolean | 0 | 1
  PlusFriendID?: string
  ContentType?: string
  QString?: string
  Order?: 'D' | 'A'
  Page?: number
  PerPage?: number
}
