# DB_2020

코드 관련된 자세한 사항 & 개발환경 세팅은 https://mrw0119.tistory.com/136?category=938676 참고 ㄱㄱ<br><br>


## 1. 프론트엔드 페이지 추가 방법 (.../<path_name>)<br><br>

### 1. frontend/components/에 NewPage.vue를 추가한다.<br><br>

### 2. frontend/router/index.js 파일 열고 라우터를 설정한다.<br><br>

    import NewPage from '@/components/NewPage'
    ...
    export default new Router({
        routes: [
            {
                path: '/',
                name: 'IndexPage',
                component: IndexPage
            },

            {
                path: '/<path_name>',
                name: 'NewPage',
                component: NewPage
            }
        ]
    })
<br>

## 2. 프론트엔드 페이지에서 GET & POST 요청 방법<br><br>

### 1. 프론트엔드의 해당 부분에 다음과 같이 작성한다.<br><br>
    <script>
    ... some code ...

    // GET의 경우
    this.$http.get('/api/<path_name>')
        .then((res)=>{
            // res가 반환된 상태 메시지임.
            // GET 요청이 완료된 후 수행할 행동
        })
        .catch((err)=>{
            // err가 반환된 에러 메시지임.
            // 에러 났을시 수행할 행동
        })
    
    // POST의 경우
    this.$http.get('/api/<path_name>', data)
    // ... 이하 동일
<br>

### 2. backend/routes/에 <path_name>.js 파일을 만들고, 다음과 같이 작성한다.<br><br>

    // <path_name>.js
    // GET의 경우
    const express = require('express');
    const router = express.Router();

    router.get('/', function(req, res, next){
        res.json({
            //페이지와 함께 백엔드에서 리턴할 데이터를 json 형태로 작성
            });
    });

    module.exports = router;
<br>

### 3. backend/app.js 파일 열고, 다음과 같이 추가한다.<br><br>
    ...

    var indexRouter = require('./routes/index');
    var loginRouter = require('./routes/login');
    var signUpRouter = require('./routes/sign_up');
    
    var newPageRouter = require('./routes/<path_name>);

    ...

    app.use('/', indexRouter);
    app.use('/api/login', loginRouter);
    app.use('/api/sign_up', signUpRouter);

    app.use('/api/<path_name>', newPageRouter);
<br>

## 3. GET & POST 요청시에 DB 콜하는 법<br><br>

### 0. 위와 같이 그대로 수행하여 <path_name>.js 파일을 만들고, app.js 파일 수정한다.<br><br>

### 1. backend/scripts/Functions.js 에 DB 콜 함수들이 들어있으니 확인한다.<br><br>

### 2. <path_name>.js 파일 열고 다음과 같이 작성한다.<br><br>

    const express = require('express');
    const router = express.Router();
    const Functions = require('../scripts/Functions')

    router.post('/', function(req, res, next){
        // req.body는 POST요청에서 전송된 데이터임.
        var id = req.body.userid;
        var password = req.body.password;

        // Functions에서 필요한 함수를 콜하고, 다음과 같은 syntax로 작성
        Functions.user_sign_up(id, password, 'test', '0101111111', '1996-01-01', 'evaluator')
            .then((stat)=>{         // 수정 금지!!
                res.json({STAT: stat}); // 수정 금지!!
            });    // 수정 금지!!
    });

    module.exports = router;

<br>