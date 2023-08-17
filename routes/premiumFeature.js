const expense = require('express');
const router = expense.Router();
const premiumFeatureContoller = require('../contoller/premiumFeature');
const Authentication = require('../middleware/auth');

router.get('/showloaderBoard', Authentication.Authenticate, premiumFeatureContoller.getLeaderBoard);

module.exports = router;