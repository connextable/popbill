# 카카오톡

[문서 목록](../README.md) · [실행 예제](../../examples/src/kakao/README.md) · [API 레퍼런스](../sdk/popbill/kakao/index.md)

`client.services.kakao`에서 채널·템플릿을 관리하고 알림톡·브랜드 메시지·친구톡을 전송합니다. 아래 예제는 [modern SDK 설정](../../packages/popbill/README.md)을 마친 클라이언트를 사용합니다. 사업자번호·템플릿 코드·수신번호는 자신의 테스트 환경 값으로 바꿉니다.

## 알림톡 보내기

1. `getBusinessChannelManagementURL`로 채널을 등록합니다. `listBusinessChannels`로 등록 상태를 확인할 수 있습니다.
2. `getNotificationTemplateManagementURL`에서 템플릿을 등록하고 승인받습니다. 전송할 때는 승인된 템플릿의 변수를 치환한 본문을 사용합니다.
3. 대체문자를 사용할 경우 발신번호를 먼저 등록합니다. 전송 전에 `requestNumber`를 저장해 응답 유실에 대비합니다.

```ts
const receipt = await client.services.kakao.sendNotificationMessage({
  businessNumber: '1234567890',
  requestNumber: 'ORDER-NOTICE-001',
  templateCode: 'APPROVED-TEMPLATE-CODE',
  receiverPhoneNumber: '01012345678',
  referenceKey: 'ORDER-001',
  messageBody: '승인된 템플릿의 변수를 치환한 본문',
})
console.log(receipt.receiptNumber)
```

수신자마다 다른 본문은 `sendNotificationMessages`, 같은 본문을 여러 수신자에게 보내려면 `sendIdenticalNotificationMessages`를 사용합니다. 두 메서드는 `recipients` 배열을 받습니다. 강조표기는 `emphasizedTitle`, 전화걸기 버튼의 번호는 `phoneNumber`로 전달합니다.

## 브랜드 메시지 보내기

채널 등록 상태와 전송대상별 이용 조건, 수신동의·수신거부 번호 요건을 먼저 확인합니다. 일반 전송은 `channelSearchId`가 필수이며, 템플릿 전송은 `templateCode`가 필수입니다. 전송대상은 `target`으로 지정하고 이용 가능 여부는 서버가 판단합니다.

텍스트는 `sendBrandTextMessages`, 이미지형은 `sendBrandImageMessages`를 사용합니다. 와이드 이미지·와이드 리스트·캐러셀·커머스·템플릿형의 입력은 [전송 레퍼런스](../sdk/popbill/kakao/index.md#메시지-전송)에서 해당 메서드를 확인합니다.

이미지형은 전송 유형에 맞는 업로드 메서드를 먼저 호출합니다. 예를 들어 일반 이미지의 로컬 경로는 `uploadBrandImageFromPath`, 파일명과 `Buffer`는 `uploadBrandImageFromBinary`로 전달합니다. 반환된 `imageUrl`을 전송 입력에 사용합니다. 여러 이미지를 받는 업로드 메서드는 `{ imageUrl, formField }` 객체 배열을 반환하므로 파일과 필드의 대응을 유지합니다.

템플릿은 `getBrandTemplateManagementURL`에서 관리하고 `getBrandTemplate`으로 내용을 조회합니다. 커머스 할인은 [커머스 입력](../sdk/popbill/kakao/methods/send-brand-commerce-messages.md), 캐러셀 변수는 [템플릿 입력](../sdk/popbill/kakao/methods/send-brand-template-messages.md)을 확인합니다.

## 친구톡 보내기

친구톡은 공식 Node.js SDK 1.64.2에 남아 있는 요청 계약을 제공합니다. 현재 공개 API 목록에는 없으며, 실제 계정에서 전송 가능한지는 팝빌에 확인해야 합니다.

텍스트는 `sendFriendTextMessage`, 이미지는 `sendFriendImageMessage`를 사용합니다. 수신자마다 다른 본문과 같은 본문의 대량 전송도 제공합니다. 광고 여부는 `advertising`으로 지정합니다.

이미지형의 `filePath`는 업로드할 로컬 파일 경로입니다. 선택 입력인 `imageLink`는 수신자가 이미지를 눌렀을 때 이동할 URL이며, 이미지 파일을 대신하지 않습니다. 단건에서도 `referenceKey`를 저장하고 결과와 연결할 수 있습니다.

## 접수 이후 결과 확인과 예약 취소

접수번호는 요청 접수를 뜻합니다. 최종 전송 결과는 `getMessagesByReceiptNumber`로 확인합니다. 접수 응답을 받지 못했다면 저장한 요청번호로 `getMessagesByRequestNumber`를 호출한 뒤 재시도 여부를 결정합니다. SDK는 자동으로 결과를 폴링하거나 다시 전송하지 않습니다.

예약일시는 `reserveDateTime`에 `yyyyMMddHHmmss` 형식으로 전달합니다. 예약 전체 취소와 특정 수신자 취소를 각각 제공하며, 접수번호 또는 요청번호로 대상을 지정합니다. 정확한 입력은 [예약취소 레퍼런스](../sdk/popbill/kakao/index.md#예약취소)를 확인합니다.

`searchMessages`의 상태 필터를 생략하거나 빈 배열로 전달하면 전체 상태를 조회합니다. 응답의 상태·결과와 대체문자 결과는 새 코드가 추가될 수 있으므로 알려진 성공 코드만 명시적으로 판정합니다. 대체문자 결과의 숫자·문자열과 문자열의 선행 0은 보존합니다.

## 기존 코드 이전

compat의 ATS·FTS·FMS 위치 인자는 저장소 legacy 순서를 유지합니다. 선택 인자와 전체 서명은 [compat 레퍼런스](../sdk/popbill-compat/kakao/index.md)를 확인합니다. modern은 객체 인자를 사용하며 목적별 관리 URL을 제공합니다. 두 SDK의 범위와 의도적인 차이는 [지원 범위](../migration/service-coverage.md)에 정리했습니다.

공식 계약: [알림톡](https://developers.popbill.com/reference/kakaotalk/node/api/send), [브랜드 메시지](https://developers.popbill.com/api-reference/kakaotalk/api/send-bms), [전송결과](https://developers.popbill.com/reference/kakaotalk/node/api/info).
