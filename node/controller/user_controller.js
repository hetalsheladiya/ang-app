const UserModel = require('../models/user_model');
const UserTokenModel = require('../models/user_token_model');
const jwt = require('jsonwebtoken')
const AES_KEY = "tokensecrethere";

module.exports.userList = (err) => {
    return UserModel.find();
}
module.exports.register = (data, err) => {
   return UserModel(data).save();
}
module.exports.login = (data, err) => {    
    return UserModel.findOne(data);
}
module.exports.getForEmail = (data, err) => {
    return UserModel.findOne(data).select();
}
module.exports.updatePassword = async (userId, data, err) => {
    var result = await UserModel.findByIdAndUpdate(userId, data);
    if(result){
        return true;
    }   
    else{
        return err;
    }
}
module.exports.saveUserTokenData = async (userId, token, err) => {
    var checkUserToken = await UserTokenModel.findOne({userId: userId});
    var result;
    if(checkUserToken){
        return result = await UserTokenModel.updateOne({userId: userId}, {$set: {token: token}}, {new: true})
    }
    else{
        return result = await UserTokenModel({userId: userId, token: token}).save();
    }
}
module.exports.tokenRemove = async (token, err) => {
    var userObj = jwt.verify(token, AES_KEY);    
    return await UserTokenModel.updateOne({userId: userObj._id},{$set: {token: ""}}, {new: true})
}