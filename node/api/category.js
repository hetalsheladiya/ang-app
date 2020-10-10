var category = require('../controller/category_controller');

module.exports.fnCategoryList = async (req, res) => {
    var response = {
        status: 'error',
        msg: 'Something went wrong Please try again later.',
        data: {}
    }
    try{
        var userId = req.user._id;
        var result = await category.categoryList(userId);
        if(result){
            response.status = 'success';
            response.msg = "";
            response.data = result;
            res.json(response);
        }
        else{
            response.msg = "Error occured while getting category list.";
            res.json(response);
        }
    }
    catch(e){
        res.json(response);
        console.log("Error ======> fnCategoryList ======>",e);
    }
}

module.exports.fnAddCategory = async (req, res) => {
    var response = {
        status: 'error',
        msg: 'Something went wrong Please try again later.',
        data: {}
    }
    try{
        var name = req.body.name;
        var userId = req.user._id;
        if(name == '' || name == null){
            response.msg = "Please provide category.";
            res.json(response);
        }
        else{            
            var categoryList = await category.categoryList(userId);
            if(categoryList.length > 0){
                var flag = false;
                for (let i = 0; i < categoryList.length; i++) {
                    const element = categoryList[i];
                    if(element.name.toLowerCase() == name.toLowerCase()){
                        flag = true;
                    }
                }
                if(flag){
                    response.msg = "Category already exist.";
                    res.json(response);
                }
                else{
                    var categoryData = {
                        name: name,
                        userId: userId
                    }
                    var result = await category.saveCategory(categoryData);
                    if(result && result._id){
                        response.status = 'success';
                        response.msg = 'Category successfully created.';
                        response.data = result
                        res.json(response);
                    }
                    else{
                        response.msg = "Error occured while category creation.";
                        res.json(response);
                    }
                }
            }
            else{
                var categoryData = {
                    name: name,
                    userId: userId
                }
                var result = await category.saveCategory(categoryData);
                if(result && result._id){
                    response.status = 'success';
                    response.msg = 'Category successfully created.';
                    response.data = result
                    res.json(response);
                }
                else{
                    response.msg = "Error occured while category creation.";
                    res.json(response);
                }
            }
        }
    }
    catch(e){
        res.json(response);
        console.log("Error ======> fnSaveCategory ======>",e);
    }
}

module.exports.fnGetCategory = async (req, res) => {
    var response = {
        status: 'error',
        msg: 'Something went wrong Please try again later.',
        data: {}
    }
    try{
        var categoryId = req.body.categoryId;
        if(categoryId == null || categoryId == ''){
            response.msg = 'Please provide category id.';
            res.json(response);
        }
        else{
            var result = await category.getCategory(categoryId);
            if(result){
                response.status = 'success';
                response.msg = "";
                response.data = result;
                res.json(response);
            }
            else{
                response.msg = "Error occured while getting category.";
                res.json(response);
            }
        }
    }
    catch(e){
        res.json(response);
        console.log("Error ======> fnGetCategory ======>",e);
    }
}

module.exports.fnUpdateCategory = async (req, res) => {
    var response = {
        status: 'error',
        msg: 'Something went wrong Please try again later.',
        data: {}
    }
    try{
        var categoryId = req.body.categoryId,
            name = req.body.name;
        if(categoryId == null || categoryId == ''){
            response.msg = 'Please provide category id.';
            res.json(response);
        }
        else if(name == '' || name == null){
            response.msg = "Please provide category name.";
            res.json(response);
        }
        else{
            var categoryList = await category.getCategoryListWithOutCurrentId(categoryId);           
            if(categoryList.length > 0){
                var flag = false;
                for (let i = 0; i < categoryList.length; i++) {
                    const element = categoryList[i];
                    if(element.name.toLowerCase() == name.toLowerCase()){
                        flag = true;
                    }
                }
                if(flag){
                    response.msg = "Category already exist.";
                    res.json(response);
                }
                else{
                    var result = await category.updateCategory(categoryId, name);
                    if(result){
                        response.status = 'success';
                        response.msg = 'Category successfully updated.';
                        response.data = result;
                        res.json(response);
                    }
                    else{
                        response.msg = 'Error occured while updating category';
                        res.json(response);
                    }
                }
            }
            else{
                var result = await category.updateCategory(categoryId, name);
                if(result){
                    response.status = 'success';
                    response.msg = 'Category successfully updated.';
                    response.data = result;
                    res.json(response);
                }
                else{
                    response.msg = 'Error occured while updating category';
                    res.json(response);
                }
            }
        }
    }
    catch(e){
        res.json(response);
        console.log("Error ======> fnUpdateCategory ======>",e);
    }
}

module.exports.fnDeleteCategory = async (req, res) => {
    var response = {
        status: 'error',
        msg: 'Something went wrong Please try again later.',
        data: {}
    }
    try{
        var categoryId = req.body.categoryId,
            name = req.body.name;
        if(categoryId == null || categoryId == ''){
            response.msg = 'Please provide category id.';
            res.json(response);
        }
        else{
            var result = await category.deleteCategory(categoryId);
            if(result){
                response.status = 'success';
                response.msg = 'Category successfully deleted.';               
                res.json(response);
            }
            else{
                response.msg = 'Error occured while deleting category';
                res.json(response);
            }
        }
    }
    catch(e){
        res.json(response);
        console.log("Error ======> fnDeleteCategory ======>",e);
    }
}