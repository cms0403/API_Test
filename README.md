# JWT(JSON WEB TOKEN)
웹 애플리케이션에서 인증과 정보 교환을 위해 사용되는 토큰 기반의 인증 방식. 이 토큰은 JSON 형식으로 인코딩되어 있으며, 클라이언트와 서버 간의 안전한 통신을 가능하게 합니다.

# 설치 모듈
npm install express jsonwebtoken

# API_Test
1. `getAPI.js` 파일:

   - `/` 경로에 대한 GET 요청을 처리하여 `index.html`을 응답합니다.
   - `/user` 경로에 대한 미들웨어 `authmiddleware.js`를 사용합니다.
   - `/user` 경로에 대한 라우터 `userDB.js`를 사용합니다.
   - `/token` 경로에 대한 POST 요청을 처리하여 JWT 토큰을 발급합니다.
   - `/tokencheck` 경로에 대한 GET 요청을 처리하여 토큰의 유효성을 검사합니다.

2. `userDB.js` 파일:

   - `mssql` 모듈과 데이터베이스 연결을 위한 설정 파일(`db_pool_config.json`)을 사용합니다.
   - MSSQL 데이터베이스와 연결합니다.(Pool)
   - `/` 경로에 대한 GET 요청을 처리하여 전체명단을 조회합니다.
   - `/:code` 경로에 대한 GET 요청을 처리하여 해당 학번 학생을 조회합니다.
   - `/put/code/:code/birth/:birth` 경로에 대한 PATCH 요청을 처리하여 해당학번의 생일을 업데이트합니다.
   - `/code/:code/name/:name` 경로에 대한 DELETE 요청을 처리하여 해당학번과 이름을 가진 데이터를 삭제합니다.
   - 주석 처리된 프로시저 사용 코드는 데이터베이스의 프로시저를 사용하여 작업을 수행하는 예시입니다.

3. `authmiddleware.js` 파일:

   - JWT 토큰의 유효성을 검사하는 미들웨어입니다.
   - 요청 헤더에서 `token` 값을 가져옵니다.
   - 토큰이 존재하지 않으면 403 Forbidden 상태와 함께 에러 응답을 반환합니다.
   - 토큰이 존재하는 경우, `jsonwebtoken.verify` 함수를 사용하여 토큰의 유효성을 검사합니다.
   - 토큰이 유효하면 `request.tokenInfo`에 해독된 토큰 정보를 저장하고, 다음 미들웨어로 제어를 넘깁니다.
   - 토큰이 유효하지 않은 경우 403 Forbidden 상태와 함께 에러 응답을 반환합니다.

이렇게 작성된 코드는 Express를 사용하여 API 서버를 구성하고, JWT 토큰을 발급하고 검증하는 기능을 제공합니다. 
`userDB.js` 파일은 데이터베이스와 관련된 라우팅을 처리하며, `authmiddleware.js` 파일은 토큰 인증을 위한 미들웨어 역할을 합니다. 
`getAPI.js` 파일은 서버를 생성하고 라우터를 설정하여 API를 구축하고 서버를 실행하는 역할을 합니다.

# SWAGGER
swagger 를 이용하여 API에 대한 테스트 및 가이드 페이지를 추가하였습니다.
/api-docs 경로를 통해 확인 가능합니다.

swagger 내에서 API 테스트를 진행하기 위해서 통신 할때 토큰검증하는 authmiddleware.js 부분을 주석처리 하였습니다.
