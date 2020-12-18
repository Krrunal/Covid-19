var mysql = require('mysql2'); 
var mysqlPool = mysql.createPool({ 
    connectionLimit: 10,  
    host: 'localhost',
    user: 'tdcpanel_covid19', 
    password: 'KQN47Yt0(w,5', 
    database: 'tdcpanel_covid19', 
    waitForConnections: true,
    debug    :  false,   
    queueLimit: 30,
    connectTimeout:40000,
    multipleStatements: true
  });   

// Attempt to catch disconnects 
mysqlPool.on('connection', function (connection) {
    console.log('DB Connection established');

    mysqlPool.on('error', function (err) {
        console.error( 'MySQL error', err.code);
    }); 
    
    mysqlPool.on('close', function (err) {
        console.error(  'MySQL close', err); 
    }); 
});

mysqlPool.on('error', function (connection) {
    console.error( 'MySQL error', err.code); 
}); 
module.exports = mysqlPool; 

 

