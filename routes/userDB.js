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

router.get('/', async (request, response) => {
    try{
        const query = await pool; //Query 실행을 위한 Pool 지정
        const result = await query.request() //Query 요청
            .query("SELECT UM_USER_CODE, UM_USER_NM FROM PRACTICE_USER_MAS WHERE UM_USE_YN = 'Y'");
        response.json(result.recordset); //Response에 결과값을 포함하여 전달
    }catch(err){
        response.status(500); //에러 발생시 Response 상태를 서버에러인 500에러로 세팅
        response.send(err.message); //에러 발생시 Response에 서버에러 내용 포함 전달
    }
});

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

router.patch('/patch/code/:code/birth/:birth', async (request, response) => {
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
})

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


//프로시저 사용 
// router.get('/proc/:code', async function(request, response) {
//     try {
//         const query = await pool;
//         const result = await query.request()
//             .input('MEM_CD', mssql.Numeric, parseInt(request.params.code))
//             .execute("SELECT_PUM");
//         response.json(result.recordset);
//     } catch (error) {
//         response.status(500);
//         response.send(error.message);
//     }
// });

// router.get('/proc/age/:age/gender/:gender', async function(request, response) {
//     try {
//         const query = await pool;
//         const result = await query.request()
//             .input('USER_AGE', mssql.Numeric, request.params.age)
//             .input('USER_GENDER', mssql.NVarChar, request.params.gender)
//             .execute("SELECT_PUM_AGE_GENDER");
//         response.json(result.recordset);
//     } catch (error) {
//         response.status(500);
//         response.send(error.message);
//     }
// });

module.exports = router;