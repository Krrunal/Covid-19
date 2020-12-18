module.exports= {
  getAllData,
  deleteRecord,
  saveData,
	Patients:function(sequelize, type)
	{	
        var Patients = sequelize.define('patients', {
            id: {
              type: type.INTEGER,
              primaryKey: true,
              autoIncrement: true
            },
            username : { type: type.STRING },
            gender : { type: type.ENUM('0', '1'),  comment: "0:Male, 1: Female", defaultValue: '0' }, 
            age : { type: type.INTEGER }, 
            appointment : { type: type.DATE }, 
            location : { type: type.STRING }, 
            latitude : { type: type.STRING },
            longitude :{ type: type.STRING },
            result : { type: type.STRING },  
          },  
          {
            tableName: 'patients',
            timestamps: false
          }
      ); 
      return Patients;
  },
  
   
};

/* get patient record */
async function getAllData() {   
  try {   
      var sql='select * from patients ORDER BY id DESC';    
      return new Promise((resolve,reject)=>{
        connectPool.query(sql, (err, result) => {
          if (err) { 
            reject(err)
          } else {  
            resolve(result)
          }
        })
      }).catch(function(e){
        return e; 
    });
     
  }finally {
   
  } 
}


/* delete patient record */
async function deleteRecord(id) {   
  try { 
    if(id){ 
      var sql='delete from patients where id = '+ id;   
      return new Promise((resolve,reject)=>{
        connectPool.query(sql, (err, result) => {
          if (err) { 
            reject(err)
          } else { 
            resolve(result)
          }
        })
      })
    }else{
      return null;
    }
  } finally {
   
  } 
} 


/* add new data from front side */
async function saveData(data) { 
	try { 
		if(data){   
			var sql='INSERT INTO patients set ? ';
			return new Promise((resolve,reject)=>{
				connectPool.query(sql,data, (err, result) => {
					if (err) { 
						console.log(data);
						reject(err)
					} else { 
						resolve(result)
					}
				})
			}) 
		}else{ 
			return null;
		}
	} finally {
		//if (connectPool && connectPool.end) connectPool.end();
	}  
} 