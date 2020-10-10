var express = require('express');
var router = express.Router();
var auth = require('./../apis/auth');
var userController = require('./../controllers/user_controller');

router.post('/register', auth.fnRegister, userController.register);
router.post('/login', auth.fnLogin, userController.login);

module.exports = router;