var express = require('express');
var router = express.Router();
const url = require('url');
 
var AdminController    =  require('../controllers/admin/AdminController');  
var PatientsController    =  require('../controllers/admin/PatientsController');  
 
 

/** Routes for admin  */ 

router.get('/admin/auth', AdminController.auth);     
router.post('/admin/auth', AdminController.auth);
router.get('/admin/reset', AdminController.reset);     
router.post('/admin/reset', AdminController.reset); 
app.get('/api/admin/new_password', function(req, res) {
    var email = req.param('e');
    var token = req.param('token');
    res.set('content-type' , 'text/html; charset=mycharset'); 
    data = {}; LoginUser = {};errorData = {};
    res.render('admin/new_password',{page_title:"Covid-19 | New Password",data:data, token: token, email: email});   
});
router.post('/admin/new_password', AdminController.new_password);  
router.get('/admin/dashboard', requiredAuthentication, AdminController.dashboard); 
router.get('/admin/patients/',requiredAuthentication,  PatientsController.list);  
router.get('/admin/patients/delete/:id', requiredAuthentication, PatientsController.deleteRecord);   
router.get('/admin/logout', AdminController.logout);         

module.exports = router;       

function requiredAuthentication(req, res, next) {
    //next(); 
    if(req.session){
        LoginUser = req.session.LoginUser; 
        if(LoginUser){    
            next();   
        }else{
            res.redirect(nodeAdminUrl+'/auth');       
        } 
    }else{
        res.redirect(nodeAdminUrl+'/auth');       
    }
}