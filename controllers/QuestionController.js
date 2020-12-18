var Request = require("request");
var expressSession = require('express-session');
var localStorage = require('localStorage')
var Patients = require.main.require('./models/Patients');  

const controller = 'question';
 
async function index(req, res) {  
    const { check, validationResult } = require('express-validator/check');   
    var input = JSON.parse(JSON.stringify(req.body)); 
      
    if (req.method == "GET") {
        oldItems = [];
        localStorage.clear();
        res.redirect('/');
    }
   
    if (req.method == "POST") {
        var count = Object.keys(input).length;
        evidence = []; newEvidence = [];  oldItems = [];
        
         var oldItems = JSON.parse(localStorage.getItem('localEvidence')) || [];
        if(count > 0) {
            for(var i = 0; i < count; i++) {

                if(localStorage.getItem("questionType") == "group_single") {
                    oldItems.push({ 'id': Object.values(input)[i], "choice_id": "present" });
                    evidence.push(
                        { 'id': Object.values(input)[i], "choice_id": "present" }
                    ); 
                } else {
                    oldItems.push({ 'id': Object.keys(input)[i], "choice_id": Object.values(input)[i] });
                    evidence.push(
                        { 'id': Object.keys(input)[i], "choice_id": Object.values(input)[i] }
                    );
                }
            }  
        }  

        localStorage.setItem('localEvidence', JSON.stringify(oldItems));
        var retrievedObject = localStorage.getItem("localEvidence");
       
        if(localStorage.getItem("shouldStop") == "true") {
            url = "https://api.infermedica.com/covid19/triage";
            var showTriage = 1;
        } else {
            url = "https://api.infermedica.com/covid19/diagnosis";
        }
        console.log(url)
    }  

   
    var action = 'question';
    res.set('content-type' , 'text/html; charset=mycharset'); 
    data = {}; LoginUser = {};errorData = {};

    Request.post({   
        "headers": {
            "content-type": "application/json", 
            "App-Id": "f12b65c0",
            "App-Key": "ea944abdcef840e35c94883270173203"
        }, 
        "url": url, 
        "body": JSON.stringify({ 
            "sex":localStorage.getItem("localSex"),
            "age": parseInt(localStorage.getItem("localAge")),
            "evidence": oldItems
        })
    },(error, response, body) => {  
        if(error) { 
            return console.dir(error);
        } 
        var retrunRes = JSON.parse(body);  
        console.log(retrunRes)
       
        localStorage.setItem('shouldStop', retrunRes.should_stop);
        var shouldStop = localStorage.getItem("shouldStop");
        
        if(retrunRes.should_stop) {
            console.log(retrunRes.should_stop);
        }
           
        if("serious" in retrunRes) {
            res.render('front/result',{
                page_title:"Covid-19 | diagnosis",
                description: retrunRes.description,
                heading: retrunRes.label,
                data: retrunRes.serious,
                level: retrunRes.triage_level,
                localName: localStorage.getItem("localName"),
                localAge: localStorage.getItem("localAge"),
                localSex: localStorage.getItem("localSex")
            });
        }
            
           
        if(!retrunRes.should_stop) {
            localStorage.setItem('questionType', retrunRes.question.type);
        }

        res.render('front/question',{
            page_title:"Covid-19 | diagnosis",
            data: retrunRes.should_stop ? [] : retrunRes.question.items, 
            shouldStop: shouldStop , 
            type: retrunRes.should_stop ? "group_single" : retrunRes.question.type, 
            text: retrunRes.should_stop ? retrunRes.description : retrunRes.question.text, 
            singleExp: retrunRes.should_stop ? null : retrunRes.question.explanation,
            isCountry: "false",
            localName: localStorage.getItem("localName"),
            localAge: localStorage.getItem("localAge"),
            localSex: localStorage.getItem("localSex")
        });
     
    });
        
};  
exports.index = index;
 

async function location(req, res) {  
    const { check, validationResult } = require('express-validator/check');   
    var input = JSON.parse(JSON.stringify(req.body)); 

    if(localStorage.getItem("localName") == null) {
        res.redirect('/');
        return;
    }

    res.set('content-type' , 'text/html; charset=mycharset'); 
    data = {}; LoginUser = {};errorData = {};
    Request.get({   
        "headers": {
            "content-type": "application/json", 
            "App-Id": "f12b65c0",
            "App-Key": "ea944abdcef840e35c94883270173203"
        }, 
        "url": "https://api.infermedica.com/covid19/locations" 
        
    },(error, response, body) => {  
        if(error) { 
            return console.dir(error);
        }
        
        var retrunRes = JSON.parse(body);  
        
        res.render('front/question',{
            page_title:"Covid-19 | Location",
            data: retrunRes, 
            shouldStop: "false" , 
            type: "group_single",
            text: "Please select where you live or have recently traveled to:",
            singleExp: null,
            isCountry: "true",
            localName: localStorage.getItem("localName"),
            localAge: localStorage.getItem("localAge"),
            localSex: localStorage.getItem("localSex")
        });
        
    })
};
exports.location = location;



async function startAgain(req, res) {  
    res.set('content-type' , 'text/html; charset=mycharset'); 
    var input = JSON.parse(JSON.stringify(req.body)); 
    
    var data = {
        "username": localStorage.getItem("localName"),
        "age": parseInt(localStorage.getItem("localAge")),
        "gender": localStorage.getItem("localSex") == "male" ? "0" : "1",
        "appointment": moment(Date.now()).format('YYYY-MM-DD hh:mm:ss'),
        "location": null,
        "latitude": input.lat,
        "longitude": input.long,
        "result": "quarantine"
    }
 
    var saveResult = await Patients.saveData(data);   
    if(saveResult) {
        console.log(saveResult); 
    }
    
    localStorage.clear();
    res.redirect('/')
};
exports.startAgain = startAgain;