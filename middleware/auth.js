const Users = require('../models/users');
const jwt = require('jsonwebtoken');


exports.Authenticate = async(req, res, next)=>{
    
  try{
      
    const token = req.header("Authorization");
    const user = jwt.verify(token, "secretKey");
    
    const users =   await Users.findByPk(user.userId);
     req.user = users;
     next();

  }catch(err){
    console.log(err);
  }
}