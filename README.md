# JWT(JSON WEB TOKEN)
웹 애플리케이션에서 인증과 정보 교환을 위해 사용되는 토큰 기반의 인증 방식. 이 토큰은 JSON 형식으로 인코딩되어 있으며, 클라이언트와 서버 간의 안전한 통신을 가능하게 한다.

# 설치 모듈
npm install express jsonwebtoken method-override

# API_Test
1. `getAPI.js` 파일:

   - 서버를 생성하고, `method-override` 미들웨어를 사용합니다.
   - 라우터를 설정합니다.
   - `/` 경로에 대한 GET 요청을 처리하여 정적 파일 `index.html`을 응답합니다.
   - `/user` 경로에 대한 미들웨어 `authmiddleware.js`를 사용합니다.
   - `/user` 경로에 대한 라우터 `userDB.js`를 사용합니다.
   - `/token` 경로에 대한 POST 요청을 처리하여 JWT 토큰을 발급합니다.
   - `/tokencheck` 경로에 대한 GET 요청을 처리하여 토큰의 유효성을 검사합니다.
   - 서버를 실행하고 해당 포트에서 수신 대기합니다.

2. `userDB.js` 파일:

   - `mssql` 모듈과 데이터베이스 연결을 위한 설정 파일(`db_pool_config.json`)을 사용합니다.
   - MSSQL 데이터베이스와 연결되는 연결 풀(`pool`)을 생성합니다.
   - `/` 경로에 대한 GET 요청을 처리하여 `PRACTICE_USER_MAS` 테이블에서 `UM_USE_YN`이 'Y'인 레코드를 조회합니다.
   - `/:code` 경로에 대한 GET 요청을 처리하여 `UM_USER_CODE`가 `:code`와 일치하고 `UM_USE_YN`이 'Y'인 레코드를 조회합니다.
   - `/put/code/:code/birth/:birth` 경로에 대한 PUT 요청을 처리하여 `UM_USER_CODE`가 `:code`와 일치하는 레코드의 `UM_USER_BIRTH` 값을 `:birth`로 업데이트합니다.
   - `/code/:code/name/:name` 경로에 대한 DELETE 요청을 처리하여 `UM_USER_CODE`가 `:code`와 일치하고 `UM_USER_NM`이 `:name`과 일치하는 레코드를 삭제합니다.
   - 주석 처리된 프로시저 사용 코드는 데이터베이스의 프로시저를 사용하여 작업을 수행하는 예시입니다.

3. `authmiddleware.js` 파일:

   - `SECRET_KEY`를 정의합니다.
   - `authMiddleware` 함수를 정의합니다. 이 함수는 JWT 토큰의 유효성을 검사하는 미들웨어입니다.
   - 요청 헤더에서 `token` 값을 가져옵니다.
   - 토큰이 존재하지 않으면 403 Forbidden 상태와 함께 에러 응답을 반환합니다.
   - 토큰이 존재하는 경우, `jsonwebtoken.verify` 함수를 사용하여 토큰의 유효성을 검사합니다.
   - 토큰이 유효하면 `request.tokenInfo`에 해독된 토큰 정보를 저장하고, 다음 미들웨어로 제어를 넘깁니다.
   - 토큰이 유효하지 않은 경우 403 Forbidden 상태와 함께 에러 응답을 반환합니다.

이렇게 작성된 코드는 Express를 사용하여 API 서버를 구성하고, JWT 토큰을 발급하고 검증하는 기능을 제공합니다. `userDB.js` 파일은 데이터베이스와 관련된 라우팅을 처리하며, `authmiddleware.js` 파일은 토큰 인증을 위한 미들웨어 역할을 합니다. `getAPI.js` 파일은 서버를 생성하고 라우터를 설정하여 API를 구축하고 서버를 실행하는 역할을 합니다.
