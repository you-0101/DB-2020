const express = require('express');
const router = express.Router();

router.get('/', function(req, res, next){
    res.json({user: {
        'id': 'euidong9',
        'password': '1234',
        'name': '이의동'}});
});

module.exports = router;