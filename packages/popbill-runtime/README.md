# @connextable/popbill-runtime

Popbill 및 Linkhub SDK 패키지에서 공유하는 런타임 클라이언트 패키지입니다.

이 패키지는 인증, 토큰, 요청 전송 primitive를 제공합니다. 일반 애플리케이션 코드는 보통 `@connextable/popbill`, `@connextable/popbill-compat`, `@connextable/popbill-juso`를 사용합니다.

## 요구사항

- Node.js 20+

## 설치

```sh
npm install @connextable/popbill-runtime
```

## 공개 표면

- `createLinkhubAuthClient`
- `createTokenProvider`
- `createLinkhubRequestClient`
- `createPopbillRequestClient`
- 공통 서비스 및 인증 상수

## 사용 범위

같은 생태계의 SDK 패키지나 transport adapter를 만들 때 사용합니다. 애플리케이션에서 API를 직접 호출하는 용도라면 상위 클라이언트 패키지를 우선 사용합니다.

## 관련 문서

- 저장소 가이드: [../../README.md](../../README.md)
- 패키지 소스: [./src](./src)
