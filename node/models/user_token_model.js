var mongoose = require('mongoose');

var userTokenData = mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },   
    deviceToken: {
        type: String,
        default: ''
    },
    token: {
        type: String,
        default: '',
        trim: true
    }
},{
    timestamps: true
    
});
var userTokenModel = module.exports = mongoose.model('users_token_data', userTokenData);