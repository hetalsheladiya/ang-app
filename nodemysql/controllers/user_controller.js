var db = require('../config/dbconfig').db;

exports.login = (req, res) => {
    const { email, password } = req.body;
    var selectQry = "SELECT * FROM user_datas WHERE email = ?";
    db.query(selectQry, [email], function(err, result) {
        if(err) throw err;
        if(result.length > 0) {
            if(result[0].password === password){
                res.json({
                    status: 'success',    
                    msg: "Password does not match."
                })
            }
            else{
                res.json({
                    status: 'error',    
                    msg: "Password does not match."
                })
            }
        }
        else{
            res.json({
                status: 'error',    
                msg: "Email does not exit"
            });
        }
        console.log(result);
        res.json({data: result});
    })
}

exports.register = (req, res) => {    
    const{ firstname, lastname, email, password } = req.body; 
    var selectQry = "SELECT COUNT(email) AS count FROM user_datas WHERE email = ?"; 
    var insertQry = "INSERT INTO user_datas SET ?";
    db.query(selectQry, [email], function (err, result) {
        if (err) throw err;        
        if(result[0]['count'] <= 0) {            
            const user = { 
                    username: firstname+lastname, 
                    email: email, 
                    password: password
                };  
            
            db.query(insertQry, user, (err, result) => {
                if(err) throw err;        
                user.id = result.insertId;
                res.json({status: 'success', msg: 'You are registerd with us. Please try with login.', data: user})
            }); 
        }
        else{
            res.json({status: 'error', msg: 'Email already exist.'});
        }        
    });        
}
