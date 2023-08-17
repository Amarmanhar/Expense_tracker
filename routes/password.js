const expense = require('express');
const router = expense.Router();

const passwordController = require('../contoller/password');

router.get('/resetpassword/:id', passwordController.resetPassword);
router.get('/updatepassword/:id', passwordController.updatePassword);
router.post('/forget-password', passwordController.forgetPassword );



module.exports= router;