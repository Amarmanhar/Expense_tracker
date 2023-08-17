const Sequelize = require('sequelize');
const sequelize = require('../util/database');

const Users = sequelize.define('users',{
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    name:{
        type:Sequelize.STRING
    },
    email:{
        type: Sequelize.STRING,
        allowNull: false,
        unique: {
            args: true,
            msg: 'Email address already in use!'
        }
    },
    password:{
        type: Sequelize.STRING,
        allowNull:false
    },
    ispremiumuser:{
       type: Sequelize.BOOLEAN,
      allowNull: true,
    },
    totalExpense:{
        type: Sequelize.DOUBLE,
        defaultValue: 0
    }

})

module.exports = Users;