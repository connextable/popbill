# Popbill Modern SDK Migration TODO

완료된 마이그레이션의 주요 결정과 변경을 보관한다. 현재 사용법은 [modern README](../../packages/popbill/README.md), 지원 범위와 제한은 [구현 범위](./service-coverage.md), 정확한 서명·DTO·compat 연결은 [SDK 레퍼런스](../sdk/README.md)를 확인한다.

## Guide

modern은 compat 기반 runtime 위에 객체 인자와 목적별 메서드를 제공한다. 새 API에는 레거시 이름을 위한 호환 별칭을 추가하지 않는다. 구현은 [서비스 소스](../../packages/popbill/src/services), 원본 계약은 [spec](../../packages/popbill-spec/src)에 있다. 기존 사용자에게 필요한 변경은 [2.0 이전 가이드](./2.0.md)를 확인한다.

## Status Legend

과거 `DONE`은 해당 시점의 구현·로컬 계약 검사 완료를 뜻했다. 실서버 검증 결과나 이후 변경의 통과를 뜻하지 않는다. 실제 실행 결과는 [검증 기록](./validation-history.md)에 보관한다.

## TaxInvoice Method Checklist

세금계산서의 발행·역발행·조회·전송·첨부·관리 URL·인증서·알림 기능을 객체 API로 제공한다. 입력·응답 이름과 DTO 매핑은 [세금계산서 가이드](../services/tax-invoice.md)와 생성 레퍼런스를 따른다.

## Statement Method Checklist

전자명세서 6종의 전체 기능을 객체 API로 연결했다. `StatementBoxScopes.IssuedDocumentBox`는 팝빌의 `SWBOX`를 뜻하며, SMS 전송의 `messageBody`는 필수다. [전자명세서 가이드](../services/statement.md)에서 문서유형과 실행 예시를 확인한다.

## TaxInvoice Additional Method Checklist

세금계산서 과금정보·단가 조회와 PDF 바이트 다운로드를 추가했다. 단가의 문자열 선언, PDF 문서번호 유형·사본 선택은 [세금계산서 계약](../services/tax-invoice.md)을 따른다.

## Additional Service Checklist

공통·현금영수증·홈택스 수집·사업자 조회·금융 조회·카카오·문자·팩스를 공개 클라이언트에 연결했다. 단건·다건 전송은 수신자 배열로, 범용 URL은 목적별 메서드로 표현한다. 현재 메서드 수와 전체 공개 목록은 소스에서 생성한다.

## Legacy Capability Completion

후속 작업으로 세금계산서 레거시 기능, 친구톡 텍스트·이미지 전송, 문자 접수번호별 상태 일괄조회를 추가했다. 문서화되지 않은 메일 공개키와 문자 상태 응답은 `unknown`으로 보존한다. 레거시 기능의 실서버 이용 가능성은 확인하지 않았으며 로컬 계약 검사와 구분한다.

## Rules

원본 요청·응답은 spec, 위치 인자 호환은 compat, 객체 DTO·매핑은 modern에 둔다. 응답의 미확정 값 처리 기준은 [외부 API 계약 검증](./service-coverage.md#외부-api-계약-검증)을 확인한다.

과거에 제거한 `@connextable/popbill-spec/tax-invoice/get-info` 경로 대신 `@connextable/popbill-spec/tax-invoice/shims`를 사용한다.

## Notes

- **2026-02~05:** 세금계산서 facade와 compat bridge, 객체 기반 공개 메서드 목록을 정리했다.
- **2026-11-02:** 전자명세서를 구현하고 공식 문서의 필수 SMS 본문과 문서함 구분을 반영했다.
- **2026-11-03:** 나머지 서비스를 확장하고 호환 별칭을 제거했다. stub 제거 후 남은 레거시 기능을 연결했으며, 이후 응답 관용성 개선으로 새 코드·미확정 값·`null`을 보존하도록 출력 타입과 매퍼를 보완했다.
