const express = require('express');
var path = require('path');

var router = express.Router();

router.get('/', (req, res) => {
    res.render('index', { title: 'Express' });
});

module.exports = router;