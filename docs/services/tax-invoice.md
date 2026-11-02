# 세금계산서 잔여 API 계약

[문서 목록](../README.md) · [실행 예제](../../examples/README.md#전자세금계산서-예제)

기존 세금계산서의 추가 API를 compat와 modern에 연결했다. compat는 레거시 이름과 위치 인자를, modern은 기능별 이름과 객체 인자를 제공한다. 현행 문서에서 빠진 API는 공식 Node SDK의 요청 계약을 따르며 실서버 지원 여부는 별도 확인이 필요하다.

| compat                                 | modern                                                             | 근거와 응답                                                                                                                |
| -------------------------------------- | ------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------- |
| `getChargeInfo`                        | `getChargeInfo`                                                    | 현행 Node 문서. `unitCost`, `chargeMethod`, `rateSystem` 객체                                                              |
| `getUnitCost`                          | `getUnitCost`                                                      | 현행 Node 문서. compat은 단가 문자열, modern은 `{ unitCost }`                                                              |
| `getPDF`                               | `downloadInvoicePDF`                                               | 현행 영문 HTTP 문서와 공식 Node SDK. compat은 `Buffer`, modern은 `{ fileData: Uint8Array }`                                |
| `send`, `cancelSend`, `accept`, `deny` | `sendInvoice`, `cancelInvoiceSend`, `acceptInvoice`, `denyInvoice` | 레거시와 공식 Node SDK 1.64.2의 전송·전송취소·승인·거부 계약. modern은 `{ resultCode, resultMessage }` 반환                |
| `getOldPrintURL`                       | `getLegacyInvoicePrintURL`                                         | 레거시와 공식 Node SDK의 `TG=PRINTOLD` 계약. modern은 `{ accessUrl }` 반환                                                 |
| `getEmailPublicKeys`                   | `getEmailPublicKeys`                                               | 레거시와 공식 Node SDK의 GET 계약. 공개 응답 스키마가 없어 compat는 `unknown`, modern은 `{ publicKeys: unknown }`으로 보존 |

`getUnitCost`는 `UserID`를 받지 않는다. 단가를 숫자로 변환하지 않아 소수점과 문자열 표현을 보존한다. PDF는 `?PDF`에서 원본 바이트를 받으며 JSON이나 base64로 해석하지 않는다. 서버가 JSON 오류를 반환하면 일반 API 오류 계약으로 전달한다.

PDF 출력 사본은 modern의 `downloadInvoicePDF({ ..., printCopy: 'supplier' })` 또는 `printCopy: 'buyer'`로 선택한다. 공급자용은 HTTP `PdfInvoiceType=1`, 공급받는자용은 `2`로 매핑한다. 생략하면 두 사본을 모두 출력한다. compat에서는 원래 `UserID` 다음에 선택 인자를 추가한 `getPDF(corpNum, keyType, mgtKey, userId, pdfInvoiceType)`를 사용한다. callback도 같은 순서 뒤에 성공·오류 콜백을 전달하며, 기존 호출 형식은 그대로 유지한다.

PDF 입력은 공식 Node SDK처럼 매출(`SELL`)·매입(`BUY`)·위수탁(`TRUSTEE`) 문서번호 유형을 받는다. 영문 HTTP 문서의 매출 예시만으로 SDK 입력을 제한하지 않는다. 문서에 대한 실제 출력 권한과 지원 여부는 서버가 판단한다.

callback에서 선택 인자 `UserID`를 생략한 `(기본 인자..., undefined, errorCallback)`은 레거시 인자 개수 규칙에 따라 오류 전용 호출이다. `UserID`를 명시적으로 `undefined`로 두고 성공 콜백을 전달하려면 `(기본 인자..., undefined, successCallback, undefined)`처럼 두 callback 슬롯을 모두 채운다. `send`의 제목 다음 `UserID` 또는 `getPDF`의 출력 사본을 `undefined`로 전달할 때도 두 callback 슬롯을 명시한다.

기존 세금계산서의 공통 callback 파서와 즉시발행·발행·검색·초대량발행의 선택 인자 파서도 같은 규칙을 적용한다. `register(corpNum, taxinvoice, userId, writeSpecification, success, error)`의 레거시 원형도 보존한다. Promise에서는 `register(corpNum, taxinvoice, userId, writeSpecification)`로 호출하며, `true`이면 입력 객체를 변경하지 않고 본문에 `writeSpecification: true`를 반영한다.

`send`의 선택 문자열 하나는 레거시 오버로드에 따라 `UserID`다. 제목을 지정하려면 `EmailSubject`, `UserID` 두 슬롯을 모두 전달한다. Promise에서도 같은 규칙을 적용하며, 기본 사용자로 제목만 지정하려면 `send(corpNum, keyType, mgtKey, memo, emailSubject, undefined)`를 사용한다. callback에서는 마지막에 성공·오류 콜백을 전달한다. 인자 6개인 레거시 짧은 호출에서 내부 재호출이 잘못되는 버그는 재현하지 않고 정상 요청과 콜백을 제공한다.

출처:

- [공식 Node 과금정보·단가 문서](https://developers.popbill.com/reference/taxinvoice/node/common-api/point)
- [공식 PDF HTTP 계약](https://developers.popbill.com/en/api-reference/taxinvoice/api/info#GetPDF)
- [공식 Node SDK 소스](https://github.com/linkhub-sdk/node-popbill/blob/master/lib/TaxinvoiceService.js)

로컬 HTTP mock으로 요청·응답·callback·Promise·오류 및 PDF 바이트 보존을 검증한다. 회원별 권한과 레거시 전용 기능의 서버 지원 여부는 실서버 검증 범위다.
