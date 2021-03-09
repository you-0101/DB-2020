const express = require('express');
const router = express.Router();
const Functions = require('../scripts/Functions')

router.post('/', function(req, res, next){
    var id = req.body.userid;
    var password = req.body.password;
    Functions.user_sign_up(id, password, 'test', '0101111111', '1996-01-01', 'evaluator')
        .then((stat)=>{
            res.json({STAT: stat});
        });
});

module.exports = router;