# 전자명세서

[문서 목록](../README.md) · [실행 예제](../../examples/README.md#전자명세서-예제) · [API 레퍼런스](../sdk/popbill/statement/index.md)

`client.services.statement`에서 전자명세서를 등록·발행하고 상태·상세를 조회합니다. 아래 예제는 [modern SDK 설정](../../packages/popbill/README.md)을 마친 클라이언트를 사용합니다.

## 문서유형 선택과 조회

`managementKey`는 등록할 때 지정한 관리번호입니다. 다음 예제는 이미 저장된 거래명세서를 조회합니다.

```ts
import { StatementItemCodes } from '@connextable/popbill'

const statement = await client.services.statement.getStatementInfo({
  businessNumber: process.env.POPBILL_CORP_NUM!,
  documentTypeCode: StatementItemCodes.TradeStatement,
  managementKey: 'EXISTING-STATEMENT-001',
})
console.log(statement)
```

`StatementItemCodes`에서 사용할 문서유형을 선택합니다.

| 문서유형   | 상수             | 코드  |
| ---------- | ---------------- | ----- |
| 거래명세서 | `TradeStatement` | `121` |
| 청구서     | `Invoice`        | `122` |
| 견적서     | `Estimate`       | `123` |
| 발주서     | `PurchaseOrder`  | `124` |
| 입금표     | `Deposit`        | `125` |
| 영수증     | `Receipt`        | `126` |

## 등록·발행과 후속 작업

임시저장은 `registerStatement`, 즉시발행은 `issueStatementImmediately`를 사용합니다. 발행 응답을 받지 못하면 같은 문서유형·관리번호로 먼저 조회해 발행 여부를 확인합니다. 자동승인 설정에 따라 승인대기 상태가 될 수 있으므로 발행완료를 확인한 뒤 후속 작업을 수행합니다. 문서 본문의 필수값과 발행 예제는 [실행 예제](../../examples/README.md#전자명세서-예제)를 확인합니다.

문서함 URL은 `StatementBoxScopes.TemporaryDocumentBox`(임시 문서함) 또는 `StatementBoxScopes.IssuedDocumentBox`(발행 문서함)를 지정합니다. `resendStatementSMS`의 `messageBody`는 필수이며 기본 문구로 대체하지 않습니다.

세금계산서에 전자명세서를 첨부할 때는 `client.services.taxInvoice.attachInvoiceStatement`를 사용합니다. `TaxInvoiceStatementItemCodes`는 기존 세금계산서 연동용으로 계속 제공합니다. 첨부할 명세서는 발행완료 상태여야 합니다.

## 취소와 삭제

발행완료 문서를 정리하는 예제는 `cancelIssuedStatement`로 발행을 취소한 뒤 `deleteStatement`로 삭제합니다. 각 단계의 허용 상태는 서버가 판단합니다. 실패하면 같은 관리번호로 `getStatementInfo`를 호출해 현재 상태를 확인한 뒤 이어서 처리합니다. 승인대기 문서는 팝빌에서 승인 처리 여부를 먼저 확인합니다.

## compat 검색의 선택 인자

compat의 `search`는 검색어를 받는 전체형과 검색어 없는 단축형을 구분합니다. 중간 값을 생략할 때 뒤 인자를 옮기지 않고 `undefined`를 사용합니다.

전체형의 마지막 인자는 `QString, Order, Page, PerPage, UserID` 순서입니다. `Order`를 생략하려면 다섯 슬롯을 모두 유지합니다.

```ts
// search의 나머지 필수 인자 뒤에 전달하는 선택 인자입니다.
const fullSearchOptions = ['검색어', undefined, undefined, 10, undefined] as const
```

검색어 없는 단축형은 `Order, Page, PerPage, UserID` 순서이며, 페이지 번호만 생략하려면 `'D', undefined, 10`으로 전달할 수 있습니다. callback 호출에서 마지막 선택 인자를 `undefined`로 비우면 성공·오류 callback 슬롯도 모두 명시합니다.

서비스 생성 방법은 [compat SDK](../../packages/popbill-compat/README.md#전자명세서), 필수 인자까지 포함한 전체 서명은 [compat 레퍼런스](../sdk/popbill-compat/statement/index.md)를 확인합니다. 응답의 새 코드·미확정 플래그 처리 기준은 [2.0 이전 가이드](../migration/2.0.md#응답-코드와-미확정-값)에 있습니다.
