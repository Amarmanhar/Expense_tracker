const { json } = require('sequelize');
const Order = require('../models/orders');
const Razorpay = require('razorpay');
const userController = require('../contoller/users');
require('dotenv').config();


exports.purchasePremium = async (req, res) => {
    try {
        // Initialize the Razorpay instance with your key_id and key_secret
        // console.log("RAZORPAY_KEY_ID:", process.env.RAZORPAY_KEY_ID);
        // console.log("RAZORPAY_KEY_SECRET:", process.env.RAZORPAY_KEY_SECRET);

        const rzp = new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID,
            key_secret: process.env.RAZORPAY_KEY_SECRET,
        });

        const amount = 2500;
        rzp.orders.create({ amount, currency: "INR" }, (err, order) => {
            if (err) {
                throw new Error(JSON.stringify(err));
            }
            req.user.createOrder({ orderid: order.id, status: 'PENDING' }).then(() => {
                return res.status(201).json({ order , key_id : rzp.key_id, amount: amount});
            }).catch(err => {
                throw new Error(err)
            });
        });
    } catch (err) {
        console.log(err);
        res.status(403).json({ message: 'Something went wrong', error: err });
    }
}

exports.updateTransacionStatus =  async(req, res)=>{
    try{

    const userId = req.user;
    const {payment_id, order_id} = req.body;
    console.log(order_id);
    console.log(payment_id);

    const order = await Order.findOne({where : {orderid : order_id}});

    const promise1 =  order.update({ paymentid: payment_id, status: 'SUCCESSFUL'}) 
    const promise2 =  req.user.update({ ispremiumuser: true }) 

    Promise.all([promise1, promise2]).then(()=> {
        return res.status(202).json({sucess: true, message: "Transaction Successful", 
        // token: userController.generateToken(userId,undefined , true)
     });
    }).catch((error ) => {
        throw new Error(error)
    })

}catch(err){
    console.log(err);
}
}
