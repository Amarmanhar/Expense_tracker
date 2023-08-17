const express = require('express');
const sequelize = require('./util/database')
const bodyParser = require('body-parser');
const app = express();
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const fs = require('fs');
const path = require('path');

const UsersRouter = require('./routes/users');
const expenseRouter = require('./routes/expenses')
const OrderRouter = require('./routes/purchase');
const premiumFeatureRouter = require('./routes/premiumFeature');
const PasswordRouter = require('./routes/password');


const Users = require('./models/users');
const Expense = require('./models/expenses');
const Orders = require('./models/orders');
const Password = require('./models/Password');

const dotenv = require('dotenv');
// get config vars
dotenv.config();

const accessLogStream = fs.createWriteStream(
    path.join(__dirname,'access.log'),{flag: 'a'}
);


app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan('combined', { stream: accessLogStream}));
app.get('/', (req, res)=>{
    res.send('hello from serverrrrrr');
})

app.use('/add', UsersRouter);
app.use('/expense', expenseRouter);
app.use('/purchase', OrderRouter);
app.use('/premium', premiumFeatureRouter);
app.use('/password', PasswordRouter);

Users.hasMany(Expense);
Expense.belongsTo(Users);

Users.hasMany(Orders);
Orders.belongsTo(Users);

Users.hasMany(Password);
Password.belongsTo(Users);

sequelize.sync()
.then(()=>{
    app.listen( process.env. PORT ||8080, ()=>{
        console.log('server is running');
    })
})
.catch((err)=>{
    console.log(err);
})
