var Category = require('../models/category_model');

module.exports.categoryList = (userId, err) => {
    return Category.find({userId: userId});
}
module.exports.saveCategory = (data, err) => {
    if(data){
        return Category(data).save();
    }
    else{
        return err;
    }
}
module.exports.getCategory = (categoryId, err) => {
    return Category.findById(categoryId);
}
module.exports.getCategoryListWithOutCurrentId = (categoryId, err) => {
    return Category.find({_id: {$nin: categoryId}})
}
module.exports.updateCategory = (categoryId, name, err) => {
    return Category.findByIdAndUpdate(categoryId, {$set: {name: name}},{new: true});
}
module.exports.deleteCategory = (categoryId, err) => {
    return Category.findByIdAndDelete(categoryId);
}
module.exports.countCategoryName = (name, err) => {
    return Category.where('name').equals(name);    
}
module.exports.countCategoryNameWithId = (name, categoryId, err) => {
    return Category.find({name: name, _id: {$nin: categoryId}});  
}
// random fetch aggregate([{$sample: {size: 5}}]);