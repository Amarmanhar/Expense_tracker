const Users = require('../models/users');
const bcrypt = require('bcrypt');
const jwt  = require('jsonwebtoken');

exports.signUp = async(req, res)=>{
  
    try{

        const {name, email, password} = req.body;
        const hashPassword = await bcrypt.hash(password, 10);

        const users = await Users.create({name, email, password:hashPassword});
        res.status(200).json(users);

    }catch(err){
        if( err.name === 'SequelizeUniqueConstraintError'){
            res.status(400).json({ error: 'Email address already in use!' });
        }
        else{
            console.log(err);
            res.status(500).json({ error: 'Internal Server Error' });

        }
    }
}

exports.generateToken = (id,name, ispremiumuser)=>{
    return jwt.sign({userId : id, name: name, ispremiumuser}, "secretKey");
}

exports.login = async(req, res)=>{

    try{
    const {email, password} = req.body;

    const users = await Users.findOne({
        where :{
            email : email
        }
    });
    
    
    const isPasswordValid = await bcrypt.compare(password, users.password);
    if (!users) {
        res.status(401).json("email or phone Number is not found");
    } else if (!isPasswordValid) {
        res.status(401).json("wrong password");
    } else {
        res.status(200).json({message: "users logged in successfully",token: exports.generateToken(users.id, users.name, users.ispremiumuser)});
    }

   }catch(err){
     console.log(err);
   }

}
exports.isPremium = async( req, res)=>{
    try {
        // Assuming you have a middleware that extracts the user ID from the token and attaches it to the request object
        const userId = req.user.id

        // Fetch the user from the database
        const user = await Users.findByPk(userId);

        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }

        // Assuming you have an "ispremiumuser" property in the user model
        const isPremiumUser = user.ispremiumuser;

        res.status(200).json({ ispremiumuser: isPremiumUser });

    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}


   
