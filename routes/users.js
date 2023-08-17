const express = require('express');
const router = express.Router();

const usersContoller = require('../contoller/users');
const expenseController = require('../contoller/expenses');
const Authentication = require('../middleware/auth');

router.post('/signUp', usersContoller.signUp);
router.post("/login", usersContoller.login);
router.get('/get-user',Authentication.Authenticate, usersContoller.isPremium);
router.get('/download', Authentication.Authenticate, expenseController.download);

module.exports = router;