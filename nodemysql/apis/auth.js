
exports.fnRegister = (req, res, next) => {
    var response = {
        status: 'error', 
        msg: 'Somenting happened wrong please try again later.', 
        data: {}
    }
    try{        
        const{ firstname, lastname, email, password } = req.body;        
        if(firstname && lastname && email && password) {
            if(password.length >=6) {
                next();
            }
            else{
                throw new Error("Password contains at least 6 characters.");
            }
        }
        else{
            throw new Error("Parameter missing.");            
        }       
    }
    catch(e) {
        response.msg = e.message;
        // console.log("Error ========> fnRegister =======>", e);
        res.json(response);
    }    
}

exports.fnLogin = (req, res, next) => {
    var response = {
        status: 'error', 
        msg: 'Somenting happened wrong please try again later.', 
        data: {}
    }
    try{ 
        const { email, password } = req.body;
        if(email && password) {
            if(password.length >= 6) {
                next();
            } 
            else{
                throw new Error("Password must be at least 6 characters.");   
            }
        }
        else{
            throw new Error("Parameter missing.");   
        }
    }
    catch(e){
        response.msg = e.message;
        // console.log("Error ========> fnRegister =======>", e);
        res.json(response);
    }
}