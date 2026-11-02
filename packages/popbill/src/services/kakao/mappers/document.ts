import type * as Spec from '@connextable/popbill-spec'
import type * as Types from '../types'
export function mapButton(value: Types.KakaoButton): Spec.KakaoButtonApiModel {
  return { n: value.label, t: value.typeCode, u1: value.firstLink, u2: value.secondLink, tg: value.browserTarget, telNum: value.phoneNumber }
}
export function mapCoupon(value?: Types.KakaoCoupon): Spec.KakaoCouponApiModel | undefined {
  return (
    value && {
      title: value.title,
      description: value.description,
      linkMobile: value.mobileUrl,
      linkPc: value.desktopUrl,
      linkAndroid: value.androidUrl,
      linkIos: value.iosUrl,
    }
  )
}
export function mapContent(value: Types.KakaoMessageContent) {
  return {
    header: value.heading,
    content: value.messageBody,
    imageUrl: value.imageUrl,
    imageLink: value.imageLink,
    item: value.listItems?.map((item) => ({
      title: item.title,
      imageUrl: item.imageUrl,
      linkMobile: item.mobileUrl,
      linkPc: item.desktopUrl,
      linkAndroid: item.androidUrl,
      linkIos: item.iosUrl,
    })),
    commerce: value.commerce,
    head: value.carouselHead && {
      header: value.carouselHead.heading,
      content: value.carouselHead.messageBody,
      imageUrl: value.carouselHead.imageUrl,
      linkMobile: value.carouselHead.mobileUrl,
      linkPc: value.carouselHead.desktopUrl,
      linkAndroid: value.carouselHead.androidUrl,
      linkIos: value.carouselHead.iosUrl,
    },
    carousel: value.carouselItems?.map((item) => ({
      header: item.heading,
      content: item.messageBody,
      imageUrl: item.imageUrl,
      imageLink: item.imageLink,
      btns: item.buttons?.map(mapButton),
      coupon: mapCoupon(item.coupon),
      commerce: item.commerce,
      addContent: item.additionalContent,
    })),
    tail: value.carouselTail && {
      linkMobile: value.carouselTail.mobileUrl,
      linkPc: value.carouselTail.desktopUrl,
      linkAndroid: value.carouselTail.androidUrl,
      linkIos: value.carouselTail.iosUrl,
    },
    btns: value.buttons?.map(mapButton),
    coupon: mapCoupon(value.coupon),
    addContent: value.additionalContent,
    contentVariable: value.templateVariables?.content,
    buttonVariable: value.templateVariables?.buttons,
    couponVariable: value.templateVariables?.coupon,
    commerceVariable: value.templateVariables?.commerce,
    carouselVariable: value.templateVariables?.carousel?.map((item) => ({
      contentVariable: item.content,
      buttonVariable: item.buttons,
      couponVariable: item.coupon,
      commerceVariable: item.commerce,
    })),
    adultYN: value.adultOnly,
    altSubject: value.fallbackSubject,
    altContent: value.fallbackBody,
  }
}
export function mapFriendReceiver(value: Types.KakaoFriendRecipient): Spec.KakaoLegacyReceiverApiModel {
  return {
    rcv: value.receiverPhoneNumber,
    rcvnm: value.receiverName,
    interOPRefKey: value.referenceKey,
    msg: value.messageBody,
    btns: value.buttons?.map(mapButton),
    altsjt: value.fallbackSubject,
    altmsg: value.fallbackBody,
  }
}
export function mapNotificationReceiver(value: Types.KakaoRecipient): Spec.KakaoLegacyReceiverApiModel {
  return { ...mapFriendReceiver(value), emphasizeTitle: value.emphasizedTitle }
}
export function mapBrandMessage(value: Types.SendBrandMessageRequest): Spec.KakaoBrandMessageApiModel {
  return {
    plusFriendID: value.channelSearchId,
    templateCode: value.templateCode,
    targeting: value.target,
    sendNum: value.senderPhoneNumber,
    receivers: value.recipients.map((receiver) => ({
      ...mapContent(receiver),
      receiveNum: receiver.receiverPhoneNumber,
      receiveName: receiver.receiverName,
      interOPRefKey: receiver.referenceKey,
    })),
    ...mapContent(value),
    unsubscribeNo: value.unsubscribePhoneNumber,
    altYN: value.fallbackEnabled,
    altUnsubscribeNo: value.fallbackUnsubscribePhoneNumber,
    requestNum: value.requestNumber,
    reserveDT: value.reserveDateTime,
  }
}
