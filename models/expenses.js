const Sequelize = require('sequelize');
const seqelize = require("../util/database");

const Expenses = seqelize.define('expenses', {
    
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    amount:{
        type:Sequelize.FLOAT
    },
    description:{
        type: Sequelize.STRING,
        allowNull: false,
       
    },
    category:{
        type: Sequelize.STRING,
        allowNull:false
    }
})

module.exports = Expenses;