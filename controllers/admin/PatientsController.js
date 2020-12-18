var Request = require("request");      
var Patients = require.main.require('./models/Patients');   

const controller = 'patients'; 
const module_name = 'Patients'; 
 
/* list */
async function list(req, res) { 
     if(req.session){
        LoginUser = req.session.LoginUser; 
        if(!LoginUser){
            res.redirect(nodeAdminUrl+'/auth');  
        } 
    } 

            

    res.set('content-type' , 'text/html; charset=mycharset'); 
    data = {};    
    action = 'list'; 
    const allRecord = await Patients.getAllData();   
    console.log(controller+'  '+action);
    res.render('admin/patients/list',{
        page_title:"Covid-19 | Patients",
        data:allRecord, 
        controller:controller,
        action:action,
        module_name:module_name
    });    
};      
exports.list = list;


  
/* delete */
async function deleteRecord(req, res) { 
   
    var patientsDetails = {}; 
    if(req.params.id){
        var patientId =  String("'"+req.params.id+"'");    
        patientsDetails = await Patients.deleteRecord(patientId);  
        if(patientsDetails.length == 0){  
            req.flash('error', 'Invalid url')  
            return res.redirect(nodeAdminUrl+'/'+controller); 
        }else{
            req.flash('success', 'Patient removed succesfully');    
            return res.redirect(nodeAdminUrl+'/'+controller);  
        }   
    }else{ 
        req.flash('error', 'Invalid url.');   
        return res.redirect(nodeAdminUrl+'/'+controller);      
    }    
};          
exports.deleteRecord = deleteRecord;  
   


