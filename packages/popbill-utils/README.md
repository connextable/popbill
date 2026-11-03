# @connextable/popbill-utils

Popbill SDK 패키지에서 공유하는 유틸리티 헬퍼 패키지입니다.

SDK나 어댑터를 구현할 때 사용하는 정규화·검증·JSON·해시·HMAC·에러 헬퍼를 제공합니다. 애플리케이션의 Popbill 연동에는 `@connextable/popbill`, `@connextable/popbill-compat`, `@connextable/popbill-juso`를 사용합니다.

## 요구사항

- Node.js: [package.json](./package.json)의 `engines.node` 지원 범위

## 설치

```sh
npm install @connextable/popbill-utils
```

## 사용 예시

선택 문자열을 정리할 때 공백을 제거하고 빈 문자열을 `undefined`로 바꿉니다.

```ts
import { normalizeOptionalString } from '@connextable/popbill-utils'

const managementKey = normalizeOptionalString('  DOCUMENT-001  ') // 'DOCUMENT-001'
const emptyValue = normalizeOptionalString('   ') // undefined
```

## 제공 기능

- 응답 값: `parseSafeInteger`, `preserveNumericCode`, `preserveBooleanResponse`, `optionalResponseNumber`
- 객체 정리: `removeUndefinedProperties`, `compactOptionalObject`
- 날짜 검증: `isValidDate8`은 `yyyyMMdd` 형식을, `isValidCalendarDate8`은 실제 달력상 유효한 날짜까지 확인합니다.
- 제한시간 검증: `isValidTimeoutMilliseconds`는 `1`부터 `MAX_TIMEOUT_MILLISECONDS`(`2147483647`)까지의 정수 밀리초만 허용합니다.
- 파일명 이스케이프: `escapeMultipartFileName`은 multipart 파일명의 줄바꿈·큰따옴표를 이스케이프합니다. 경로에서 파일명만 추출하지는 않습니다.
- 콜백 호출: `invokeUserCallback`은 사용자 콜백의 동기 예외·Promise 거부가 원래 작업 결과를 바꾸지 않도록 처리합니다.
- 문자열 정규화·입력 검증·JSON 직렬화·해시·HMAC·에러 정규화

외부 응답의 새 코드·미확정 플래그를 유지하려면 `preserveNumericCode`·`preserveBooleanResponse`를 사용합니다. 출력에 쓸 수 있는 `ProviderNumericCode`, `ProviderBoolean` 타입도 내보냅니다. `toBoolean`은 값을 boolean으로 강제 변환하며 미확정 원문을 보존하지 않습니다.

`removeUndefinedProperties`는 객체의 최상위 `undefined` 필드만 제거하고 `null`·빈 문자열·`false`·`0`은 보존합니다. `compactOptionalObject`는 그렇게 정리한 객체에 필드가 없으면 `undefined`를 반환합니다. `stringifyWithoutEmptyValues`는 JSON 직렬화 중 객체의 `null`·빈 문자열 필드도 제거하므로 객체 정리 함수와 구분해 사용합니다. 배열에서는 제거 대상 값의 자리를 `null`로 유지합니다.

## 관련 문서

- [저장소와 패키지 선택](../../README.md)
- [공개 함수 소스](./src/index.ts)
