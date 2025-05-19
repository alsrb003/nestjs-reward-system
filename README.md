
# 백엔드 과제


## 로컬 실행 방법

1. 의존성 설치 (최초 1회)

```bash
npm install
```

2. NestJS 서버 실행

```bash
npm run start
```

또는 개발 모드 실행 (파일 변경 시 자동 반영):

```bash
npm run start:dev
```

> 기본 실행 포트: [http://localhost:3000]

---


## API 테스트

프로젝트 루트에는 Postman 테스트용 컬렉션 파일이 포함되어 있습니다.

- 파일명: `NestJS_Reward_API.postman_collection.json`
- 사용법:
  1. Postman 열기
  2. Import > File > 해당 JSON 파일 선택
  3. 환경변수 `baseUrl`, `adminToken`, `userToken` 등을 미리 설정하고 실행

> 예시:
> - `baseUrl`: http://localhost:3000
> - `adminToken`: 로그인 후 발급받은 관리자 토큰
> - `userToken`: 로그인 후 발급받은 사용자 토큰

---


## docker-compose 실행 방법

### 최초 실행
docker-compose up --build

### 백그라운드 실행
docker-compose up -d

### 종료
docker-compose down

### 관련 파일
- docker-compose.yml
- Dockerfile

---


## 해당 기능 개요

### 확인/ 기본 사용자

* JWT 를 이용하여 userId / username / role 등의 payload 구성
* USER / OPERATOR / ADMIN / AUDITOR role 구분

### 이벤트 & 보상

* [OPERATOR, ADMIN] 이벤트/보상 등록 가능
* Event 는 conditionType + conditionValue 바탕으로 가능
* 보상은 Event에 반대의 reward 배열·종류와 연결

### 사용자 보상 요청

* 사용자가 해당 eventId / rewardId 로 요청
* checkCondition() 조건 설정 가능
* 요청은 DB에 "status" 형태로 APPROVED / REJECTED 저장

### 요청 이력

* USER 는 보상요청 이력 받기
* ADMIN, AUDITOR 는 전체 요청사항 조회 가능 (filter: eventId, status, userId)

---


## 사용 방법

### 회원가입

```json
POST /auth/register
{
  "userId": "user01",
  "username": "홍길동",
  "password": "pass1234",
  "role": "USER" // role 값이 없는 경우, 'USER'로 설정
}
```

### 로그인

```json
POST /auth/login
{
  "userId": "user01",
  "password": "pass1234"
}
```

### 이벤트 등록

```json
POST /event (OPERATOR/ADMIN)
{
  "name": "출석 이벤트",
  "description": "로그인 3일 이상",
  "conditionType": "LOGIN_COUNT",
  "conditionValue": 3,
  "startDate": "2024-05-20",
  "endDate": "2024-05-31"
}
```

### 보상 등록

```json
POST /reward (OPERATOR/ADMIN)
{
  "eventId": "6652abc...",
  "name": "100포인트",
  "type": "POINT",
  "quantity": 100
}
```

### 보상 요청 (USER)

```json
POST /request
Headers: Authorization: Bearer <access_token>
{
  "eventId": "6652abc...",
  "rewardId": "6653def..."
}
```

### 유저저 요청 이력 조회

```http
GET /request
Headers: Authorization: Bearer <access_token>
```

### 개발자가 전체 요청 조회

```http
GET /admin/requests
Headers: Authorization: Bearer <admin_token>
Optional Query: ?status=APPROVED&eventId=...
```

---


## 기타

* 조건 충족되는 경우, 유저가 보상 요청시 해당 보상 자동 지급
* 조건 검사 함수 checkCondition() 커스터마이즈 가능

---


## 파일 구성

```
src/
├─ auth/                 # 인증 및 로그인 관련 모듈
│   ├─ auth.controller.ts      # 로그인 및 회원가입 API
│   ├─ auth.module.ts          # 인증 모듈 구성
│   ├─ auth.service.ts         # 사용자 인증 및 토큰 발급 로직
│   ├─ jwt-auth.guard.ts       # JWT 인증 가드
│   ├─ jwt.strategy.ts         # JWT 토큰 검증 전략
│   ├─ local-auth.guard.ts     # 로컬 로그인 인증 가드
│   └─ local.strategy.ts       # 사용자 ID/PW 검증 전략

├─ common/               # 공통 데코레이터 및 가드
│   ├─ decorators/roles.decorator.ts  # @Roles() 데코레이터 정의
│   └─ guards/roles.guard.ts          # Role 기반 접근 제어 가드

├─ db/                   # DB 초기화용 모듈 (선택)
│   ├─ schemas/db.schema.ts     # DB 초기값 관련 스키마
│   ├─ db.controller.ts         # DB 테스트용 API
│   ├─ db.module.ts             # DB 모듈
│   └─ db.service.ts            # 샘플/테스트 데이터 로딩 로직

├─ event/                # 이벤트 관리 모듈
│   ├─ schemas/event.schema.ts  # 이벤트 스키마 (조건 포함)
│   ├─ event.controller.ts      # 이벤트 등록 / 조회 API
│   ├─ event.module.ts          # 이벤트 모듈 구성
│   └─ event.service.ts         # 이벤트 등록, 조건 확인 로직

├─ request/              # 보상 요청 모듈 (유저/관리자)
│   ├─ schemas/request.schema.ts  # 요청 이력 스키마
│   ├─ request.controller.ts      # 요청 생성 및 조회 API
│   ├─ request.module.ts          # 요청 모듈 구성
│   └─ request.service.ts         # 요청 중복 체크, 조건 확인, 자동 보상 지급 로직

├─ reward/               # 보상 등록/관리 모듈
│   ├─ schemas/reward.schema.ts  # 보상 스키마
│   ├─ reward.controller.ts      # 보상 등록 / 조회 API
│   ├─ reward.module.ts          # 보상 모듈 구성
│   └─ reward.service.ts         # 보상 저장, 조회, 지급 처리

├─ users/                # 사용자 관리 모듈
│   ├─ schemas/users.schema.ts   # 사용자 스키마 (userId, username, role 등)
│   ├─ users.controller.ts       # 사용자 목록, 역할 변경 등 API
│   ├─ users.module.ts           # 사용자 모듈 구성
│   └─ users.service.ts          # 사용자 생성 / 조회 / 역할 변경 로직


```
