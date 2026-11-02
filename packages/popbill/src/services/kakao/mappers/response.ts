import type * as Spec from '@connextable/popbill-spec'
import type * as Types from '../types'
export function operation(value: Spec.KakaoOperationApiResponse): Types.KakaoOperationResult {
  return { resultCode: value.code, resultMessage: value.message }
}
export function button(value: Spec.KakaoButtonApiModel): Types.KakaoButton {
  return { label: value.n, typeCode: value.t, firstLink: value.u1, secondLink: value.u2, browserTarget: value.tg, phoneNumber: value.telNum }
}
function coupon(value?: Spec.KakaoCouponApiModel): Types.KakaoCoupon | undefined {
  return (
    value && {
      title: value.title,
      description: value.description,
      mobileUrl: value.linkMobile,
      desktopUrl: value.linkPc,
      androidUrl: value.linkAndroid,
      iosUrl: value.linkIos,
    }
  )
}
export function content(value: Partial<Spec.KakaoContentApiModel>): Types.KakaoContent {
  return {
    heading: value.header,
    messageBody: value.content,
    imageUrl: value.imageUrl,
    imageLink: value.imageLink,
    listItems: value.item?.map((item) => ({
      title: item.title,
      imageUrl: item.imageUrl,
      mobileUrl: item.linkMobile,
      desktopUrl: item.linkPc,
      androidUrl: item.linkAndroid,
      iosUrl: item.linkIos,
    })),
    commerce: value.commerce,
    carouselHead: value.head && {
      heading: value.head.header,
      messageBody: value.head.content,
      imageUrl: value.head.imageUrl,
      mobileUrl: value.head.linkMobile,
      desktopUrl: value.head.linkPc,
      androidUrl: value.head.linkAndroid,
      iosUrl: value.head.linkIos,
    },
    carouselItems: value.carousel?.map((item) => ({
      heading: item.header,
      messageBody: item.content,
      imageUrl: item.imageUrl,
      imageLink: item.imageLink,
      buttons: item.btns?.map(button),
      coupon: coupon(item.coupon),
      commerce: item.commerce,
      additionalContent: item.addContent,
    })),
    carouselTail: value.tail && {
      mobileUrl: value.tail.linkMobile,
      desktopUrl: value.tail.linkPc,
      androidUrl: value.tail.linkAndroid,
      iosUrl: value.tail.linkIos,
    },
    buttons: value.btns?.map(button),
    coupon: coupon(value.coupon),
    additionalContent: value.addContent,
    adultOnly: value.adultYN,
  }
}
export function channel(value: Spec.KakaoBusinessChannelApiModel): Types.KakaoBusinessChannel {
  return {
    channelSearchId: value.plusFriendID,
    channelName: value.plusFriendName,
    stateCode: value.state,
    brandMessagingStateCode: value.bmsState,
    registeredAt: value.regDT,
    stateChangedAt: value.stateDT,
    brandMessagingStateChangedAt: value.bmsStateDT,
  }
}
export function sender(value: Spec.KakaoSenderNumberApiModel): Types.KakaoSenderNumber {
  return { phoneNumber: value.number, representative: value.representYN, stateCode: value.state, memo: value.memo }
}
export function notificationTemplate(value: Spec.KakaoNotificationTemplateApiModel): Types.KakaoNotificationTemplate {
  return {
    channelSearchId: value.plusFriendID,
    templateCode: value.templateCode,
    templateName: value.templateName,
    messageBody: value.template,
    advertisingText: value.ads,
    appendix: value.appendix,
    buttons: value.btns?.map(button),
    secure: value.secureYN,
    emphasisType: value.emphasizeType,
    emphasizedTitle: value.emphasizeTitle,
    emphasizedSubtitle: value.emphasizeSubtitle,
    stateCode: value.state,
    stateChangedAt: value.stateDT,
  }
}
export function brandTemplate(value: Spec.KakaoBrandTemplateApiModel): Types.KakaoBrandTemplate {
  return {
    channelSearchId: value.plusFriendID,
    templateCode: value.templateCode,
    templateName: value.templateName,
    templateType: value.templateType,
    ...content(value),
    stateCode: value.state,
    stateChangedAt: value.stateDT,
  }
}
export function message(value: Spec.KakaoMessageApiModel): Types.KakaoMessage {
  return {
    receiptNumber: value.receiptNum,
    requestNumber: value.requestNum,
    referenceKey: value.interOPRefKey,
    channelSearchId: value.plusFriendID,
    templateCode: value.templateCode,
    messageType: value.type,
    contentTypeCode: value.contentType,
    senderPhoneNumber: value.sendNum,
    receiverPhoneNumber: value.receiveNum,
    receiverName: value.receiveName,
    ...content(value),
    subject: value.subject,
    emphasizedTitle: value.emphasizeTitle,
    stateCode: value.state,
    resultCode: value.result,
    receivedAt: value.receiptDT,
    reserveDateTime: value.reserveDT,
    sentAt: value.sendDT,
    resultAt: value.resultDT,
    fallbackSubject: value.altSubject,
    fallbackBody: value.altContent,
    fallbackContentTypeCode: value.altContentType,
    fallbackResultCode: value.altResult,
    fallbackSentAt: value.altSendDT,
    fallbackResultAt: value.altResultDT,
  }
}
export function messages(value: Spec.KakaoMessagesApiModel): Types.KakaoMessages {
  return {
    receiptNumber: value.receiptNum,
    requestNumber: value.requestNum,
    channelSearchId: value.plusFriendID,
    templateCode: value.templateCode,
    brandTemplateCode: value.bmsTemplateCode,
    contentTypeCode: value.contentType,
    target: value.targeting,
    senderPhoneNumber: value.sendNum,
    messageBody: value.content,
    buttons: value.btns?.map(button),
    messages: value.msgs.map(message),
    advertising: value.adsYN,
    unsubscribePhoneNumber: value.unsubscribeNo,
    sentCount: value.sendCnt,
    successCount: value.successCnt,
    failureCount: value.failCnt,
    canceledCount: value.cancelCnt,
    sendDateTime: value.sndDT,
    reserveDateTime: value.reserveDT,
    fallbackSubject: value.altSubject,
    fallbackBody: value.altContent,
    fallbackType: value.altSendType,
    fallbackUnsubscribePhoneNumber: value.altUnsubscribeNo,
    fallbackCount: value.altCnt,
  }
}
export function search(value: Spec.KakaoSearchApiModel): Types.KakaoSearchResult {
  return {
    operationResult: operation(value),
    pageNumber: value.pageNum,
    pageSize: value.perPage,
    pageCount: value.pageCount,
    totalCount: value.total,
    messages: value.list.map(message),
  }
}
export function image(value: Spec.KakaoImageApiModel): Types.KakaoImage {
  return { imageUrl: value.imageUrl, formField: value.formField }
}
