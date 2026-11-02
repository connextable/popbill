# 카카오톡 지원 계약

[문서 목록](../README.md) · [실행 예제](../../examples/src/kakao/README.md)

기존 레포의 spec → compat → modern 구조를 따릅니다.
compat는 저장소 legacy와 공식 Node.js SDK 1.64.2의 브랜드 메시지 API를 포함합니다.
modern은 알림톡·친구톡·브랜드 메시지·채널·템플릿·전송결과·발신번호·과금 기능을 제공합니다. 전체 서명은 [생성 레퍼런스](../sdk/popbill/kakao/index.md)에서 확인합니다.

| 영역                                     | compat                                                                               | modern                                                                             |
| ---------------------------------------- | ------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------- |
| 알림톡 단건·대량·동보                    | 기존 sendATS_one/multi/same                                                          | sendNotificationMessage/sendNotificationMessages/sendIdenticalNotificationMessages |
| 브랜드 메시지 전송 8종                   | sendBMSText/Image/WideImage/WideList/CarouselFeed/Commerce/CarouselCommerce/Variable | sendBrand…Messages                                                                 |
| 브랜드 이미지 업로드 7종 × 경로/바이너리 | upload…/upload…Binary                                                                | uploadBrand…FromPath/FromBinary                                                    |
| 브랜드 템플릿 3개                        | getBMSTemplateMgtURL/getBMSTemplate/listBMSTemplate                                  | getBrandTemplateManagementURL/getBrandTemplate/listBrandTemplates                  |
| 친구톡 텍스트 단건·대량·동보             | sendFTS_one/multi/same                                                               | sendFriendTextMessage/sendFriendTextMessages/sendIdenticalFriendTextMessages       |
| 친구톡 이미지 단건·대량·동보             | sendFMS_one/multi/same                                                               | sendFriendImageMessage/sendFriendImageMessages/sendIdenticalFriendImageMessages    |
| 범용 getURL                              | 기존 이름 유지                                                                       | 목적별 관리 URL 메서드 제공                                                        |

친구톡은 현재 공개 목록에 없지만 공식 Node.js 1.64.2 원본에 남아 있는 요청 계약을 compat와 modern에서 제공합니다.
실서버에서의 이용 가능 여부는 이 작업에서 검증하지 않았습니다.

친구톡은 단건 입력 또는 `recipients` 배열을 사용하며 광고 여부는 `advertising`으로 지정합니다. 이미지형의 `filePath`는 전송할 로컬 이미지 경로이고, 선택적 `imageLink`는 이미지를 눌렀을 때 이동할 URL입니다. 원격 이미지 URL을 파일 경로 대신 전달하지 않습니다. 단건에서도 `referenceKey`를 보존합니다.

## 위치 인자와 응답

- compat의 기존 ATS/FTS/FMS 위치 인자는 저장소 legacy 순서를 유지합니다. 짧은 overload는 altSubject를 생략합니다.
  altSubject를 포함하는 호출은 UserID·requestNum·buttons까지 전체 슬롯을 유지해야 arity가 구분됩니다.
- 알림톡 강조표기는 기존 ATS 위치 인자 뒤의 emphasizeTitle 옵션과 개별 수신자의 emphasizeTitle로 전달합니다.
  최신 외부 SDK가 UserID 위치를 변경했으므로 해당 최신 인자 순서 자체는 가져오지 않습니다.
  modern은 객체 DTO를 사용해 이 차이를 감춥니다.
- 알림톡 전화걸기 버튼의 HTTP 필드는 telNum입니다.
- 부분 예약취소는 compat의 수신번호 문자열 인자를 유지하면서 현재 HTTP 명세의 receiveNum 객체 본문으로 전송합니다.
  저장소 legacy와 Node.js 1.64.2의 문자열 본문은 현재 HTTP 계약에 맞춰 교정한 의도적인 차이입니다.
- modern의 상태 필터를 생략하거나 빈 배열을 전달하면 `State` query를 생략해 서버의 전체 상태를 조회합니다. SDK에 아직 알려지지 않은 상태도 제외하지 않습니다.
- 일반 브랜드 요청은 채널 검색 아이디가, 템플릿형은 템플릿 코드가 타입에서 필수입니다.
- 이미지 업로드는 HTTP 응답 객체를 유지합니다. 단건은 imageUrl, 다건은 result 배열의 formField·imageUrl을 반환합니다.
  Node 문서의 단건 string 설명보다 HTTP 문서와 실제 SDK 반환 경로를 우선합니다.
- 전송결과 상태와 카카오 결과는 숫자, 집계 건수는 원본 문자열을 유지합니다.
  대체문자 결과는 HTTP 문자열과 SDK 문서의 숫자를 모두 보존하므로 앞자리 0도 유지합니다.
  브랜드 커머스 할인은 discountType/discount, 캐러셀 변수는 배열입니다.

## 인증과 문서 기준

compat은 member 및 153~159 scope를 사용합니다. 154·155는 기존 친구톡 호환용입니다.
현행 HTTP 인증 문서의 159는 브랜드 메시지 O 전송대상에 대응합니다.
I/O/N/M 전송대상은 현재 HTTP 계약을 따르며 채널별 이용 조건은 서버가 검증합니다.

- [현재 전체 API](https://developers.popbill.com/reference/kakaotalk/node/api)
- [알림톡](https://developers.popbill.com/reference/kakaotalk/node/api/send)
- [브랜드 메시지 HTTP 계약](https://developers.popbill.com/api-reference/kakaotalk/api/send-bms)
- [브랜드 템플릿](https://developers.popbill.com/reference/kakaotalk/node/api/bms-template)
- [전송결과](https://developers.popbill.com/reference/kakaotalk/node/api/info)
- [인증 scope](https://developers.popbill.com/api-reference/kakaotalk/getting-started/authorization)
- [공식 Node.js 1.64.2 배포 원본](https://registry.npmjs.org/popbill/-/popbill-1.64.2.tgz)

검증은 HTTP mock과 modern → 실제 compat → 요청 런타임 경로를 사용합니다.
실발송·채널 등록·실제 이미지 업로드는 실행하지 않습니다.
