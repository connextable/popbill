# @connextable/popbill-utils

Popbill SDK 패키지에서 공유하는 유틸리티 헬퍼 패키지입니다.

여러 SDK 패키지가 같은 정규화, 검증, JSON, crypto, 에러 헬퍼를 사용하기 때문에 별도 패키지로 배포합니다. 일반 애플리케이션 코드는 보통 이 패키지에 직접 의존하지 않습니다.

## 요구사항

- Node.js 20+

## 설치

```sh
npm install @connextable/popbill-utils
```

## 공개 표면

- cast 헬퍼
- crypto 헬퍼
- 에러 정규화 헬퍼
- JSON 직렬화 헬퍼
- 문자열 정규화 헬퍼
- 검증 헬퍼

## 사용 범위

공유 SDK 구현 코드에서 사용합니다. 애플리케이션의 Popbill 연동에는 `@connextable/popbill`, `@connextable/popbill-compat`, `@connextable/popbill-juso`를 우선 사용합니다.

## 관련 문서

- 저장소 가이드: [../../README.md](../../README.md)
- 패키지 소스: [./src](./src)
