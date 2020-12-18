var express = require('express');
var router = express.Router();
const url = require('url');
 
var MainController =  require('../controllers/MainController');  
var QuestionController =  require('../controllers/QuestionController');
var HdkeyController =  require('../controllers/HdkeyController');

  
/* Routes for main */
router.get('/', MainController.index);  
router.post('/', MainController.index);  
router.get('/diagnosis', QuestionController.index); 
router.post('/diagnosis', QuestionController.index); 


router.get('/start', QuestionController.startAgain); 
router.post('/start', QuestionController.startAgain); 
router.get('/location', QuestionController.location);



router.post('/hdkey', HdkeyController.index);  
router.post('/passwordkey', HdkeyController.password);
router.post('/sendTransaction', HdkeyController.sendTransaction);
module.exports = router;  

   