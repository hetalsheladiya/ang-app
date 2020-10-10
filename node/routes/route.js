const jwt = require('jsonwebtoken')
const AES_KEY = "tokensecrethere";

module.exports = (app) => {    

    var auth = require('../api/auth');
    app.post('/api/auth/register', auth.fnRegister);
    app.post('/api/auth/login', auth.fnLogin);

    var category = require('../api/category')
    app.all('/api/*', fnAuthoriseToken)
    app.post('/api/category-list', category.fnCategoryList);
    app.post('/api/add-category', category.fnAddCategory);
    app.post('/api/get-category', category.fnGetCategory);
    app.post('/api/update-category', category.fnUpdateCategory);
    app.post('/api/delete-category', category.fnDeleteCategory);
    
    app.post('/api/logout', auth.fnLogout)
}
const fnAuthoriseToken = (req, res, next) => {
    var response = {
        status: 'error',
        msg: "Unauthorised request."
    };    
    if(req.headers && req.headers.authorization){
        const authHeader = req.headers.authorization.split(' ');
        if(authHeader && authHeader.length == 2){
            if(authHeader[0] == 'Bearer'){
                var token = authHeader[1];
                if(token){
                    jwt.verify(token, AES_KEY, (err, user) => {
                        if(err){
                            res.status(403);
                            return res.json(response);
                        }
                        else{
                            if (user.exp <= Date.now()) {
                                res.status(400);
                                response.msg = "Access token has expired"; 
                                res.json(response);                           
                            }
                            else{
                                req.user = user
                            }                  
                            return next();
                        }
                    })
                }
                else{
                    res.status(401);
                    console.log('Server error --> fnAuthorise --> data missmatch --> 1 --> ');
                    res.json(response);
                }                
            }
            else{
                res.status(401);
                console.log('Server error --> fnAuthorise --> Bearer missmatch --> 11 --> ');
                res.json(response);
            }
        }
        else{
            res.status(401);
            console.log('Server error --> fnAuthorise --> parts and parts length missmatch --> 111 --> ');
            res.json(response)
        }                
    }
    else{
        res.status(401);
        console.log('Server error --> fnAuthorise --> authorization does not exist on header --> 1111 --> ');
        res.json(response);
    }
}