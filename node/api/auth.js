var user = require('../controller/user_controller');
var md5 = require('md5');
var emailHelper = require('../helper/email');
const jwt = require('jsonwebtoken');
const AES_KEY = "tokensecrethere";
const moment = require('moment');

module.exports.fnRegister = async (req, res, next) => {
    var response = {
        status: 'error',
        msg: 'Something went wrong Please try again after sometime.',
        data: {}
    }
    try{
        var username = req.body.username;
        var email = req.body.email;
        var password = req.body.password;
        var emailRegEX = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;        
        username = (typeof username == 'string') ? username.trim() : "";
        email = (typeof email == 'string') ? email.trim() : "";
        password = (typeof password == 'string') ? password.trim() : "";        
        if(username == "" || username == null){
            response.msg = "Please provide username.";
            res.json(response);
        } 
        else if(email == "" || email == null){
            response.msg = 'Please provide email.';
            res.json(response);
        }
        else if(!emailRegEX.test(email)){
            response.msg = "Invalid email.";
            res.json(response);
        }        
        else if (password == "" || password == null){
            response.msg = "Please provide password";
            res.json(response);
        }
        else if(password.length < 6){
            response.msg = "Password must contain atleast 6 characters.";
            res.json(response);
        }
        else{   
            var list = await user.userList();
            if(list.length > 0){
                var flag = false;
                for (let i = 0; i < list.length; i++) {
                    const element = list[i];
                    if(element.email.toLowerCase() == email.toLowerCase()){
                        flag = true;
                    }
                }
                if(flag){
                    response.msg = 'Email already registerd with us. Please try with login.';
                    res.json(response);
                }
                else{
                    var userData = {
                        username: username,
                        email : email,
                        password: md5(password)
                    }
                    var result = await user.register(userData);
                    if(result && result._id){
                        response.status = 'success';
                        response.msg = "You are register successfully";
                        response.data = result;
                        res.json(response);
                    }
                    else{
                        response.msg = 'Error occured while registration.';
                        res.json(response);
                    }
                }
            }            
            else{       
                var userData = {
                    username: username,
                    email : email,
                    password: md5(password)
                }
                var result = await user.register(userData);
                if(result && result._id){
                    response.status = 'success';
                    response.msg = "Registration Complete. Please login to continue.";
                    response.data = result;
                    res.json(response);
                }
                else{
                    response.msg = 'Error occured while registration.';
                    res.json(response);
                }
            }
        }
    }
    catch(e){
        console.log('Error In ======> fnRegister =======>', e);
        res.json(response);
    }
}

module.exports.fnLogin = async(req, res) => {
    var response = {
        status: 'error',
        msg: 'Something went wrong Please try again after sometime.',
        data: {}
    }
    try{
        var email = req.body.email;
        var password = req.body.password;
        var emailRegEX = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        email = (typeof email == 'string') ? email.trim() : "";
        password = (typeof password == 'string') ? password.trim() : "";
        if(email == null || email == ""){
            response.msg = 'Please provide email.';
            res.json(response);
        }
        else if(!(emailRegEX.test(email))){
            response.msg = "Invalid email format.";
            res.json(response);
        }
        else if(password == "" || password == null){
            response.msg = 'Please provide password.';
            res.json(response);
        }
        else if(password.length < 6){
            response.msg = "Password must contain atleast 6 characters.";
            res.json(response);
        }
        else{            
            var list = await user.userList();
            if(list.length > 0){
                var flag = false;
                for (let i = 0; i < list.length; i++) {
                    const element = list[i];
                    if(element.email.toLowerCase() == email.toLowerCase()){
                        flag = true;
                        email = element.email;
                    }
                }
                if(flag){
                    var data = {
                        email: email,
                        password: md5(password)
                    }
                    var result = await user.login(data);
                    if(result && result._id){ 
                        var expires = moment().add(1, 'days').valueOf();                       
                        const token = jwt.sign({_id: result._id, exp: expires}, AES_KEY)
                        await user.saveUserTokenData(result._id, token);
                        response.status = 'success';
                        response.msg = 'You are successfully login with us.';
                        response.data = result;                                                                    
                        res.json(response);
                    }
                    else{
                        response.msg = 'Username or password incorrect.';
                        res.json(response);
                    }
                }
                else{
                    response.msg = 'You are not associated with us. Try with signup.';
                    res.json(response);
                }
            }
            else{
                response.msg = 'You are not associated with us. Try with signup.';
                res.json(response);
            }            
        }
    }
    catch(e){
        console.log('Error In ======> fnLogin =======>', e);
        res.json(response);
    }
}

module.exports.fnResetPassword = async (req, res) => {
    var response = {
        status: 'error',
        msg: 'Something went wrong .Please try again later.',
        data: {}
    }
    try{
        var userId = req.body.userId;
        var newpassword = req.body.newpassword;
        var confirmpassword = req.body.confirmpassword;
        newpassword = (typeof newpassword == 'string') ? newpassword.trim() : "";
        confirmpassword = (typeof confirmpassword == 'string') ? confirmpassword.trim(): "";
        if(userId == null || userId == ""){
            response.msg = 'Please provide user id.'
            res.json(response);
        }
        else if(newpassword == "" || newpassword == null){
            response.msg = "Please provide newpassword."
            res.json(response);
        }
        else if(newpassword.length < 6){
            response.msg = "Password must contain atleast 6 characters."
            res.json(response);
        }
        else if(confirmpassword == "" || confirmpassword ==  null){
            response.msg = "Please provide confirm password."
            res.json(response);
        }
        else if(newpassword != confirmpassword){
            response.msg = "New password and confirm password does not match."
            res.json(response);
        }
        else{            
            var data = {                
                password: md5(newpassword)
            }
            var result = await user.updatePassword(userId, data);
            if(result){
                response.status = 'success';
                response.msg = "Your password successfully updated.";
                response.data = result;
                res.json(response); 
            }
            else{
                response.msg = "Error while updating password."
                res.json(response);
            }           
        }
     }
    catch(e){
        console.log("Error =======> fnResetPassword =====>e", e);
        res.json(response);
    }
}
module.exports.fnChangePassword = async(req, res) => {
    var response = {
        status: 'error',
        msg: 'Something went wrong please try again later.',
        data: {}
    }
    try{

    }  
    catch(e){
        console.log("Error =======> fnChangePassword =====>e", e);
        res.json(response);
    }
}
module.exports.fnForgotPassword = async (req, res) => {
    var response = {
        status: 'error',
        msg: 'Something went wrong please try again later.',
        data: {}
    }
    try{
        var base_url = req.protocol + "://" + req.get('host') + "/";        
        var email = req.body.email;
        var emailRegEX = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        email = (typeof email == 'string') ? email.trim() : "";   
        if(email == "" || email == null){
            response.msg = "Please provide email.";
            res.json(response);
        }
        else if(!emailRegEX.test(email)){
            response.msg = "Invalid email format.";
            res.json(response);
        }
        else{
            var list = await user.userList();
            var flag = false;
            var userData = {};
            for (let i = 0; i < list.length; i++) {
                const element = list[i];
                if(element.email.toLowerCase() == email.toLowerCase()){
                    flag = true;
                    userData = element
                }
            }
            if(flag){
                var userId = userData._id;
                var username = userData.username;
                var body = "<html>"+
                                "<body>" + 
                                    "<table cellspacing=\"0\" cellpadding=\"0\" border=\"0\" style=\"color: #333;background: #fff;padding: 0;margin: 0;width: 100%;font: 15px 'Helvetica Neue', Arial, Helvetica\">"+
                                        "<tbody>"+
                                            "<tr width=\"100%\"> <td valign=\"top\" align=\"left\" style=\"font: 15px 'Helvetica Neue', Arial, Helvetica\">"+
                                                "<table style=\"border: none;padding: 0 18px;margin: 50px auto;width: 500px\">"+
                                                    "<tbody>"+
                                                        "<tr width=\"100%\" height=\"57\">"+
                                                            "<td valign=\"top\" align=\"left\" style=\"border-top-left-radius: 4px;border-top-right-radius: 4px;background: #0079BF;padding: 12px 18px;text-align: center\"><img src=\"http://simplifycm.com/assets/newlogo.png\" title=\"\" style=\"font-weight: bold;font-size: 18px;color: #fff;vertical-align: top;\"><h3 style=\"color: #fff;margin: 10px; display:inline-block;\">App name</h3>"+
                                                            "</td>"+                                                                            
                                                        "</tr>"+
                                                        "<tr width=\"100%\">"+
                                                            "<td valign=\"top\" align=\"left\" style=\"border-bottom-left-radius: 4px;border-bottom-right-radius: 4px;background: #f5f5f5;padding: 18px\">"+
                                                                "<h1 style=\"font-size: 20px;margin: 0;color: #333\"> Hello "+username+", </h1>"+
                                                                    "<p style=\"font: 15px/1.25em 'Helvetica Neue', Arial, Helvetica;color: #333\"> We’ve updated our security measures in order to keep your personal information secure. <br>"+
                                                                    "Please take a moment to reset your APPNAME password. <br>"+                                 
                                                                    "<p style=\"font: 15px/1.25em 'Helvetica Neue', Arial, Helvetica;margin-bottom: 0;text-align: center;color: #333\">"+
                                                                    "<a href=\""+base_url+"#/auth/verify-email/"+userId+"\" style=\"border-radius: 3px;-moz-border-radius: 3px;-webkit-border-radius: 3px;background: #e4b372;color: #fff;display: block;font-weight: 700;font-size: 16px;line-height: 1.25em;margin: 24px auto 24px;padding: 10px 18px;text-decoration: none;width: 180px;text-align: center\" rel=\"external nofollow noopener noreferrer\" target=\"_blank\" tabindex=\"-1\"> Reset your password </a> </p>"+
                                                                    "<p style=\"font: 15px/1.25em 'Helvetica Neue', Arial, Helvetica;color: #939393;margin-bottom: 0\"> - The CompanyName Team. "+
                                                                "</p>"+
                                                            "</td>"+
                                                        "</tr>"+
                                                    "</tbody>"+
                                                "</table>"+
                                                "</td>"+
                                            "</tr>"+
                                        "</tbody>"+
                                    "</table>"+                                                    
                                "</body>"+
                            "</html>";
                var result = await emailHelper.fnSendMail(email, "Appname - Reset password", body);
                console.log(result);
                if(result){
                    response.status = 'success';
                    response.msg = 'We sent you instruction for password reset on your registred email address. Please check that.';
                    res.json(response);
                }
                else{
                    response.msg = 'Error while mail sending.';
                    res.json(response);  
                }
            }
            else{
                response.msg = "Email does not exist.";
                res.json(response);
            }                    
        }
    }
    catch(e){
        console.log("Error ======> fnForgotPassword ====>", e);
        res.json(response);
    }
}
module.exports.fnLogout = async (req, res, next) => {
    var response = {
        status: 'error',
        msg: 'Something went wrong please try again later.',
        data: {}
    }
    try{
        var token = req.headers.authorization.split(" ")[1];
        if(token){
            // await user.tokenRemove(token);
            response.status = 'success';
            response.msg = "Logout successfully.";
            res.json(response);
        }
        else{
            response.msg = "Authentication not found.";
            res.json(response);
        }
    }  
    catch(e){
        console.log("Error =======> fnLogout =====>e", e);
        res.json(response);
    }
}
