const Users = require('../models/users');
const Password = require('../models/Password');
const Sib =  require('sib-api-v3-sdk');
const uuid = require('uuid');
const bcrypt = require('bcrypt');

require('dotenv').config();


exports.forgetPassword = async (req, res) => {

    var defaultClient = Sib.ApiClient.instance;

    var apiKey = defaultClient.authentications['api-key'];
    apiKey.apiKey = process.env.API_KEY;

    const { email } = req.body;
    const user = await Users.findOne({ where: { email: email } });

    if (!user) {
        res.status(404).json('Email is not Registered');
        return; // Return here to prevent further execution
    }

    const id = uuid.v4();
    // user.createForgotpassword({ id , active: true })
     await Password.create({ id, userId: user.id, active: true });

    const sender = { name: "Amar Manhar", email: "nkamar1412@gmail.com" };
    const to = [{ email: email }];
    const subject = "Reset Your Password";
    const htmlContent = `<a href="http://localhost:8080/password/resetpassword/${id}">Reset password</a>`;

    const apiInstance = new Sib.TransactionalEmailsApi();
    const sendSmtpEmail = new Sib.SendSmtpEmail();
    sendSmtpEmail.sender = sender;
    sendSmtpEmail.to = to;
    sendSmtpEmail.subject = subject;
    sendSmtpEmail.htmlContent = htmlContent;

    try {
         await apiInstance.sendTransacEmail(sendSmtpEmail);
        res.status(200).json('Reset password link has been sent');
    } catch (err) {
        console.log(err);
        res.status(500).json("Failed to send reset password link");
    }
};


exports.resetPassword = async(req, res)=>{
     
    const id = req.params.id;
    console.log('ID is :-- ', id);
    const forgetPasswordRequest = await Password.findOne({where :{id }});
    if( forgetPasswordRequest){
        forgetPasswordRequest.update({active:false});
    }
    const html = `
        <html>
            <script>
                function formsubmitted(e){
                    e.preventDefault();
                    console.log('called')
                }
            </script>

            <form action="http://localhost:8080/password/updatepassword/${id}" method="get">
                <label for="newpassword">Enter New password</label>
                <input name="newpassword" type="password" required></input>
                <button>reset password</button>
            </form>
        </html>
    `;

    res.status(200).send(html);

    res.end();
};

exports.updatePassword = async (req, res)=>{
    
    try {
        const { newpassword } = req.query;
        const { id } = req.params; // Use 'id' instead of 'resetpasswordId'

        const resetpasswordrequest = await Password.findOne({ where: { id } }); // Use 'id' here as well

        const user = await Users.findOne({ where: { id: resetpasswordrequest.userId } });

        if (user) {
            const hashPassword = await bcrypt.hash(newpassword, 10);
            await user.update({ password: hashPassword });
            res.status(200).json("password reset successfully");
        } else {
            res.status(500).json({ error: 'No user Exists', success: false });
        }
    } catch (err) {
        console.log(err);
    }
};
