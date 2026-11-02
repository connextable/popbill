# 현금영수증 예제

실행 예제는 저장된 문서와 초대량 처리 결과를 조회합니다. 발행·취소 사용법과 계약 차이는 [현금영수증 가이드](../../../docs/services/cashbill.md)를 확인합니다.

저장소 루트에서 SDK를 빌드하고 [공통 환경변수](../../.env.example)와 `POPBILL_RUN_CASHBILL_EXAMPLES=true`, `POPBILL_IS_TEST=true`를 설정합니다.

```sh
pnpm -C examples cashbill -- --help
# POPBILL_CASHBILL_MGT_KEY 설정 후 문서 조회
pnpm -C examples cashbill -- lookup
# POPBILL_CASHBILL_SUBMIT_ID 설정 후 처리 결과 조회
pnpm -C examples cashbill -- bulk-result
```
