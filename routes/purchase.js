const express = require('express');
const router = express.Router();
const purchaseController = require('../contoller/purchase');
const Authentication = require('../middleware/auth');


router.get('/premiumMemberShip', Authentication.Authenticate, purchaseController.purchasePremium );
router.post('/updateTransactionStatus', Authentication.Authenticate, purchaseController.updateTransacionStatus);

module.exports = router;