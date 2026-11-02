export interface KakaoBusinessRequest {
  businessNumber: string
}
export interface KakaoTemplateRequest extends KakaoBusinessRequest {
  templateCode: string
}
export interface KakaoReceiptRequest extends KakaoBusinessRequest {
  receiptNumber: string
}
export interface KakaoRequestNumberRequest extends KakaoBusinessRequest {
  requestNumber: string
}
export interface KakaoReceiptRecipientRequest extends KakaoReceiptRequest {
  receiverPhoneNumber: string
}
export interface KakaoRequestNumberRecipientRequest extends KakaoRequestNumberRequest {
  receiverPhoneNumber: string
}
export interface KakaoButton {
  label: string
  typeCode: string
  firstLink?: string
  secondLink?: string
  browserTarget?: string
  phoneNumber?: string
}
export interface KakaoCoupon {
  title: string
  description: string
  mobileUrl?: string
  desktopUrl?: string
  androidUrl?: string
  iosUrl?: string
}
export interface KakaoCommerce {
  title: string
  regularPrice: number
  discountPrice?: number
  discountType?: 'R' | 'F'
  discount?: number
}
export interface KakaoListItem {
  title: string
  imageUrl: string
  mobileUrl: string
  desktopUrl?: string
  androidUrl?: string
  iosUrl?: string
}
export interface KakaoCarouselItem {
  heading?: string
  messageBody?: string
  imageUrl: string
  imageLink?: string
  buttons?: KakaoButton[]
  coupon?: KakaoCoupon
  commerce?: KakaoCommerce
  additionalContent?: string
}
export interface KakaoCarouselHead {
  heading: string
  messageBody: string
  imageUrl: string
  mobileUrl?: string
  desktopUrl?: string
  androidUrl?: string
  iosUrl?: string
}
export interface KakaoCarouselTail {
  mobileUrl: string
  desktopUrl?: string
  androidUrl?: string
  iosUrl?: string
}
export interface KakaoCarouselVariables {
  content?: Record<string, string>
  buttons?: Record<string, string>
  coupon?: Record<string, string>
  commerce?: Record<string, string>
}
export interface KakaoTemplateVariables extends KakaoCarouselVariables {
  carousel?: KakaoCarouselVariables[]
}
/** Visual content shared by send inputs, templates, and delivery results. */
export interface KakaoContent {
  heading?: string
  messageBody?: string
  imageUrl?: string
  imageLink?: string
  listItems?: KakaoListItem[]
  commerce?: KakaoCommerce
  carouselHead?: KakaoCarouselHead
  carouselItems?: KakaoCarouselItem[]
  carouselTail?: KakaoCarouselTail
  buttons?: KakaoButton[]
  coupon?: KakaoCoupon
  additionalContent?: string
  adultOnly?: boolean
}
export interface KakaoMessageContent extends KakaoContent {
  templateVariables?: KakaoTemplateVariables
  fallbackSubject?: string
  fallbackBody?: string
}
export interface KakaoRecipient extends KakaoMessageContent {
  receiverPhoneNumber: string
  receiverName?: string
  referenceKey?: string
  emphasizedTitle?: string
}
export interface KakaoNotificationRequest extends KakaoBusinessRequest {
  requestNumber?: string
  templateCode: string
  senderPhoneNumber?: string
  fallbackType?: 'C' | 'A'
  reserveDateTime?: string
}
export interface SendNotificationMessageRequest extends KakaoNotificationRequest, KakaoRecipient {
  messageBody: string
}
export interface SendNotificationMessagesRequest extends KakaoNotificationRequest {
  recipients: KakaoRecipient[]
  buttons?: KakaoButton[]
}
export interface SendIdenticalNotificationMessagesRequest extends SendNotificationMessagesRequest {
  messageBody: string
  fallbackSubject?: string
  fallbackBody?: string
  emphasizedTitle?: string
}
export type KakaoFriendRecipient = Pick<
  KakaoRecipient,
  'receiverPhoneNumber' | 'receiverName' | 'referenceKey' | 'messageBody' | 'fallbackSubject' | 'fallbackBody' | 'buttons'
>
export interface KakaoFriendMessageRecipient extends KakaoFriendRecipient {
  messageBody: string
}
/** Legacy friendtalk transport; delivery availability is determined by Popbill. */
export interface KakaoFriendRequest extends KakaoBusinessRequest {
  requestNumber?: string
  channelSearchId: string
  senderPhoneNumber?: string
  fallbackType?: 'C' | 'A'
  reserveDateTime?: string
  advertising?: boolean
}
export interface SendFriendTextMessageRequest extends KakaoFriendRequest, KakaoFriendMessageRecipient {}
export interface SendFriendTextMessagesRequest extends KakaoFriendRequest {
  recipients: KakaoFriendMessageRecipient[]
  buttons?: KakaoButton[]
}
export interface SendIdenticalFriendTextMessagesRequest extends KakaoFriendRequest {
  messageBody: string
  fallbackSubject?: string
  fallbackBody?: string
  recipients: KakaoFriendRecipient[]
  buttons?: KakaoButton[]
}
export interface KakaoFriendImage {
  /** Local image uploaded as the FMS multipart file. */
  filePath: string
  /** Destination opened when the recipient selects the image. */
  imageLink?: string
}
export interface SendFriendImageMessageRequest extends SendFriendTextMessageRequest, KakaoFriendImage {}
export interface SendFriendImageMessagesRequest extends SendFriendTextMessagesRequest, KakaoFriendImage {}
export interface SendIdenticalFriendImageMessagesRequest extends SendIdenticalFriendTextMessagesRequest, KakaoFriendImage {}
/** I/O/N/M follows the HTTP reference; business eligibility remains a server decision. */
export type KakaoBrandTarget = 'I' | 'O' | 'N' | 'M' | (string & {})
export interface SendBrandMessageRequest extends KakaoBusinessRequest, KakaoMessageContent {
  requestNumber?: string
  channelSearchId?: string
  templateCode?: string
  target: KakaoBrandTarget
  senderPhoneNumber?: string
  recipients: KakaoRecipient[]
  unsubscribePhoneNumber?: string
  fallbackEnabled?: boolean
  fallbackUnsubscribePhoneNumber?: string
  reserveDateTime?: string
}
export interface SendBrandChannelMessagesRequest extends SendBrandMessageRequest {
  channelSearchId: string
}
export interface SendBrandTemplateMessagesRequest extends SendBrandMessageRequest {
  templateCode: string
}
export interface KakaoImagePathRequest extends KakaoBusinessRequest {
  filePath: string
}
export interface KakaoImagePathsRequest extends KakaoBusinessRequest {
  filePaths: string[]
}
export interface KakaoBinaryFile {
  fileName: string
  fileData: Buffer
}
export interface KakaoImageBinaryRequest extends KakaoBusinessRequest, KakaoBinaryFile {}
export interface KakaoImagesBinaryRequest extends KakaoBusinessRequest {
  files: KakaoBinaryFile[]
}
export interface SearchKakaoMessagesRequest extends KakaoBusinessRequest {
  startDate: string
  endDate: string
  stateCodes?: string[]
  messageTypes?: string[]
  reservedOnly?: boolean
  senderOnly?: boolean
  channelSearchId?: string
  contentTypeCodes?: string[]
  queryText?: string
  sortOrder?: 'D' | 'A'
  pageNumber?: number
  pageSize?: number
}
export interface KakaoChargeRequest extends KakaoBusinessRequest {
  messageType: string
}
