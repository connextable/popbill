# Popbill Examples

`examples` 패키지는 도메인별 실행 예제를 제공합니다.

## 디렉터리 구조

- `src/common`: 회원·기업정보·포인트 조회
- `src/tax-invoice`, `src/cashbill`, `src/statement`: 전자문서
- `src/home-tax-tax-invoice`, `src/home-tax-cashbill`: 홈택스 수집
- `src/lookup`: 휴폐업·기업정보·예금주 조회
- `src/easy-fin-bank`: 계좌 거래내역 수집
- `src/kakao`, `src/message`, `src/fax`: 메시징
- `src/juso`: `@connextable/popbill-juso` 기반 주소검색 예제

## 공통 준비

의존성 설치:

```sh
pnpm install
pnpm build
```

환경변수 파일 생성:

```sh
cp ./examples/.env.example ./examples/.env
```

Popbill 공통 필수 환경변수:

- `POPBILL_LINK_ID`
- `POPBILL_SECRET_KEY`
- `POPBILL_USER_ID`
- `POPBILL_CORP_NUM`

주요 옵션 환경변수:

- `POPBILL_IS_TEST=true`
- `POPBILL_USE_LOCAL_TIME=true`
- `POPBILL_ACCEPT_ENCODING=gzip`
- `POPBILL_REQUEST_TIMEOUT_MS=30000`

## 전자세금계산서 예제

역발행 예제에서는 `POPBILL_CORP_NUM`을 공급받는자, `POPBILL_COUNTERPART_CORP_NUM`을 공급자로 사용합니다.
역발행 요청거부는 공급자 계정으로 실행하므로 `POPBILL_COUNTERPART_USER_ID`에 상대 사업자의 팝빌 아이디를 입력합니다. 비어 있으면 요청거부만 skip됩니다.

유즈케이스 전체 실행:

```sh
pnpm -C examples taxinvoice:all
```

유즈케이스별 실행:

```sh
pnpm -C examples taxinvoice:issue
pnpm -C examples taxinvoice:inquiry
pnpm -C examples taxinvoice:urls
pnpm -C examples taxinvoice:attachment
pnpm -C examples taxinvoice:notify
pnpm -C examples taxinvoice:reverse
pnpm -C examples taxinvoice:bulk
pnpm -C examples taxinvoice:search
pnpm -C examples taxinvoice:certificate
```

유즈케이스 선택 실행:

```sh
pnpm -C examples taxinvoice -- inquiry,urls,certificate
```

메서드 단위 실행:

```sh
pnpm -C examples taxinvoice:method -- issueInvoiceImmediately
pnpm -C examples taxinvoice:method -- getInvoiceDetailInfo
pnpm -C examples taxinvoice:method -- sendInvoiceToNTS
pnpm -C examples taxinvoice:method -- issueInvoice,getInvoicePDFURL
```

메서드 목록:

```sh
pnpm -C examples taxinvoice:method:list
pnpm -C examples taxinvoice:method:list:verbose
```

전자명세서 연계 참고:

- `POPBILL_STATEMENT_MGT_KEY`가 비어 있으면 `attachInvoiceStatement`, `detachInvoiceStatement`는 자동으로 skip됩니다.

문서번호 할당 참고:

- `assignInvoiceManagementKey`는 팝빌 사이트에서 발행한 매출 문서 중 문서번호가 없는 문서에만 실행할 수 있습니다. 해당 문서의 `itemKey`를 `POPBILL_ASSIGN_ITEM_KEY`에 입력합니다. 비어 있으면 이 단계만 skip됩니다.
- 할당에 성공한 문서는 같은 예제의 입력으로 다시 사용할 수 없습니다. 메서드 단위 실행과 `attachment` 시나리오 중 하나를 선택하고, 다음 실행에는 새 미할당 문서를 준비합니다. API로 등록한 임시저장 문서는 이 기능의 대상이 아닙니다. [공식 문서번호 할당 API](https://developers.popbill.com/api-reference/taxinvoice/api/etc#AssignMgtKey)를 참고합니다.

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

세금계산서에 명세서를 첨부하려면 같은 계정의 수정 가능한 매출 세금계산서 관리번호를 `POPBILL_STATEMENT_TAXINVOICE_MGT_KEY`에 입력합니다. 아래 예제는 명세서를 임시저장·발행하고 상태가 발행완료(`300`)인지 확인한 뒤 `client.services.taxInvoice.attachInvoiceStatement`로 첨부합니다. 이후 첨부를 해제하고 명세서 발행을 취소한 뒤 삭제합니다. [공식 전자명세서 첨부 API](https://developers.popbill.com/api-reference/taxinvoice/api/etc#AttachStatement)는 API로 발행한 명세서를 첨부 대상으로 규정합니다.

```sh
pnpm -C examples statement:taxinvoice-attachment
```

팝빌 전자명세서의 자동승인 설정에 따라 발행 후 승인대기 상태가 될 수 있습니다. 예제는 발행완료(`300`)일 때만 첨부·취소를 진행합니다. 승인대기 상태라면 출력한 관리번호로 팝빌에서 승인 여부를 확인하고 정리합니다.

호출 실패 시 예제가 출력한 `businessNumber`, `documentTypeCode`, `managementKey`로 `getStatementInfo`를 호출해 상태를 확인합니다. 발행 응답을 받지 못했어도 발행됐을 수 있으므로 같은 문서를 곧바로 재발행하지 않습니다. `100`은 임시저장, `300`은 발행완료, `500`은 발행취소입니다. 발행완료 문서는 취소 후 삭제하고, 다른 상태는 팝빌에서 확인한 뒤 정리합니다. 예제는 실패한 문서를 자동으로 삭제하지 않습니다.

보기·인쇄 URL은 조회 직후 사용합니다. URL에는 회원 접근 권한이 포함되므로 로그를 외부에 공유하지 않습니다.

## Juso 예제

필수 환경변수:

- `JUSO_LINK_ID`
- `JUSO_SECRET_KEY`
- `JUSO_ACCESS_ID`

주요 옵션 환경변수:

- `JUSO_API_BASE_URL`
- `JUSO_AUTH_BASE_URL`
- `JUSO_FORWARDED_IP_ADDRESS`
- `JUSO_USE_LOCAL_TIME=true`
- `JUSO_REQUEST_TIMEOUT_MS=30000`
- `JUSO_ACCEPT_LANGUAGE`
- `JUSO_SEARCH_KEYWORD`

기본 실행:

```sh
pnpm -C examples juso -- "서울 강남구 테헤란로"
pnpm -C examples juso -- --keyword "부산 해운대구 우동" --page-size 5
```

도움말:

```sh
pnpm -C examples juso -- --help
```

## 추가 서비스 예제

아래 명령은 기존 `dotenvx`·`jiti` 실행 환경을 사용합니다. 각 명령에 `-- --help`를 붙이면 API를 호출하지 않고 필요한 설정을 확인할 수 있습니다. 공통 필수 환경변수와 서비스별 설정은 [.env.example](./.env.example)을 참고합니다.

| 명령 (`pnpm -C examples …`)   | 모드                                    | 실행 설정                                |
| ----------------------------- | --------------------------------------- | ---------------------------------------- |
| `common`                      | 회원·기업정보·잔액 조회                 | `POPBILL_RUN_COMMON_EXAMPLES=true`       |
| `cashbill -- lookup`          | `lookup`, `bulk-result`                 | `POPBILL_RUN_CASHBILL_EXAMPLES=true`     |
| `hometax:taxinvoice -- state` | `request`, `state`, `search`, `summary` | `POPBILL_RUN_HTTAXINVOICE_EXAMPLES=true` |
| `hometax:cashbill -- state`   | `request`, `state`, `search`, `summary` | `POPBILL_RUN_HTCASHBILL_EXAMPLES=true`   |
| `lookup -- status`            | `status`, `company`, `account`          | `POPBILL_RUN_LOOKUP_EXAMPLES=true`       |
| `easyfinbank -- state`        | `request`, `state`, `search`, `summary` | `POPBILL_RUN_EASYFINBANK_EXAMPLES=true`  |
| `kakao -- list`               | `list`, `send`                          | `POPBILL_RUN_KAKAO_EXAMPLES=true`        |
| `message -- senders`          | `senders`, `send`                       | `POPBILL_RUN_MESSAGE_EXAMPLES=true`      |
| `fax -- status`               | `status`, `send`, `cancel`              | `POPBILL_RUN_FAX_EXAMPLES=true`          |

`POPBILL_IS_TEST=true`로 실행합니다. 발송 예제는 `POPBILL_RUN_MESSAGE_SEND`, `POPBILL_ALLOW_FAX_SEND`, `POPBILL_RUN_KAKAO_SEND`도 별도로 설정합니다. 홈택스·계좌 수집은 먼저 인증·계좌·정액제 설정을 마치고, 반환된 작업 ID를 저장한 뒤 완료 상태와 성공 결과를 확인합니다. 예제는 자동 폴링이나 만료 후 자동 재요청을 하지 않습니다.

## 문제 해결

확인 순서:

1. 필수 환경변수 누락 여부
2. 테스트/운영 관련 옵션(`POPBILL_IS_TEST`, `JUSO_API_BASE_URL`) 확인
3. 실행 명령 오타 여부 (`taxinvoice:method:list`, `juso -- --help`) 확인

## 관련 문서

- 루트 프로젝트 가이드: [../README.md](../README.md)
- 서비스 사용 흐름과 계약 차이: [문서 안내](../docs/README.md)
- SDK 상세 문서(생성 산출물): [../docs/sdk/README.md](../docs/sdk/README.md)
