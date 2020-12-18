var Request = require("request");
var expressSession = require('express-session');
var randomstring = require("randomstring");

var Admin = require.main.require('./models/Admin');     
const controller = 'admin';

var crypto = require('crypto');
var algorithm = 'aes-256-ctr'; 
var password = 'RJ22Sd8907UbgJ01';


/* function for encryption */
function encrypt(text){
    var cipher = crypto.createCipher(algorithm,password)
    var crypted = cipher.update(text,'utf8','hex')
    crypted += cipher.final('hex');
    return crypted;
}


/* function for decryption */
function decrypt(text){
   var decipher = crypto.createDecipher(algorithm,password)
   var dec = decipher.update(text,'hex','utf8')
   dec += decipher.final('utf8');
   return dec;
}


/* function for authentication */
async function auth(req, res) { 
    const { check, validationResult } = require('express-validator/check');   
    var input = JSON.parse(JSON.stringify(req.body));  
    req.role_id = 0;
    req.device_token = '4457544';
    req.device_type = 'ios'; 
    data = {};
    var action = 'login';
    errorData = {};

    if(req.session){
        LoginUser = req.session.LoginUser; 
        if(LoginUser){
            res.set('content-type' , 'text/html; charset=mycharset');  
            res.redirect(nodeAdminUrl+'/dashboard');  
        }  
    } 
      
    if (req.method == "POST") { 
          
        req.checkBody('email', 'Email is required').notEmpty();
        req.checkBody('password', 'Password is required').notEmpty();
        req.checkBody('role_id', 'Role_id is required').notEmpty(); 
        req.checkBody('device_token', 'device_token is required').notEmpty(); 
        req.checkBody('device_type', 'device_type is required').notEmpty();  
        var errors = req.validationErrors();    
        if(errors){ 

            if(errors.length > 0){
                errors.forEach(function (errors1) {
                    var field1 = String(errors1.param); 
                    var msg = errors1.msg; 
                    errorData[field1] = msg;     
                });
            }  

            data.email = input.email; 
            data.password = input.password; 
            res.set('content-type' , 'text/html; charset=mycharset'); 
            res.render('admin/auth',{page_title:"Admin - Login",data:data,errorData:errorData}); 

        } else {  
            
            var email         = input.email;    
            var password      = encrypt(input.password);      
 
            // check user email exist or not
            Admin.getUserByEmail(input.email,function(userDetail){
                if(userDetail) {
                     
                    var database_password = userDetail[0].password;
                    if(database_password == password) {
                        req.session.LoginUser = JSON.stringify(userDetail);
                        app.use(expressSession({username: userDetail[0].username, useremail: userDetail[0].email }));
                        global.usernameSession = userDetail[0].username.charAt(0).toUpperCase() + userDetail[0].username.slice(1);
                        global.useremailSession = userDetail[0].email;
                        req.flash('success', 'Welcome to Symptom Checker Dashboard')  
                        res.locals.message = req.flash();   
                        return res.redirect(nodeAdminUrl+'/dashboard');  
                    } else {
                        req.flash('error', 'You have entered an invalid login credentials')  
                        res.locals.message = req.flash();   
                        return res.redirect(nodeAdminUrl+'/auth');
                    }
                    
                    //var stored_hash = '$2a$10$vxliJ./aXotlnxS9HaJoXeeASt48.ddU7sHNOpXC/cLhgzJGdASCe'
                    
                } else {
                    req.flash('error', 'You have entered an invalid e-mail address')  
                    res.locals.message = req.flash();   
                    return res.redirect(nodeAdminUrl+'/auth'); 
                }
            }); 
        } 
 
    }else{
        res.set('content-type' , 'text/html; charset=mycharset'); 
        res.render('admin/auth',{ page_title:"Covid-19 | Administration Login",data:data,errorData:errorData});  
    }   
};  
exports.auth = auth; 


/* function for show dashboard */
async function dashboard(req, res) {  

    var action = 'login';
    res.set('content-type' , 'text/html; charset=mycharset'); 
    data = {}; LoginUser = {};errorData = {};

    if(req.session){
        LoginUser = req.session.LoginUser; 
        if(!LoginUser){
            res.redirect(nodeAdminUrl+'/auth');  
        }  
    } 

    res.render('admin/dashboard',{page_title:"Covid-19 | Dashboard",data:data,LoginUser:LoginUser,controller:controller,action:action});   
    
};  
exports.dashboard = dashboard;


/* function for logout */
async function logout(req, res) {  
      
    res.set('content-type' , 'text/html; charset=mycharset'); 
    data = {}; LoginUser = {};errorData = {};
    if(req.session){
        global.usernameSession = "";
        global.useremailSession = "";
        req.session.destroy(function (err) {
            //res.redirect('/'); //Inside a callback… bulletproof!
            res.redirect(nodeAdminUrl+'/auth');  
        });  
    }   
    res.redirect(nodeAdminUrl+'/auth');     
};  
exports.logout = logout;



/* function for Reset Password */
async function reset(req, res) {  
    const { check, validationResult } = require('express-validator/check');   
    var input = JSON.parse(JSON.stringify(req.body));  
    var action = 'login';
    res.set('content-type' , 'text/html; charset=mycharset'); 
    data = {}; LoginUser = {};errorData = {};

    if (req.method == "POST") { 
        req.checkBody('email', 'Email is required').notEmpty();
        var errors = req.validationErrors();    
        if(errors){ 

            if(errors.length > 0){
                errors.forEach(function (errors1) {
                    var field1 = String(errors1.param); 
                    var msg = errors1.msg; 
                    errorData[field1] = msg;     
                });
            }  

            data.email = input.email;  
            res.set('content-type' , 'text/html; charset=mycharset'); 
            res.render('admin/reset',{page_title:"COVID-19 | Reset Passsword",data:data,errorData:errorData}); 
        } else {
            var email = input.email;   
            // check user email exist or not
            Admin.getUserByEmail(input.email,function(userDetail){
                if(userDetail) {
                    
                    var reset_code = randomstring.generate(20);
                    var dt = moment(Date.now()).format('YYYY-MM-DD hh:mm:ss');
                    var sql = "UPDATE admin SET `reset_code` = '" + reset_code + "', `new_password_requested` = '"+ dt +"'  WHERE email ='"+ input.email+"'";
                    console.log(sql);
                    connectPool.query(sql, function (err, result) {
                        if (err) throw err;
                        console.log(result.affectedRows + " record(s) updated");
                    });

                    
                    body_message = '<h3>Dear '+ input.email + ',</h3>Create a new password <br><br>' + 'Forgot your password, huh?<br>No big deal To create password, just follow this link<br>'+ 
                        '<br>'+ nodeAdminUrl +'/new_password?token=' + reset_code + '&e=' + input.email;
                    var data = {
                        to: input.email,
                        from: fromEmail,
                        subject: 'Reset Passsword',
                        html: body_message
                    };

                    smtpTransport.sendMail(data, function(err) {
                        if (!err) {
                            req.flash('success', 'An email with instructions for creating a new password has been sent to you')  
                            res.locals.message = req.flash();   
                            return res.redirect(nodeAdminUrl+'/reset'); 

                        } else {
                          return done(err);
                        }
                    });

  
                   

                } else {
                    req.flash('error', 'You have entered an invalid e-mail address')  
                    res.locals.message = req.flash();   
                    return res.redirect(nodeAdminUrl+'/reset'); 
                }
            })
        }
    } else {
        res.render('admin/reset',{page_title:"Covid-19 | Reset Password",data:data,LoginUser:LoginUser,controller:controller,action:action});   
    }
};  
exports.reset = reset;


/* new password */
async function new_password(req, res) {  
    const { check, validationResult } = require('express-validator/check');   
    var input = JSON.parse(JSON.stringify(req.body));  
    var action = 'login';
    res.set('content-type' , 'text/html; charset=mycharset'); 
    data = {}; LoginUser = {};errorData = {};

    
    req.checkBody('password', 'Password is required').notEmpty();
    req.checkBody('cpassword', 'Confirm Password is required').notEmpty();
    var errors = req.validationErrors();    
    if(errors){ 

        if(errors.length > 0){
            errors.forEach(function (errors1) {
                var field1 = String(errors1.param); 
                var msg = errors1.msg; 
                errorData[field1] = msg;     
            });
        }  

        req.flash('error', 'Please fill required fields.')  
        res.locals.message = req.flash(); 
        res.redirect( nodeAdminUrl +'/new_password?token=' + input.token + '&e=' + input.email)  
       
    } else {
        if(input.token == "") {
            req.flash('error', 'Session expire.')  
            res.locals.message = req.flash(); 
            res.redirect( nodeAdminUrl +'/new_password?token=' + input.token + '&e=' + input.email)  
        }  

        if(input.password != input.cpassword) {
            req.flash('error', 'Confirm Passsword does not match.')  
            res.locals.message = req.flash();   
            res.redirect( nodeAdminUrl +'/new_password?token=' + input.token + '&e=' + input.email)  
        } else {
            Admin.getUserByEmail(input.email,function(userDetail){
                if(userDetail) {
                    
                    var password = encrypt(input.password);

                    var sql = "UPDATE admin SET `reset_code` =  NULL, `password` = '"+ password +"'  WHERE email ='"+ input.email+"'";
                    console.log(sql);
                    connectPool.query(sql, function (err, result) {
                        if (err) throw err;
                        console.log(result.affectedRows + " record(s) updated");
                    });

                    
                    body_message = '<h3>Dear '+ input.email + ',</h3>You have recently change your password<br> Thank You';
                       
                    var data = {
                        to: input.email,
                        from: fromEmail,
                        subject: 'New Passsword',
                        html: body_message
                    };

                    smtpTransport.sendMail(data, function(err) {
                        if (!err) {
                            req.flash('success', 'New Password updated. You can login with new password')  
                            res.locals.message = req.flash();   
                            return res.redirect(nodeAdminUrl+'/auth'); 

                        } else {
                          return done(err);
                        }
                    });

                }
            })
        }
         
        
    }
     
};  
exports.new_password = new_password;

 