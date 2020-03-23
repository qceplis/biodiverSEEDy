const express = require('express');
var router = express.Router();

router.use('/users', require('./userController'));
router.use('/posts', require('./postController'));

