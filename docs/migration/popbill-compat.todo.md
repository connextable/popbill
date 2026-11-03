# Popbill Compat SDK Migration TODO

완료된 마이그레이션의 주요 결정과 변경을 보관한다. 현재 사용법은 [compat README](../../packages/popbill-compat/README.md), 지원 범위와 제한은 [구현 범위](./service-coverage.md), 정확한 서명은 [SDK 레퍼런스](../sdk/README.md)를 확인한다.

## Guide

기존 SDK의 메서드 이름·위치 인자·callback·Promise 계약을 유지하고, 요청·응답 타입은 `@connextable/popbill-spec`에 둔다. 실제 구현은 [서비스 소스](../../packages/popbill-compat/src/services)에 있다. 객체 기반 API로 이전하려면 [modern 마이그레이션 기록](./popbill-modern.todo.md)과 [2.0 이전 가이드](./2.0.md)를 확인한다.

## Status Legend

과거 `DONE`은 해당 시점의 구현·로컬 계약 검사 완료를 뜻했다. 실서버 검증 결과나 이후 변경의 통과를 뜻하지 않는다. 실제 실행 결과는 [검증 기록](./validation-history.md)에 보관한다.

## Service Checklist

공통·전자문서·홈택스 수집·사업자 조회·금융 조회·메시징 서비스의 공개 factory와 singleton을 실제 runtime에 연결했다. 문자 바이너리 전송과 카카오 브랜드 메시지 API도 포함한다. 현재 메서드 수는 생성 레퍼런스를 기준으로 한다.

## TaxinvoiceService Method Checklist

세금계산서의 발행·역발행·조회·전송·첨부·인증서·알림·과금 기능을 구현했다. 레거시에만 남은 전송·전송취소·승인·거부·구 인쇄·메일 공개키 API도 제공하며, 공개 스키마가 없는 응답은 `unknown`으로 보존한다. 세부 차이는 [세금계산서 계약](../services/tax-invoice.md)을 따른다.

이전 표의 `LEGACY_ONLY`는 계약 근거가 레거시 SDK라는 뜻이었다. modern에서도 해당 기능을 제공하며, 제공자의 현재 실서버 이용 가능성을 확인했다는 뜻은 아니다.

## StatementService Method Checklist

전자명세서 6종의 발행·조회·첨부·알림·관리 URL·과금 기능을 구현했다. 공통 회원·포인트 API는 초기 명세서 작업에서 제외했으나 전체 서비스 확장 시 포함했다. 현재 범위와 입력 예시는 [전자명세서 가이드](../services/statement.md)를 따른다.

## Rules

callback과 Promise는 같은 API 계약을 사용한다. 레거시 인자의 순서를 임의로 바꾸지 않으며 선택 인자·`undefined` 조합은 생성된 공개 서명을 따른다. 응답의 미확정 값 처리 기준은 [외부 API 계약 검증](./service-coverage.md#외부-api-계약-검증)을 확인한다.

## Notes

- **2026-02~05:** 세금계산서의 API별 runtime 연결과 공개 메서드 목록을 정리했다.
- **2026-11-02:** 전자명세서를 구현하고 검색의 선택 페이지 인자, callback의 명시적 `undefined`, multipart 파일명 처리를 보완했다.
- **2026-11-03:** 공통과 나머지 서비스를 확장했다. 레거시 `register`의 `writeSpecification`과 오류 전용 callback을 복구하고, stub Proxy·미구현 adapter를 제거했다. 공개 `NotImplementedError` 클래스는 기존 import 호환을 위해 남기지만 SDK 내부에서 생성하지 않는다.
