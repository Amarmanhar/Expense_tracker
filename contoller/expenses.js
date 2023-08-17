const Expenses = require("../models/expenses");
const Users = require('../models/users');
const sequelize = require("../util/database");
const AWS = require('aws-sdk');
require('dotenv').config();

exports.addExpense = async(req, res)=>{
    const t = await sequelize.transaction();
    try {
        const { amount, description, category } = req.body;
        const result = await Expenses.create({
            amount,
            description,
            category,
            userId: req.user.id,
        }, { transaction: t });

        const totalExpenses = Number(req.user.totalExpense) + Number(result.amount);

        // Update the user's totalExpense within the same transaction
        await Users.update({ totalExpense: totalExpenses }, { where: { id: req.user.id }, transaction: t });

        await t.commit();

        res.status(200).json({ expense: result });
    } catch (err) {
        await t.rollback();
        console.log(err);
        res.status(500).json("Internal Error has happened");
    }

}

exports.download = async(req, res)=>{
   try{

    const expenses = await Expenses.findAll({
        where: { userId: req.user.id },
    });

    
     console.log(expenses);
     const stringyfyExpense = JSON.stringify(expenses);

     const userId = req.user.id;
     const filename = `Expense${userId}/${new Date()}.txt`;
     const fileUrl = await uploadToS3(stringyfyExpense, filename);
     res.status(200).json({fileUrl, success: true});
   }catch(err){
    console.log(err);
    res.status(500).json({fileUrl:'', success: false, err:err});
   }
}

function uploadToS3(data, filename){
    const BUCKET_NAME= process.env.BUCKET_NAME;
    const IAM_USER_KEY = process.env.IAM_USER_KEY;
    const IAM_USER_SECRET = process.env.IAM_USER_SECRET;

    let s3bucket = new AWS.S3({
        accessKeyId :IAM_USER_KEY ,
        secretAccessKey: IAM_USER_SECRET,
        Bucket: BUCKET_NAME

    });
    var params ={
        Bucket : BUCKET_NAME,
        Body: data,
        Key: filename,
        ACL: 'public-read'

    }
    return new Promise((resolve, reject)=>{
        s3bucket.upload(params, (err, s3response)=>{
            if(err){
                console.log('something is wrong');
                reject(err);
            }
            else{
               resolve(s3response.Location);
            }
        })
    })
   
}

exports.getExpense = async(req, res)=>{

try {
    const page = req.query.page ? parseInt(req.query.page) : 1;
    const limit = req.query.limit ? parseInt(req.query.limit) : 10;

    const offset = (page - 1) * limit;


    const totalCount = await Expenses.count(/*whereClause*/);

    const expenses = await Expenses.findAll({
        offset,
        limit,
    });

    const totalPages = Math.ceil(totalCount / limit);

    res.status(200).json({
        expenses,
        totalCount,
        totalPages
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: 'Internal Server Error' });
}
}

exports.deleteExpense = async(req, res)=>{
    const t = await sequelize.transaction();
    const Id = req.params.id;
    try {
        // Find the expense being deleted to retrieve its amount
        const expense = await Expenses.findOne({
            where: { id: Id, userId: req.user.id },
            transaction: t,
        });

        if (!expense) {
            res.status(404).json('This expense does not belong to you.');
            await t.rollback();
            return;
        }

        // Delete the expense
        await Expenses.destroy({
            where: { id: Id, userId: req.user.id },
            transaction: t,
        });

        // Update the user's totalExpense
        const totalExpense = Number(req.user.totalExpense) - Number(expense.amount);
        await Users.update(
            { totalExpense: totalExpense },
            { where: { id: req.user.id }, transaction: t }
        );

        // Commit the transaction since everything was successful
        await t.commit();

        res.status(200).json('Deleted');
    } catch (err) {
        console.log(err);
        // Rollback the transaction in case of an error
        await t.rollback();
        res.status(500).json('Internal Server Error');
    }
}