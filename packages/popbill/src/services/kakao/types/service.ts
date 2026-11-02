import type * as Input from './document'
import type * as Output from './response'
export interface KakaoService {
  /** Compat: `getPlusFriendMgtURL` */
  getBusinessChannelManagementURL(request: Input.KakaoBusinessRequest): Promise<Output.KakaoAccessUrl>
  /** Compat: `listPlusFriendID` */
  listBusinessChannels(request: Input.KakaoBusinessRequest): Promise<Output.KakaoBusinessChannel[]>
  /** Compat: `getSenderNumberMgtURL` */
  getSenderNumberManagementURL(request: Input.KakaoBusinessRequest): Promise<Output.KakaoAccessUrl>
  /** Compat: `getSenderNumberList` */
  listSenderNumbers(request: Input.KakaoBusinessRequest): Promise<Output.KakaoSenderNumber[]>
  /** Compat: `checkSenderNumber` */
  checkSenderNumberRegistration(request: Input.KakaoBusinessRequest & { senderPhoneNumber: string }): Promise<Output.KakaoOperationResult>
  /** Compat: `getATSTemplateMgtURL` */
  getNotificationTemplateManagementURL(request: Input.KakaoBusinessRequest): Promise<Output.KakaoAccessUrl>
  /** Compat: `getATSTemplate` */
  getNotificationTemplate(request: Input.KakaoTemplateRequest): Promise<Output.KakaoNotificationTemplate>
  /** Compat: `listATSTemplate` */
  listNotificationTemplates(request: Input.KakaoBusinessRequest): Promise<Output.KakaoNotificationTemplate[]>
  /** Compat: `getBMSTemplateMgtURL` */
  getBrandTemplateManagementURL(request: Input.KakaoBusinessRequest): Promise<Output.KakaoAccessUrl>
  /** Compat: `getBMSTemplate` */
  getBrandTemplate(request: Input.KakaoTemplateRequest): Promise<Output.KakaoBrandTemplate>
  /** Compat: `listBMSTemplate` */
  listBrandTemplates(request: Input.KakaoBusinessRequest): Promise<Output.KakaoBrandTemplate[]>
  /** Compat: `uploadImage` */
  uploadBrandImageFromPath(request: Input.KakaoImagePathRequest): Promise<Output.KakaoImage>
  /** Compat: `uploadImageBinary` */
  uploadBrandImageFromBinary(request: Input.KakaoImageBinaryRequest): Promise<Output.KakaoImage>
  /** Compat: `uploadWideImage` */
  uploadBrandWideImageFromPath(request: Input.KakaoImagePathRequest): Promise<Output.KakaoImage>
  /** Compat: `uploadWideImageBinary` */
  uploadBrandWideImageFromBinary(request: Input.KakaoImageBinaryRequest): Promise<Output.KakaoImage>
  /** Compat: `uploadWideListMainImage` */
  uploadBrandWideListMainImageFromPath(request: Input.KakaoImagePathRequest): Promise<Output.KakaoImage>
  /** Compat: `uploadWideListMainImageBinary` */
  uploadBrandWideListMainImageFromBinary(request: Input.KakaoImageBinaryRequest): Promise<Output.KakaoImage>
  /** Compat: `uploadWideListImage` */
  uploadBrandWideListImageFromPath(request: Input.KakaoImagePathsRequest): Promise<Output.KakaoImage[]>
  /** Compat: `uploadWideListImageBinary` */
  uploadBrandWideListImageFromBinary(request: Input.KakaoImagesBinaryRequest): Promise<Output.KakaoImage[]>
  /** Compat: `uploadCarouselFeedImage` */
  uploadBrandCarouselFeedImageFromPath(request: Input.KakaoImagePathsRequest): Promise<Output.KakaoImage[]>
  /** Compat: `uploadCarouselFeedImageBinary` */
  uploadBrandCarouselFeedImageFromBinary(request: Input.KakaoImagesBinaryRequest): Promise<Output.KakaoImage[]>
  /** Compat: `uploadCommerceImage` */
  uploadBrandCommerceImageFromPath(request: Input.KakaoImagePathRequest): Promise<Output.KakaoImage>
  /** Compat: `uploadCommerceImageBinary` */
  uploadBrandCommerceImageFromBinary(request: Input.KakaoImageBinaryRequest): Promise<Output.KakaoImage>
  /** Compat: `uploadCarouselCommerceImage` */
  uploadBrandCarouselCommerceImageFromPath(request: Input.KakaoImagePathsRequest): Promise<Output.KakaoImage[]>
  /** Compat: `uploadCarouselCommerceImageBinary` */
  uploadBrandCarouselCommerceImageFromBinary(request: Input.KakaoImagesBinaryRequest): Promise<Output.KakaoImage[]>
  /** Compat: `sendATS_same` */
  sendNotificationMessage(request: Input.SendNotificationMessageRequest): Promise<Output.KakaoReceipt>
  /** Compat: `sendATS_multi` */
  sendNotificationMessages(request: Input.SendNotificationMessagesRequest): Promise<Output.KakaoReceipt>
  /** Compat: `sendATS_same` */
  sendIdenticalNotificationMessages(request: Input.SendIdenticalNotificationMessagesRequest): Promise<Output.KakaoReceipt>
  /** Compat: `sendBMSText` */
  sendBrandTextMessages(request: Input.SendBrandChannelMessagesRequest): Promise<Output.KakaoReceipt>
  /** Compat: `sendBMSImage` */
  sendBrandImageMessages(request: Input.SendBrandChannelMessagesRequest): Promise<Output.KakaoReceipt>
  /** Compat: `sendBMSWideImage` */
  sendBrandWideImageMessages(request: Input.SendBrandChannelMessagesRequest): Promise<Output.KakaoReceipt>
  /** Compat: `sendBMSWideList` */
  sendBrandWideListMessages(request: Input.SendBrandChannelMessagesRequest): Promise<Output.KakaoReceipt>
  /** Compat: `sendBMSCarouselFeed` */
  sendBrandCarouselFeedMessages(request: Input.SendBrandChannelMessagesRequest): Promise<Output.KakaoReceipt>
  /** Compat: `sendBMSCommerce` */
  sendBrandCommerceMessages(request: Input.SendBrandChannelMessagesRequest): Promise<Output.KakaoReceipt>
  /** Compat: `sendBMSCarouselCommerce` */
  sendBrandCarouselCommerceMessages(request: Input.SendBrandChannelMessagesRequest): Promise<Output.KakaoReceipt>
  /** Compat: `sendBMSVariable` */
  sendBrandTemplateMessages(request: Input.SendBrandTemplateMessagesRequest): Promise<Output.KakaoReceipt>
  /** Compat: `cancelReserve` */
  cancelReservedMessagesByReceiptNumber(request: Input.KakaoReceiptRequest): Promise<Output.KakaoOperationResult>
  /** Compat: `cancelReserveRN` */
  cancelReservedMessagesByRequestNumber(request: Input.KakaoRequestNumberRequest): Promise<Output.KakaoOperationResult>
  /** Compat: `cancelReservebyRCV` */
  cancelReservedRecipientByReceiptNumber(request: Input.KakaoReceiptRecipientRequest): Promise<Output.KakaoOperationResult>
  /** Compat: `cancelReserveRNbyRCV` */
  cancelReservedRecipientByRequestNumber(request: Input.KakaoRequestNumberRecipientRequest): Promise<Output.KakaoOperationResult>
  /** Compat: `getMessages` */
  getMessagesByReceiptNumber(request: Input.KakaoReceiptRequest): Promise<Output.KakaoMessages>
  /** Compat: `getMessagesRN` */
  getMessagesByRequestNumber(request: Input.KakaoRequestNumberRequest): Promise<Output.KakaoMessages>
  /** Compat: `search` */
  searchMessages(request: Input.SearchKakaoMessagesRequest): Promise<Output.KakaoSearchResult>
  /** Compat: `getSentListURL` */
  getMessageHistoryURL(request: Input.KakaoBusinessRequest): Promise<Output.KakaoAccessUrl>
  /** Compat: `getUnitCost` */
  getMessageUnitCost(request: Input.KakaoChargeRequest): Promise<Output.KakaoUnitCost>
  /** Compat: `getChargeInfo` */
  getMessageChargeInfo(request: Input.KakaoChargeRequest): Promise<Output.KakaoChargeInfo>
}
