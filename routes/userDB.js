const express = require('express');
const router = express.Router();
const mssql = require('mssql');
const config = require('../config/db_pool_config.json');

const pool = new mssql.ConnectionPool(config)
    .connect()
    .then(pool => {
        console.log('Connected to MSSQL In UserDB')
        return pool
    })
    .catch(err => 
        console.log('Database Connection Failed! Bad Config: ', err)
    )
/**
* @swagger
* paths:
*  /user:
*    get:
*      summary: "모든학생 학번 이름 조회"
*      description: "데이터에 저장되어있는 모든학생의 학번과 이름을 조회한다."
*      tags: [Users]
*      responses:
*        "200":
*          description: 전체 학생 정보
*          content:
*            application/json:
*              schema:
*                type: array
*                items:
*                  type: object
*                  properties:
*                    UM_USER_CODE:
*                      type: integer
*                      example: 1
*                    UM_USER_NM:
*                      type: string
*                      example: "유저1"
*                example:
*                  - UM_USER_CODE: 1
*                    UM_USER_NM: "유저1"
*                  - UM_USER_CODE: 2
*                    UM_USER_NM: "유저2"
*                  - UM_USER_CODE: 3
*                    UM_USER_NM: "유저3"

 */

router.get('/', async (request, response) => {
    try{
        const query = await pool; //Query 실행을 위한 Pool 지정
        const result = await query.request() //Query 요청
            .query("SELECT UM_USER_CODE, UM_USER_NM FROM PRACTICE_USER_MAS WHERE UM_USE_YN = 'Y' ORDER BY UM_USER_CODE ASC");
        response.json(result.recordset); //Response에 결과값을 포함하여 전달
    }catch(err){
        response.status(500); //에러 발생시 Response 상태를 서버에러인 500에러로 세팅
        response.send(err.message); //에러 발생시 Response에 서버에러 내용 포함 전달
    }
});

/**
* @swagger
* paths:
*  /user/{code}:
*    get:
*      summary: "학번에 맞는 학생 조회"
*      description: "검색한 학번에 대한 정보를 조회한다."
*      tags: [Users]
*      parameters:
*         - in: path
*           name: code
*           description: "조회할 학번"
*           required: true
*           schema:
*             type: integer
*           example: 1
*      responses:
*        "200":
*          description: "조회할 학번의 학생 정보"
*          content:
*            application/json:
*              schema:
*                type: array
*                items:
*                  type: object
*                  properties:
*                    UM_USER_CODE:
*                      type: integer
*                      example: 1
*                    UM_USER_NM:
*                      type: string
*                      example: "유저1"
*                    UM_USER_AGE:
*                      type: integer
*                      example: 27
*                    UM_USER_GENDER:
*                      type: string
*                      example: "M"
*                    UM_USER_BIRTH:
*                      type: integer
*                      example: 970403
*                    UM_USER_CEL:
*                      type: string
*                      example: "010-1234-5678"
*                    UM_REG_DT:
*                      type: date
*                      example: "2022-12-21 T10:09:00.000Z"
*                    UM_USE_YN:
*                      type: string
*                      example: "Y"
*                example:
*                  - UM_USER_CODE: 1
*                    UM_USER_NM: "유저1"
*                    UM_USER_AGE: 27
*                    UM_USER_GENDER: "M"
*                    UM_USER_BIRTH: 970403
*                    UM_USER_CEL: "010-1234-5678"
*                    UM_REG_DT: "2022-12-21 T10:09:00.000Z"
*                    UM_USE_YN: "Y"
 */

router.get('/:code', async (request, response) => {
    try {
        const query = await pool;
        const result = await query.request()
            .input('CODE', request.params.code)
            .query("SELECT * FROM PRACTICE_USER_MAS WHERE UM_USER_CODE = @CODE AND UM_USE_YN = 'Y'");
        response.json(result.recordset[0]);
    } catch (error) {
        response.status(500);
        response.send(error.message);
    }
});

/**
* @swagger
* paths:
*  /user/code/{code}/birth/{birth}:
*    patch:
*      summary: "생년월일 수정"
*      description: "해당 학번의 생년월일을 수정한다."
*      tags: [Users]
*      parameters:
*         - in: path
*           name: code
*           description: "수정할 학번"
*           required: true
*           schema:
*             type: integer
*           example: 1
*         - in: path
*           name: birth
*           description: "수정할 생년월일"
*           required: true
*           schema:
*             type: integer
*           example: 970404
*      responses:
*        "200":
*          description: "수정 완료(rowsAffected : [1])"
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  recordsets:
 *                    type: array
 *                    items: {}
 *                    example: []
 *                  output:
 *                    type: object
 *                    example: {}
 *                  rowsAffected:
 *                    type: array
 *                    items:
 *                      type: integer
 *                    example: [1]
*        "500":
*          description: "수정 오류(rowsAffected : [0])"
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  recordsets:
 *                    type: array
 *                    items: {}
 *                    example: []
 *                  output:
 *                    type: object
 *                    example: {}
 *                  rowsAffected:
 *                    type: array
 *                    items:
 *                      type: integer
 *                    example: [0]
 */
router.patch('/code/:code/birth/:birth', async (request, response) => {
    try {
        const query = await pool;
        const result = await query.request()
            .input('CODE', request.params.code)
            .input('BIRTH', request.params.birth)
            .query("UPDATE PRACTICE_USER_MAS SET UM_USER_BIRTH = @BIRTH WHERE UM_USER_CODE = @CODE")
        response.send(result);
    } catch (error) {
        response.status(500);
        response.send(error.message);
    }
});

/**
* @swagger
* paths:
*  /user/name/{name}/age/{age}/gender/{gender}:
*    post:
*      summary: "학생 추가"
*      description: "작성한 데이터의 학생을 DB에 추가한다."
*      tags: [Users]
*      parameters:
*         - in: path
*           name: name
*           description: "추가할 학생 이름"
*           required: true
*           schema:
*             type: string
*           example: "도레미"
*         - in: path
*           name: age
*           description: "추가할 학생 생년월일"
*           required: true
*           schema:
*             type: integer
*           example: 970404
*         - in: path
*           name: gender
*           description: "추가할 학생 성별"
*           required: true
*           schema:
*             type: string
*           example: "M"
*      responses:
*        "200":
*          description: "추가 완료(rowsAffected : [1])"
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  recordsets:
 *                    type: array
 *                    items: {}
 *                    example: []
 *                  output:
 *                    type: object
 *                    example: {}
 *                  rowsAffected:
 *                    type: array
 *                    items:
 *                      type: integer
 *                    example: [1]
 *                  returnValue:
 *                    type: array
 *                    items:
 *                      type: integer
 *                    example: 0
*        "500":
*          description: "추가 오류(rowsAffected : [0])"
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  recordsets:
 *                    type: array
 *                    items: {}
 *                    example: []
 *                  output:
 *                    type: object
 *                    example: {}
 *                  rowsAffected:
 *                    type: array
 *                    items:
 *                      type: integer
 *                    example: [0]
 *                  returnValue:
 *                    type: array
 *                    items:
 *                      type: integer
 *                    example: 0
 */
//프로시저 사용
router.post('/name/:name/age/:age/gender/:gender', async (request, response) => {
    try {
        const query = await pool;
        const result = await query.request()
            .input('USER_NAME', mssql.NVarChar, request.params.name)
            .input('USER_AGE', mssql.Numeric, request.params.age)
            .input('USER_GENDER', mssql.NChar, request.params.gender)
            .execute("INSERT_PUM_USER");
        response.send(result);
    } catch (error) {
        response.status(500);
        response.send(error.message);
    }
});

/**
* @swagger
* paths:
*  /user/code/{code}/name/{name}:
*    delete:
*      summary: "학생 삭제"
*      description: "해당 학번과 이름을 가진 학생데이터 삭제"
*      tags: [Users]
*      parameters:
*         - in: path
*           name: code
*           description: "삭제할 학생 학번"
*           required: true
*           schema:
*             type: integer
*           example: "22"
*         - in: path
*           name: name
*           description: "삭제할 학생 이름"
*           required: true
*           schema:
*             type: string
*           example: "살려주세요"
*      responses:
*        "200":
*          description: "삭제 완료"
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  recordsets:
 *                    type: array
 *                    items: {}
 *                    example: []
 *                  output:
 *                    type: object
 *                    example: {}
 *                  rowsAffected:
 *                    type: array
 *                    items:
 *                      type: integer
 *                    example: [1]
*        "500":
*          description: "삭제 오류"
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  recordsets:
 *                    type: array
 *                    items: {}
 *                    example: []
 *                  output:
 *                    type: object
 *                    example: {}
 *                  rowsAffected:
 *                    type: array
 *                    items:
 *                      type: integer
 *                    example: [0]
 */
router.delete('/code/:code/name/:name', async (request, response) => {
    try {
        const query = await pool;
        const result = await query.request()
            .input('CODE', request.params.code)
            .input('NAME', request.params.name)
            .query("DELETE FROM PRACTICE_USER_MAS WHERE UM_USER_CODE = @CODE AND UM_USER_NM = @NAME")
        response.send(result);
    } catch (error) {
        response.status(500);
        response.send(error.message);
    }
})

module.exports = router;