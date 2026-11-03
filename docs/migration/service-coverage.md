# Popbill 서비스 구현 범위

저장소의 레거시 코드, 공식 HTTP·Node 문서와 공식 Node SDK 1.64.2를 기준으로 구현했다. 이 문서는 서비스 공개 위치와 의도적인 계약 차이를 관리한다. 사용 흐름은 [서비스 가이드](../README.md), 현재 메서드 수·전체 서명·오버로드·DTO·compat 연결은 `pnpm docs:generate`로 생성하는 [SDK 레퍼런스](../sdk/README.md)에서 확인한다.

| 분류        | modern 서비스                          | compat 서비스                                              |
| ----------- | -------------------------------------- | ---------------------------------------------------------- |
| 공통        | `common`                               | 공통 factory 및 공개 서비스의 상속 메서드                  |
| 전자문서    | `taxInvoice`, `cashbill`, `statement`  | `TaxinvoiceService`, `CashbillService`, `StatementService` |
| 홈택스 수집 | `homeTaxTaxInvoice`, `homeTaxCashbill` | `HTTaxinvoiceService`, `HTCashbillService`                 |
| 사업자 조회 | `closedown`, `bizInfoCheck`            | `ClosedownService`, `BizInfoCheckService`                  |
| 금융 조회   | `easyFinBank`, `accountCheck`          | `EasyFinBankService`, `AccountCheckService`                |
| 메시징      | `kakao`, `message`, `fax`              | `KakaoService`, `MessageService`, `FaxService`             |

상속된 공통 메서드를 각 서비스에 중복 집계하지 않는다. EasyFinBank 레거시의 `getChargeInfo` 중복 정의는 한 번만 제공한다. 문자에는 파일 바이너리 전송, 카카오에는 브랜드 메시지 API를 추가했다.

## 구조와 공개 계약

- spec은 도메인·기능별 디렉터리와 API별 원본 요청·응답 파일을 유지한다.
- compat는 기존 이름·위치 인자·callback 및 Promise를 제공한다. 공개 factory와 singleton 반환형은 도메인 타입과 공통 타입의 교차 타입이다. 개별 도메인 인터페이스는 도메인 메서드만 기술한다.
- modern은 객체 인자와 명확한 기능 이름을 제공한다. 범용 URL 함수·송신 함수의 호환 별칭을 추가하지 않는다.
- 인증·HTTP·PDF 바이트 전송은 기존 runtime에서 처리한다. 서비스별 scope와 클라이언트별 설정·캐시를 분리한다.
- 회원 탈퇴 후 같은 modern 클라이언트 및 같은 compat factory 설정 객체에 연결된 토큰을 폐기한다. compat singleton의 서비스 간 캐시는 기존 레거시처럼 독립적이다.
- 모든 공개 서비스는 실제 메서드 객체를 반환하며 미구현 stub이나 임의 메서드명을 받아 주는 Proxy를 사용하지 않는다. `@connextable/popbill-compat/errors`의 공개 `NotImplementedError` 클래스는 기존 import 호환을 위해 남기며 SDK 내부에서 생성하지 않는다.

modern과 compat의 메서드 수 차이는 같은 기능의 레거시 wrapper를 객체 API에 통합한 결과다. 생성 레퍼런스의 compat 연결은 modern 메서드가 호출하는 대표 메서드 하나를 기록하므로, 연결 목록에 레거시 이름이 없다는 이유만으로 기능 누락으로 보지 않는다.

| 레거시 wrapper                        | modern에서 같은 기능을 사용하는 방법                                                                                                                  |
| ------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| 문자 SMS·LMS·XMS 단건·다건·범용 전송  | `sendShortMessage`·`sendLongMessage`·`sendAutoLengthMessage`의 `recipients` 배열                                                                      |
| 문자 MMS 단건·다건·경로·바이너리 전송 | `sendImageMessage`의 `recipients` 배열과 `image` 입력                                                                                                 |
| 카카오 ATS·FTS·FMS 단건 전송          | `sendNotificationMessage`·`sendFriendTextMessage`·`sendFriendImageMessage`. 단건 참조키 보존을 위해 내부에서는 동보 전송 메서드에 수신자 한 명을 전달 |
| 공통·카카오·문자·팩스의 범용 URL      | 로그인·충전·템플릿·발신번호·발송내역 등 목적별 URL 메서드                                                                                             |

## 문서와 레거시의 차이

- **공통:** 회원·포인트 API는 modern의 `common`과 compat 도메인 서비스의 상속 메서드에서 제공한다. 범용 `getPopbillURL`은 compat에 유지한다. [회원·포인트 계약](../services/common.md)
- **세금계산서:** 과금정보·문자열 단가·PDF 다운로드와 공식 SDK의 전송·전송취소·승인·거부·구 인쇄·메일 공개키 API를 compat와 modern에 제공한다. PDF는 매출·매입·위수탁 문서번호 유형을 받고 `printCopy`로 공급자·공급받는자 사본을 선택한다. 공개 스키마가 없는 메일 공개키 응답은 compat의 `unknown`, modern의 `{ publicKeys: unknown }`으로 보존한다. [세금계산서 계약 기록](../services/tax-invoice.md)
- **현금영수증:** 대량 처리 응답의 접수·발행 시각을 임의로 바꾸지 않고 보존한다. [현금영수증 계약](../services/cashbill.md)
- **수집:** 작업 완료와 수집 성공은 별개다. 완료 상태와 성공 결과코드를 함께 확인한다. 작업 ID는 요청 후 1시간 유효하며, 자동 폴링이나 자동 재요청을 하지 않는다. [홈택스 세금계산서](../services/home-tax-tax-invoice.md), [홈택스 현금영수증](../services/home-tax-cashbill.md), [계좌 조회](../services/easy-fin-bank.md)
- **카카오:** 알림톡·브랜드 메시지와 공식 SDK의 친구톡 텍스트·이미지 단건·대량·동보 기능을 modern에도 제공한다. 범용 URL은 compat에 유지하며 modern은 목적별 URL 메서드를 제공한다. 문서·SDK 간 scope와 메시지 모델 차이를 기록했다. [카카오 지원 범위](../services/kakao.md)
- **문자:** modern은 하나의 수신자 배열로 단건·다건을 다룬다. 레거시 `getStates`는 modern의 `getMessageStatesByReceiptNumbers`로도 제공하며 문서화되지 않은 응답 전체를 `unknown`으로 보존한다. 수신자별 부분 예약 취소는 현재 공식 HTTP의 `{ receiveNum }` 본문을 전송한다. [문자 계약](../services/message.md)
- **팩스:** 레거시의 바이너리 파일 검사, 단건 수신번호·이름 매핑, 재전송 인자 오류를 공식 계약대로 수정했다. [팩스 계약](../services/fax.md)
- **콜백:** 선택 인자 자리가 `undefined`인 호출은 성공·오류 두 슬롯을 명시한다. 정의된 선택값 뒤의 단일 성공 콜백은 유지한다. 실제 허용 조합은 생성된 타입 서명을 따른다.

## 검증과 한계

### 외부 API 계약 검증

SDK는 요청을 구성하는 데 필요한 필드와 숫자·배열 등 입력 구조를 확인한다. 페이지 번호와 크기의 양의 정수 조건은 유지하며, 제공자의 최대 페이지 크기·JSON 배치 건수 등 변경 가능한 운영 제한은 서버가 판단하도록 한다. 서비스 가이드의 최대값·코드 목록은 확인한 제공자 계약을 설명하며 SDK의 영구적인 허용 목록을 뜻하지 않는다.

HTTP JSON 응답은 JSON 파싱 후 API별 타입으로 전달한다. TypeScript 타입 선언이나 문서용 JSON 스키마로 응답 전체를 런타임 검증하지 않으므로 추가 필드나 숫자·문자열 표현 차이만으로 응답을 거절하지 않는다. compat는 원문 객체 또는 해당 API의 반환 필드를 전달하며, modern은 공개 DTO에 정의된 필드를 선택해 매핑한다. modern DTO에 없는 추가 필드를 자동으로 복사하지는 않는다.

회원·아이디 확인, 회원 탈퇴 후 토큰 폐기, 수집 성공 여부는 안전하게 정수로 해석할 수 있는 `1`과 `"1"`을 같은 성공 코드로 판단한다. 원본 결과코드는 응답에 보존하며, 빈 값·`null`·알 수 없는 코드를 성공으로 판정하지 않는다. HTTP 오류의 숫자 문자열 코드도 정규화하고 원래 오류 본문은 `raw`에 보존한다.

전자문서의 상태·결과·분류 코드는 알려지지 않은 문자열과 `null`을 보존한다. 해석 가능한 정수 문자열은 숫자로 정규화하지만 새 코드라는 이유로 삭제하거나 조회 전체를 실패시키지 않는다. 응답에 사용하는 코드 타입은 요청 인자의 허용 목록과 구분한다. 숫자형 선택 수량·페이지·파일 크기의 `null`·빈 값은 생략하며 `0`으로 바꾸지 않는다.

전자문서의 응답 플래그는 `true`·`false`, `1`·`0`, `"true"`·`"false"`, `"y"`·`"n"`, `"1"`·`"0"`을 불리언으로 정규화한다. 그 밖의 값과 `null`은 그대로 남겨 미확정 값을 `false`로 바꾸지 않는다. 호출자는 `=== true`·`=== false`로 확인하고 나머지는 미확정 값으로 처리한다. 문자 상태·결과코드는 기존 숫자→문자열 정규화를 유지하되 `null`과 누락을 보존한다.

HTTP 비정상 상태, 깨진 JSON, 시간 제한·취소, PDF 대신 반환된 JSON 오류 처리는 유지한다. DTO 매핑에 필요한 객체·배열 구조도 전제하므로 필수 목록이 객체 등 다른 구조로 바뀐 응답을 빈 검색 결과로 처리하지 않는다. `acceptLanguage`는 HTTP 언어 우선순위 문자열을 전달하며 제공자가 모든 언어를 지원한다고 보증하지 않는다.

### 로컬 검사와 실서버 검사

각 서비스는 공식 문서와 레거시를 기준으로 HTTP 경로·헤더·본문·응답, callback·Promise, 명시적 `undefined`, modern DTO와 오류 처리를 검증한다. 구현자와 다른 리뷰어가 계약을 검토하고, 발견한 결함 수정 후 영향받은 테스트를 다시 실행한다. 공개 서비스 연결, scope·클라이언트 격리, 탈퇴 후 토큰 폐기, 바이너리 본문·오류·취소·시간 제한, 문서 생성·패키지 진입점도 검증 대상이다.

실서버 발행·발송·회원가입·탈퇴·결제·환불·실계좌 호출은 수행하지 않았다. 레거시 전용 API는 공식 SDK에 구현이 존재한다는 근거와 실서버 지원 확인을 구분한다. 전자명세서와 이번에 추가한 서비스의 실행 예제는 테스트 환경과 명시적 실행 설정을 요구한다.

구현 완료 당시의 검사 결과는 [검증 기록](./validation-history.md)에 보관한다. 과거 결과는 이후 변경에 대한 검증을 대신하지 않는다. 현재 변경을 검증하는 명령과 범위는 [개발 가이드](../development.md)를 따른다.

## 공식 자료

- [회원](https://developers.popbill.com/api-reference/taxinvoice/common-api/member), [포인트](https://developers.popbill.com/api-reference/taxinvoice/common-api/point)
- [전자세금계산서](https://developers.popbill.com/reference/taxinvoice/node/api), [현금영수증](https://developers.popbill.com/reference/cashbill/node/api), [전자명세서](https://developers.popbill.com/reference/statement/node/api)
- [홈택스 세금계산서](https://developers.popbill.com/api-reference/httaxinvoice/api), [홈택스 현금영수증](https://developers.popbill.com/api-reference/htcashbill/api)
- [휴폐업](https://developers.popbill.com/api-reference/closedown/api), [기업정보](https://developers.popbill.com/api-reference/bizinfocheck/api)
- [계좌 조회](https://developers.popbill.com/api-reference/easyfinbank/api), [예금주](https://developers.popbill.com/api-reference/accountcheck/api)
- [카카오톡](https://developers.popbill.com/reference/kakaotalk/node/api), [문자](https://developers.popbill.com/api-reference/sms/api), [팩스](https://developers.popbill.com/api-reference/fax/api)
- [공식 Node SDK](https://github.com/linkhub-sdk/node-popbill)
