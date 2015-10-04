var express = require('express');
var router = express.Router();

router.get('/', express.static('/webserver/app'));

module.exports = router;
