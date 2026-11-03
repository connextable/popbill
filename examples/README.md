# Popbill Examples

SDK를 빌드한 뒤 서비스별 CLI로 조회·수집·발행·발송을 실행합니다. 이 문서의 명령은 모두 저장소 루트에서 실행합니다.

## 공통 준비

Node.js·pnpm 요구사항은 [개발 환경](../docs/development.md#개발-환경)을 확인합니다. 의존성을 설치하고 SDK를 빌드합니다.

```sh
pnpm install --frozen-lockfile
pnpm build
```

예제 전용 환경변수 파일을 만듭니다. 이미 있다면 필요한 값만 수정합니다.

```sh
cp ./examples/.env.example ./examples/.env
```

Popbill 예제는 `POPBILL_LINK_ID`, `POPBILL_SECRET_KEY`, `POPBILL_USER_ID`, `POPBILL_CORP_NUM`을 사용합니다. [.env.example](./.env.example)에서 인증정보와 실행할 서비스의 설정을 채우고 `POPBILL_IS_TEST=true`를 유지합니다. 예제에 들어 있는 사업자번호·메일·전화·팩스 번호는 직접 관리하는 테스트 대상 값으로 바꿉니다.

API를 호출하지 않고 사용법을 보려면 각 절에 제시한 `-- --help` 명령을 실행합니다. 인증정보 없이 도움말을 확인할 수 있습니다. 서비스별 실행 플래그와 필요한 입력은 아래에서 확인합니다.

## 회원·포인트 예제

회원·기업정보·잔액을 조회하려면 `POPBILL_RUN_COMMON_EXAMPLES=true`를 설정합니다. 회원가입·결제·환불은 실행하지 않습니다.

```sh
pnpm -C examples common -- --help
pnpm -C examples common
```

## 전자세금계산서 예제

세금계산서 CLI는 별도 실행 플래그 없이 동작하며 `POPBILL_IS_TEST=false`도 허용합니다. 시나리오에 따라 문서 등록·발행·국세청 전송·취소·삭제, 안내메일·문자·팩스 발송, 이메일 발송설정 변경을 실행합니다. `inquiry`, `urls`와 조회 메서드 예제도 필요한 문서를 먼저 발행할 수 있으므로 실행할 [시나리오](./src/tax-invoice/scenarios)와 [메서드 예제](./src/tax-invoice/methods)의 준비 단계를 확인합니다. 실행 후 남은 문서는 출력한 관리번호로 상태를 확인하고 정리합니다.

먼저 도움말을 보고 필요한 시나리오를 선택합니다. `issue`, `inquiry`, `urls`, `attachment`, `notify`, `reverse`, `bulk`, `search`, `certificate`를 지원합니다.

```sh
pnpm -C examples taxinvoice -- --help
pnpm -C examples taxinvoice -- certificate
pnpm -C examples taxinvoice -- inquiry,urls
```

`taxinvoice:all` 또는 인자 없는 `taxinvoice`는 모든 시나리오를 실행합니다. 메서드 하나만 실행하려면 목록에서 이름을 고릅니다.

```sh
pnpm -C examples taxinvoice:method:list
pnpm -C examples taxinvoice:method:list:verbose
pnpm -C examples taxinvoice:method -- getTaxCertificateInfo
pnpm -C examples taxinvoice:method -- issueInvoice,getInvoicePDFURL
```

세금계산서와 전자명세서 예제는 `POPBILL_USE_LOCAL_TIME`, `POPBILL_ACCEPT_ENCODING`, `POPBILL_REQUEST_TIMEOUT_MS` 옵션을 읽습니다. 다른 Popbill 예제에는 이 옵션들이 일괄 적용되지 않습니다.

역발행은 `POPBILL_CORP_NUM`을 공급받는자, `POPBILL_COUNTERPART_CORP_NUM`을 공급자로 사용합니다. 요청거부는 공급자 계정으로 실행하므로 `POPBILL_COUNTERPART_USER_ID`에 공급자의 팝빌 아이디가 필요합니다. 비어 있으면 요청거부만 건너뜁니다.

첨부·문서번호 할당 예제에는 다음 설정을 추가합니다.

- `POPBILL_STATEMENT_MGT_KEY`: 첨부할 전자명세서 관리번호. 비어 있으면 첨부·해제를 건너뜁니다.
- `POPBILL_ASSIGN_ITEM_KEY`: 팝빌 사이트에서 발행한 매출 문서 중 문서번호가 없는 문서의 `itemKey`. 비어 있으면 번호 할당을 건너뜁니다. 할당한 문서는 재사용할 수 없으므로 메서드 예제와 `attachment` 중 한 번만 실행하고, 다음에는 새 미할당 문서를 준비합니다. API로 등록한 임시저장 문서는 대상이 아닙니다. [공식 문서번호 할당 API](https://developers.popbill.com/api-reference/taxinvoice/api/etc#AssignMgtKey)의 대상 조건을 확인합니다.

발행 흐름과 데이터 계약은 [세금계산서 가이드](../docs/services/tax-invoice.md)를 확인합니다.

## 현금영수증 예제

기존 문서와 초대량 처리 결과를 조회합니다. 관리번호·접수 ID 설정과 실행 명령은 [현금영수증 예제](./src/cashbill/README.md)에 있습니다.

## 전자명세서 예제

거래명세서(`StatementItemCodes.TradeStatement`, `121`)로 저장·발행·조회·정리를 실행합니다. 공통 Popbill 필수 환경변수와 함께 `examples/.env`에 다음 값을 설정합니다.

```dotenv
POPBILL_IS_TEST=true
POPBILL_RUN_STATEMENT_EXAMPLES=true
```

테스트 계정에서도 발행과 안내메일 전송이 실행됩니다. 발신자 사업자번호는 `POPBILL_CORP_NUM`, 수신자는 `POPBILL_COUNTERPART_CORP_NUM`, 안내메일 주소는 `POPBILL_RECEIVER_EMAIL`을 사용합니다.

```sh
# 도움말: API 호출 없음
pnpm -C examples statement -- --help
# 임시저장 → 수정 → 발행 → 요약/상세/보기/인쇄 조회 → 발행취소 → 삭제
pnpm -C examples statement:lifecycle
# 즉시발행 → 조회 → 발행취소 → 삭제
pnpm -C examples statement:immediate
```

세금계산서에 명세서를 첨부하려면 같은 계정의 수정 가능한 매출 세금계산서 관리번호를 `POPBILL_STATEMENT_TAXINVOICE_MGT_KEY`에 입력합니다. [공식 전자명세서 첨부 API](https://developers.popbill.com/api-reference/taxinvoice/api/etc#AttachStatement)의 대상은 API로 발행한 명세서입니다. 아래 예제는 명세서를 임시저장·발행하고 발행완료(`300`)인지 확인한 뒤 세금계산서에 첨부합니다. 이후 첨부를 해제하고 명세서 발행을 취소한 뒤 삭제합니다.

```sh
pnpm -C examples statement:taxinvoice-attachment
```

팝빌 전자명세서의 자동승인 설정에 따라 발행 후 승인대기 상태가 될 수 있습니다. 예제는 발행완료(`300`)일 때만 첨부·취소를 진행합니다. 승인대기 상태라면 출력한 관리번호로 팝빌에서 승인 여부를 확인하고 정리합니다.

호출 실패 시 출력한 `businessNumber`, `documentTypeCode`, `managementKey`로 상태를 확인합니다. 발행 응답을 받지 못했어도 발행됐을 수 있으므로 같은 문서를 곧바로 재발행하지 않습니다. 예제는 실패한 문서를 자동 삭제하지 않습니다. 상태별 정리 방법과 첨부 조건은 [전자명세서 가이드](../docs/services/statement.md)를 확인합니다.

보기·인쇄 URL은 조회 직후 사용합니다. URL에는 회원 접근 권한이 포함되므로 로그를 외부에 공유하지 않습니다.

## 수집·조회 예제

홈택스 세금계산서는 [수집 예제](./src/home-tax-tax-invoice/README.md)의 인증·정액제 설정과 요청 → 상태 확인 → 조회 순서를 따릅니다.

홈택스 현금영수증은 인증·정액제 설정 후 `POPBILL_RUN_HTCASHBILL_EXAMPLES=true`를 켭니다. `POPBILL_HTCASHBILL_DIRECTION`에 `SELL` 또는 `BUY`, `POPBILL_HTCASHBILL_START_DATE`·`POPBILL_HTCASHBILL_END_DATE`에 `yyyyMMdd` 날짜를 입력합니다.

```sh
pnpm -C examples hometax:cashbill -- request
# 출력된 작업 ID를 POPBILL_HTCASHBILL_JOB_ID에 저장한 뒤 실행
pnpm -C examples hometax:cashbill -- state
pnpm -C examples hometax:cashbill -- search
pnpm -C examples hometax:cashbill -- summary
```

계좌 거래내역은 계좌 등록·정액제 설정 후 `POPBILL_RUN_EASYFINBANK_EXAMPLES=true`를 켭니다. `POPBILL_BANK_CODE`, `POPBILL_BANK_ACCOUNT_NUMBER`, `POPBILL_BANK_START_DATE`, `POPBILL_BANK_END_DATE`를 설정하고 수집을 요청합니다. 날짜는 `yyyyMMdd` 형식입니다.

```sh
pnpm -C examples easyfinbank -- request
# 출력된 수집 ID를 POPBILL_BANK_COLLECTION_ID에 저장한 뒤 실행
pnpm -C examples easyfinbank -- state
pnpm -C examples easyfinbank -- search
pnpm -C examples easyfinbank -- summary
```

수집 예제는 완료 상태와 성공 결과를 확인한 뒤 조회합니다. ID는 최초 요청으로부터 1시간 유효하며 자동 폴링이나 만료 후 자동 재요청은 하지 않습니다. 거래내역 `search`는 첫 페이지의 건수만 출력합니다. 전체 데이터의 페이지 순회와 상세 데이터 처리는 직접 구현합니다. 인증·기간·결과 해석은 [홈택스 현금영수증](../docs/services/home-tax-cashbill.md)과 [계좌 거래내역](../docs/services/easy-fin-bank.md) 가이드를 확인합니다.

휴폐업·기업정보·예금주 조회의 입력과 명령은 [조회 서비스 예제](./src/lookup/README.md)에 있습니다.

## 메시징 예제

처음에는 조회 모드로 실행합니다. 서비스별 실행 플래그·발송 입력·요청번호 보관 방법은 각 예제 문서에 있습니다.

- [카카오톡](./src/kakao/README.md): 채널·알림톡 템플릿 조회와 알림톡 발송.
- [문자](./src/message/README.md): 발신번호 조회와 단문 발송.
- [팩스](./src/fax/README.md): 전송 상태 조회·파일 발송·예약 취소.

## Juso 예제

Juso는 별도 패키지 `@connextable/popbill-juso`를 사용합니다. `JUSO_LINK_ID`, `JUSO_SECRET_KEY`, `JUSO_ACCESS_ID`를 설정합니다. Popbill의 인증정보·테스트 모드·실행 플래그를 공유하지 않습니다. 추가 설정은 [.env.example](./.env.example)의 JusoLink 항목을 확인합니다.

```sh
pnpm -C examples juso -- "서울 강남구 테헤란로"
pnpm -C examples juso -- --keyword "부산 해운대구 우동" --page-size 5
pnpm -C examples juso -- --help
```

검색어는 위치 인자나 `--keyword`로 전달하며, 생략하면 `JUSO_SEARCH_KEYWORD`를 사용합니다. `--page-number`, `--page-size`로 페이지를 선택하고 `--disable-differential-search`, `--disable-suggestion`으로 검색 동작을 조절합니다.

## 문제 해결

필수값 오류가 나면 `examples/.env`와 해당 서비스의 실행 플래그를 확인합니다. 모드·옵션 오류는 각 절의 도움말 명령으로 확인합니다. 인증·권한·포인트·문서 상태 오류는 API의 코드와 메시지를 보관하고 해당 [서비스 가이드](../docs/README.md)를 참고합니다.

## 관련 문서

- 설치·SDK 선택: [프로젝트 README](../README.md)
- 메서드·타입 조회: [SDK 레퍼런스](../docs/sdk/README.md)
