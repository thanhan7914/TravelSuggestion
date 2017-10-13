const express = require('express');
const router = express.Router();

router.get('/', function(req , res) {
    res.end('Travel Suggestion v1.0.0');
});

module.exports = router;
