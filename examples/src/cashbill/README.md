# 현금영수증 예제

저장된 현금영수증과 초대량 처리 결과를 조회합니다. [공통 준비](../../README.md#공통-준비)를 마치고 `examples/.env`에 `POPBILL_RUN_CASHBILL_EXAMPLES=true`를 설정합니다. 모든 명령은 저장소 루트에서 실행합니다.

`lookup`은 `POPBILL_CASHBILL_MGT_KEY`의 관리번호 사용 여부를 확인하고 요약·상세 정보를 출력합니다. `bulk-result`는 `POPBILL_CASHBILL_SUBMIT_ID`의 처리 결과를 출력합니다.

```sh
pnpm -C examples cashbill -- --help
pnpm -C examples cashbill -- lookup
pnpm -C examples cashbill -- bulk-result
```

이 예제는 문서를 새로 발행하지 않습니다. 발행·취소 사용법과 결과 해석은 [현금영수증 가이드](../../../docs/services/cashbill.md)를 확인합니다.
