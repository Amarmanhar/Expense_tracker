const Sequelize = require('sequelize');
const sequelize = require('../util/database');

const Order = sequelize.define('orders', {
    id:{
        type:Sequelize.INTEGER,
        primaryKey : true,
        autoIncrement :true,
        alloNull: false
    },
    paymentid: Sequelize.STRING,
    orderid: Sequelize.STRING,
    status: Sequelize.STRING

})

module.exports = Order;