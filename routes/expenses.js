const expense = require('express');
const router = expense.Router();
const expenseContoller = require('../contoller/expenses')
const Authentication = require('../middleware/auth');

router.post("/add-expenses", Authentication.Authenticate, expenseContoller.addExpense);
router.get("/get-expenses", Authentication.Authenticate, expenseContoller.getExpense);
router.delete('/delete-expense/:id', Authentication.Authenticate, expenseContoller.deleteExpense)

module.exports = router;