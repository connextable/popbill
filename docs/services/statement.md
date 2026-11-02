# 전자명세서

[문서 목록](../README.md) · [실행 예제](../../examples/README.md#전자명세서-예제)

`client.services.statement`는 전자명세서의 등록·발행·취소·조회, 문서 URL, 파일·명세서 첨부, 메일·SMS·FAX, 설정·과금을 제공합니다. `createPopbillClient`로 만든 클라이언트에서 다음처럼 저장된 문서를 조회합니다. `managementKey`는 등록할 때 지정한 관리번호입니다.

```ts
import { StatementItemCodes } from '@connextable/popbill'

const statement = await client.services.statement.getStatementInfo({
  businessNumber: process.env.POPBILL_CORP_NUM!,
  documentTypeCode: StatementItemCodes.TradeStatement,
  managementKey: 'EXISTING-STATEMENT-001',
})
console.log(statement)
```

| 문서유형   | 상수                                | 코드  |
| ---------- | ----------------------------------- | ----- |
| 거래명세서 | `StatementItemCodes.TradeStatement` | `121` |
| 청구서     | `StatementItemCodes.Invoice`        | `122` |
| 견적서     | `StatementItemCodes.Estimate`       | `123` |
| 발주서     | `StatementItemCodes.PurchaseOrder`  | `124` |
| 입금표     | `StatementItemCodes.Deposit`        | `125` |
| 영수증     | `StatementItemCodes.Receipt`        | `126` |

임시저장은 `registerStatement`, 즉시발행은 `issueStatementImmediately`를 사용합니다. 발행 응답을 받지 못하면 같은 문서유형·관리번호로 먼저 조회해 발행 여부를 확인합니다. 자동승인 설정에 따라 승인대기 상태가 될 수 있으므로 발행완료를 확인한 뒤 후속 작업을 수행합니다.

문서함 URL은 `StatementBoxScopes.TemporaryDocumentBox`(임시 문서함) 또는 `StatementBoxScopes.IssuedDocumentBox`(발행 문서함)를 지정합니다. `resendStatementSMS`의 `messageBody`는 필수이며 기본 문구로 대체하지 않습니다.

세금계산서에 전자명세서를 첨부할 때는 `client.services.taxInvoice.attachInvoiceStatement`를 사용합니다. `TaxInvoiceStatementItemCodes`는 기존 세금계산서 연동용으로 계속 제공합니다. 첨부할 명세서는 발행완료 상태여야 합니다.

compat 진입점과 위치 인자 검색 예시는 [compat SDK](../../packages/popbill-compat/README.md#전자명세서), 전체 객체 입력과 응답은 [생성 레퍼런스](../sdk/popbill/statement/index.md)를 확인합니다.
