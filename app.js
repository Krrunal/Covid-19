var express = require('express');
global.app = express(); 
global.moment = require('moment');
const expressValidator = require('express-validator');
const fileUpload = require('express-fileupload');
const cors = require('cors');
const bodyParser = require('body-parser');
const http = require('http');

const Sequelize = require('./sequelize'); 

 
// Required module 
app.use(expressValidator());
app.use(cors()); 
app.use(fileUpload()); 

global.connectPool = require('./config/db.js');    
 
 
global.nodeSiteUrl = 'https://takedoodles.com:8080'; // node  
global.nodeAdminUrl = 'https://takedoodles.com:8080/api/admin'; // node  
  
    
global.fromEmail = 'noreply.techconnect@gmail.com';  
global.SITE_NAME = 'COVID-19 Symptom Checker';  
global.siteTitle = 'COVID-19 Symptom Checker';  

global.SessionExpireStatus = 500; 



/* Admin section code */
app.set('view engine', 'ejs');
//app.set('view engine', 'pug') 
var path = require('path');
app.set('views', path.join(__dirname, 'views'));  
app.use(express.static(__dirname +'/public'));  
var flash = require('express-flash-messages')
app.use(flash())
 
var cookieParser = require('cookie-parser');
var expressSession = require('express-session');
app.use(cookieParser()); 
app.use(expressSession({secret: 'D%$*&^lk32', resave: false,saveUninitialized: true}));  
// app.use(expressSession({ cookie: { maxAge: 60000 }, 
//     secret: 'woot',
//     resave: false, 
//     saveUninitialized: false}));
 
app.use(function (req, res, next) {
    res.header('Content-Type', 'application/json');
    next();
});   
app.use(bodyParser.json());  
app.use(express.urlencoded({limit: '100mb',extended: true })); 
 



const nodemailer    = require("nodemailer"); 
global.smtpTransport = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
        user: 'noreply.techconnect@gmail.com',
        pass: 'Prakash@8907'
    }
}); 
 
var indexRouter = require('./routes/index');
var apiRouter = require('./routes/api');
app.use('/', indexRouter); 
app.use('/api', apiRouter); 

// const server = http.createServer((req, res) => {
//     res.statusCode = 200;
//     res.setHeader('Content-Type', 'text/plain');
// });

 
var server = app.listen(8080, function () { 
    console.log("Example app listening at https://takedoodles.com:%s", server.address().port);
});   

    
process.on('uncaughtException', function (err) { 
    console.log('Caught exception: ' + err);
});  

// Check session of logged user 
global.CheckPermission = function(req, res){  
    if(typeof req.session.user !== "undefined"){
        LoginUser = req.session.LoginUser; 
        if(LoginUser){
            return true; 
        }else{ 
            res.redirect(nodeAdminUrl+'/auth'); 
        }
    }else{
        return true; 
    } 
    return true;  
}; 

