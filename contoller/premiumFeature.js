const Users = require('../models/users');
const Expenses = require("../models/expenses");
const sequelize = require('../util/database');

exports.getLeaderBoard = async(req, res)=>{

    try{
         
        const leaderboardData = await Users.findAll({
            attributes: ['id', 'name', 'totalExpense'],
            order:[['totalExpense', 'DESC']]

        });
       // console.log(leaderboardData);
        res.status(200).json(leaderboardData);

    }catch(err){
        console.log(err);
    }
}