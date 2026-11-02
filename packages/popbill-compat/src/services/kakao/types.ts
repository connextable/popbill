import type * as Spec from '@connextable/popbill-spec'
export interface KakaoBinaryFile {
  fileName: string
  fileData: Buffer
}
export type KakaoReceiver = Spec.KakaoLegacyReceiverApiModel
export type KakaoButtons = Spec.KakaoButtonApiModel | Spec.KakaoButtonApiModel[]
export type KakaoReceivers = KakaoReceiver | KakaoReceiver[]
export type KakaoBrandMessage = Spec.KakaoBrandMessageApiModel
export type KakaoFallbackType = 'C' | 'A' | ''

export interface KakaoMethodArguments {
  getPlusFriendMgtURL: [corpNum: string, userId?: string]
  listPlusFriendID: [corpNum: string, userId?: string]
  getSenderNumberMgtURL: [corpNum: string, userId?: string]
  getSenderNumberList: [corpNum: string, userId?: string]
  checkSenderNumber: [corpNum: string, senderNumber: string, userId?: string]
  getATSTemplateMgtURL: [corpNum: string, userId?: string]
  getATSTemplate: [corpNum: string, templateCode: string, userId?: string]
  listATSTemplate: [corpNum: string, userId?: string]
  getBMSTemplateMgtURL: [corpNum: string, userId?: string]
  getBMSTemplate: [corpNum: string, templateCode: string, userId?: string]
  listBMSTemplate: [corpNum: string, userId?: string]
  uploadImage: [corpNum: string, filePath: string, userId?: string]
  uploadImageBinary: [corpNum: string, file: KakaoBinaryFile, userId?: string]
  uploadWideImage: [corpNum: string, filePath: string, userId?: string]
  uploadWideImageBinary: [corpNum: string, file: KakaoBinaryFile, userId?: string]
  uploadWideListMainImage: [corpNum: string, filePath: string, userId?: string]
  uploadWideListMainImageBinary: [corpNum: string, file: KakaoBinaryFile, userId?: string]
  uploadWideListImage: [corpNum: string, filePaths: string | string[], userId?: string]
  uploadWideListImageBinary: [corpNum: string, files: KakaoBinaryFile | KakaoBinaryFile[], userId?: string]
  uploadCarouselFeedImage: [corpNum: string, filePaths: string | string[], userId?: string]
  uploadCarouselFeedImageBinary: [corpNum: string, files: KakaoBinaryFile | KakaoBinaryFile[], userId?: string]
  uploadCommerceImage: [corpNum: string, filePath: string, userId?: string]
  uploadCommerceImageBinary: [corpNum: string, file: KakaoBinaryFile, userId?: string]
  uploadCarouselCommerceImage: [corpNum: string, filePaths: string | string[], userId?: string]
  uploadCarouselCommerceImageBinary: [corpNum: string, files: KakaoBinaryFile | KakaoBinaryFile[], userId?: string]
  sendATS_one: [
    corpNum: string,
    templateCode: string,
    sender: string | undefined,
    content: string,
    altSubject: string | undefined,
    altContent: string | undefined,
    altSendType: KakaoFallbackType | undefined,
    sendDateTime: string | undefined,
    receiver: string,
    receiverName: string | undefined,
    userId: string | undefined,
    requestNum: string | undefined,
    buttons: KakaoButtons | undefined,
    emphasizeTitle?: string,
  ]
  sendATS_multi: [
    corpNum: string,
    templateCode: string,
    sender: string | undefined,
    altSendType: KakaoFallbackType | undefined,
    sendDateTime: string | undefined,
    receivers: KakaoReceivers,
    userId?: string,
    requestNum?: string,
    buttons?: KakaoButtons,
  ]
  sendATS_same: [
    corpNum: string,
    templateCode: string,
    sender: string | undefined,
    content: string | undefined,
    altSubject: string | undefined,
    altContent: string | undefined,
    altSendType: KakaoFallbackType | undefined,
    sendDateTime: string | undefined,
    receivers: KakaoReceivers,
    userId: string | undefined,
    requestNum: string | undefined,
    buttons: KakaoButtons | undefined,
    emphasizeTitle?: string,
  ]
  /** Legacy friendtalk transport retained; absent from the current public API reference. */
  sendFTS_one: [
    corpNum: string,
    plusFriendId: string,
    sender: string | undefined,
    content: string,
    altSubject: string | undefined,
    altContent: string | undefined,
    altSendType: KakaoFallbackType | undefined,
    sendDateTime: string | undefined,
    receiver: string,
    receiverName: string | undefined,
    advertising: boolean | undefined,
    buttons: KakaoButtons | undefined,
    userId: string | undefined,
    requestNum: string | undefined,
  ]
  sendFTS_multi: [
    corpNum: string,
    plusFriendId: string,
    sender: string | undefined,
    altSendType: KakaoFallbackType | undefined,
    sendDateTime: string | undefined,
    advertising: boolean | undefined,
    receivers: KakaoReceivers,
    buttons: KakaoButtons | undefined,
    userId?: string,
    requestNum?: string,
  ]
  sendFTS_same: [
    corpNum: string,
    plusFriendId: string,
    sender: string | undefined,
    content: string | undefined,
    altSubject: string | undefined,
    altContent: string | undefined,
    altSendType: KakaoFallbackType | undefined,
    sendDateTime: string | undefined,
    advertising: boolean | undefined,
    receivers: KakaoReceivers,
    buttons: KakaoButtons | undefined,
    userId: string | undefined,
    requestNum: string | undefined,
  ]
  sendFMS_one: [
    corpNum: string,
    plusFriendId: string,
    sender: string | undefined,
    content: string,
    altSubject: string | undefined,
    altContent: string | undefined,
    altSendType: KakaoFallbackType | undefined,
    sendDateTime: string | undefined,
    receiver: string,
    receiverName: string | undefined,
    advertising: boolean | undefined,
    imageUrl: string | undefined,
    filePath: string,
    buttons: KakaoButtons | undefined,
    userId: string | undefined,
    requestNum: string | undefined,
  ]
  sendFMS_multi: [
    corpNum: string,
    plusFriendId: string,
    sender: string | undefined,
    altSendType: KakaoFallbackType | undefined,
    sendDateTime: string | undefined,
    advertising: boolean | undefined,
    imageUrl: string | undefined,
    filePath: string,
    receivers: KakaoReceivers,
    buttons: KakaoButtons | undefined,
    userId?: string,
    requestNum?: string,
  ]
  sendFMS_same: [
    corpNum: string,
    plusFriendId: string,
    sender: string | undefined,
    content: string | undefined,
    altSubject: string | undefined,
    altContent: string | undefined,
    altSendType: KakaoFallbackType | undefined,
    sendDateTime: string | undefined,
    advertising: boolean | undefined,
    imageUrl: string | undefined,
    filePath: string,
    receivers: KakaoReceivers,
    buttons: KakaoButtons | undefined,
    userId: string | undefined,
    requestNum: string | undefined,
  ]
  sendBMSText: [corpNum: string, message: KakaoBrandMessage, userId?: string]
  sendBMSImage: [corpNum: string, message: KakaoBrandMessage, userId?: string]
  sendBMSWideImage: [corpNum: string, message: KakaoBrandMessage, userId?: string]
  sendBMSWideList: [corpNum: string, message: KakaoBrandMessage, userId?: string]
  sendBMSCarouselFeed: [corpNum: string, message: KakaoBrandMessage, userId?: string]
  sendBMSCommerce: [corpNum: string, message: KakaoBrandMessage, userId?: string]
  sendBMSCarouselCommerce: [corpNum: string, message: KakaoBrandMessage, userId?: string]
  sendBMSVariable: [corpNum: string, message: KakaoBrandMessage, userId?: string]
  cancelReserve: [corpNum: string, receiptNum: string, userId?: string]
  cancelReserveRN: [corpNum: string, requestNum: string, userId?: string]
  cancelReservebyRCV: [corpNum: string, receiptNum: string, receiveNum: string, userId?: string]
  cancelReserveRNbyRCV: [corpNum: string, requestNum: string, receiveNum: string, userId?: string]
  getMessages: [corpNum: string, receiptNum: string, userId?: string]
  getMessagesRN: [corpNum: string, requestNum: string, userId?: string]
  search: [
    corpNum: string,
    startDate: string,
    endDate: string,
    states: string[] | undefined,
    items: string[] | undefined,
    reserve: string | undefined,
    senderOnly: boolean | undefined,
    page: number | undefined,
    perPage: number | undefined,
    order: string | undefined,
    query: string | undefined,
    userId?: string,
    plusFriendId?: string,
    contentTypes?: string[],
  ]
  getURL: [corpNum: string, togo: string, userId?: string]
  getSentListURL: [corpNum: string, userId?: string]
  getUnitCost: [corpNum: string, kakaoType: string]
  getChargeInfo: [corpNum: string, kakaoType: string, userId?: string]
}
export interface KakaoMethodResults {
  getPlusFriendMgtURL: string
  listPlusFriendID: Spec.KakaoBusinessChannelApiModel[]
  getSenderNumberMgtURL: string
  getSenderNumberList: Spec.KakaoSenderNumberApiModel[]
  checkSenderNumber: Spec.KakaoOperationApiResponse
  getATSTemplateMgtURL: string
  getATSTemplate: Spec.KakaoNotificationTemplateApiModel
  listATSTemplate: Spec.KakaoNotificationTemplateApiModel[]
  getBMSTemplateMgtURL: string
  getBMSTemplate: Spec.KakaoBrandTemplateApiModel
  listBMSTemplate: Spec.KakaoBrandTemplateApiModel[]
  uploadImage: Spec.KakaoImageApiModel
  uploadImageBinary: Spec.KakaoImageApiModel
  uploadWideImage: Spec.KakaoImageApiModel
  uploadWideImageBinary: Spec.KakaoImageApiModel
  uploadWideListMainImage: Spec.KakaoImageApiModel
  uploadWideListMainImageBinary: Spec.KakaoImageApiModel
  uploadWideListImage: Spec.KakaoImagesApiModel
  uploadWideListImageBinary: Spec.KakaoImagesApiModel
  uploadCarouselFeedImage: Spec.KakaoImagesApiModel
  uploadCarouselFeedImageBinary: Spec.KakaoImagesApiModel
  uploadCommerceImage: Spec.KakaoImageApiModel
  uploadCommerceImageBinary: Spec.KakaoImageApiModel
  uploadCarouselCommerceImage: Spec.KakaoImagesApiModel
  uploadCarouselCommerceImageBinary: Spec.KakaoImagesApiModel
  sendATS_one: string
  sendATS_multi: string
  sendATS_same: string
  sendFTS_one: string
  sendFTS_multi: string
  sendFTS_same: string
  sendFMS_one: string
  sendFMS_multi: string
  sendFMS_same: string
  sendBMSText: string
  sendBMSImage: string
  sendBMSWideImage: string
  sendBMSWideList: string
  sendBMSCarouselFeed: string
  sendBMSCommerce: string
  sendBMSCarouselCommerce: string
  sendBMSVariable: string
  cancelReserve: Spec.KakaoOperationApiResponse
  cancelReserveRN: Spec.KakaoOperationApiResponse
  cancelReservebyRCV: Spec.KakaoOperationApiResponse
  cancelReserveRNbyRCV: Spec.KakaoOperationApiResponse
  getMessages: Spec.KakaoMessagesApiModel
  getMessagesRN: Spec.KakaoMessagesApiModel
  search: Spec.KakaoSearchApiModel
  getURL: string
  getSentListURL: string
  getUnitCost: string
  getChargeInfo: Spec.KakaoChargeInfoApiModel
}
export type KakaoCanonicalPromiseService = { [K in keyof KakaoMethodArguments]: (...args: KakaoMethodArguments[K]) => Promise<KakaoMethodResults[K]> }
type Success<T> = (response: T) => void
type Failure = (error: unknown) => void
type DefinedTail<A extends unknown[]> = A extends [...infer P, infer Last] ? [...P, Exclude<Last, undefined>] : A
type Callback<A extends unknown[], R> = {
  (...args: A): void
  (...args: [...DefinedTail<Required<A>>, success: Success<R>, error?: Failure]): void
  (...args: [...A, success: Success<R> | undefined, error: Failure | undefined]): void
} & (A extends Required<A> ? unknown : A extends [...infer P, unknown?] ? Callback<P, R> : unknown)
/** Legacy callback overloads retain their positional arguments, including omitted UserID. */
type SimpleCallback<A extends unknown[], R> = Callback<A, R>
type AtsOneShort = [
  corpNum: string,
  template: string,
  sender: string | undefined,
  content: string,
  altContent: string | undefined,
  altType: KakaoFallbackType | undefined,
  sendAt: string | undefined,
  receiver: string,
  receiverName: string | undefined,
  userId?: string,
  requestNum?: string,
  buttons?: KakaoButtons,
]
type AtsSameShort = [
  corpNum: string,
  template: string,
  sender: string | undefined,
  content: string | undefined,
  altContent: string | undefined,
  altType: KakaoFallbackType | undefined,
  sendAt: string | undefined,
  receivers: KakaoReceivers,
  userId?: string,
  requestNum?: string,
  buttons?: KakaoButtons,
]
type FriendOneShort = [
  corpNum: string,
  channel: string,
  sender: string | undefined,
  content: string,
  altContent: string | undefined,
  altType: KakaoFallbackType | undefined,
  sendAt: string | undefined,
  receiver: string,
  receiverName: string | undefined,
  advertising: boolean | undefined,
  buttons: KakaoButtons | undefined,
  userId?: string,
  requestNum?: string,
]
type FriendSameShort = [
  corpNum: string,
  channel: string,
  sender: string | undefined,
  content: string | undefined,
  altContent: string | undefined,
  altType: KakaoFallbackType | undefined,
  sendAt: string | undefined,
  advertising: boolean | undefined,
  receivers: KakaoReceivers,
  buttons: KakaoButtons | undefined,
  userId?: string,
  requestNum?: string,
]
type ImageOneShort = [
  corpNum: string,
  channel: string,
  sender: string | undefined,
  content: string,
  altContent: string | undefined,
  altType: KakaoFallbackType | undefined,
  sendAt: string | undefined,
  receiver: string,
  receiverName: string | undefined,
  advertising: boolean | undefined,
  imageUrl: string | undefined,
  filePath: string,
  buttons: KakaoButtons | undefined,
  userId?: string,
]
type ImageSameShort = [
  corpNum: string,
  channel: string,
  sender: string | undefined,
  content: string | undefined,
  altContent: string | undefined,
  altType: KakaoFallbackType | undefined,
  sendAt: string | undefined,
  advertising: boolean | undefined,
  imageUrl: string | undefined,
  filePath: string,
  receivers: KakaoReceivers,
  buttons: KakaoButtons | undefined,
  userId?: string,
  requestNum?: string,
]
type LegacySendingCallbacks = {
  sendATS_one: Callback<AtsOneShort, string>
  sendATS_same: Callback<AtsSameShort, string>
  sendFTS_one: Callback<FriendOneShort, string>
  sendFTS_same: Callback<FriendSameShort, string>
  sendFMS_one: Callback<ImageOneShort, string>
  sendFMS_same: Callback<ImageSameShort, string>
}
export type KakaoPromiseService = KakaoCanonicalPromiseService & {
  sendATS_one(...args: AtsOneShort): Promise<string>
  sendATS_same(...args: AtsSameShort): Promise<string>
  sendFTS_one(...args: FriendOneShort): Promise<string>
  sendFTS_same(...args: FriendSameShort): Promise<string>
  sendFMS_one(...args: ImageOneShort): Promise<string>
  sendFMS_same(...args: ImageSameShort): Promise<string>
}
export type KakaoCallbackService = {
  [K in keyof KakaoMethodArguments]: SimpleCallback<KakaoMethodArguments[K], KakaoMethodResults[K]>
} & LegacySendingCallbacks
