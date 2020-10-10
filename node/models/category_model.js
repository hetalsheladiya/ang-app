var mongoose = require('mongoose');

var CategorySchema = mongoose.Schema({
    name: {type: String, default: ''},
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
},{
    timestamps: true
})
module.exports = mongoose.model('Category', CategorySchema, 'category');