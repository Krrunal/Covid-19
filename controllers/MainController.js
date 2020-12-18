var Request = require("request");
var expressSession = require('express-session');
var ProgressBar = require('progressbar.js')
var localStorage = require('localStorage')

//var Admin = require.main.require('./models/Admin');     
const controller = 'main';
 
async function loader(req, res) {  
    res.set('content-type' , 'text/html; charset=mycharset'); 
    data = {}; LoginUser = {};errorData = {};
    res.render('front/splash',{page_title:"COVID-19",data:data});   
}
exports.loader = loader;


async function index(req, res) {  
    const { check, validationResult } = require('express-validator/check');   
    var input = JSON.parse(JSON.stringify(req.body)); 
    data = {};LoginUser = {};errorData = {};
    var action = 'main';
    

    if (req.method == "POST") {

        req.checkBody('name', 'Please fill your name').notEmpty();
        req.checkBody('age', 'Please fill your age').notEmpty();
        var errors = req.validationErrors();    
        if(errors){ 

            if(errors.length > 0){
                errors.forEach(function (errors1) {
                    var field1 = String(errors1.param); 
                    var msg = errors1.msg; 
                    errorData[field1] = msg;     
                });
            }  
            data.showloader = "none";
            data.showcontent = "block";
            res.set('content-type' , 'text/html; charset=mycharset'); 
            res.render('front/index',{page_title:"COVID-19",data:data,errorData:errorData}); 
        } else {
            
            if("gender" in input) {
                localStorage.setItem('localName', input.name);
                localStorage.setItem('localAge', input.age);
                localStorage.setItem('localSex', input.gender);
                return res.redirect(nodeSiteUrl+'/location');
            } else { 
                req.flash('error', 'Select your gender.')  
                res.locals.message = req.flash();   
                return res.redirect(nodeSiteUrl+'/'); 
            }
        }

    } else { 
        res.set('content-type' , 'text/html; charset=mycharset'); 
        data.email = ""; 
        data.password = ""; 
        data.showloader = "block";
        data.showcontent = "none";
        res.render('front/index',{page_title:"Covid-19",data:data});   
    }
};  
exports.index = index;
 

