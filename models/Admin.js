module.exports= {
  updateUserData,
	Admin:function(sequelize, type)
	{	
        var Admin = sequelize.define('admin', {
            id: {
              type: type.INTEGER,
              primaryKey: true,
              autoIncrement: true
            },
            username : { type: type.STRING },
            email : { type: type.STRING }, 
            password : { type: type.STRING }, 
            is_active : { type: type.INTEGER }, 
            reset_code: { type: type.TEXT },
            new_password_requested: { type: type.DATE }
          },  
          {
            tableName: 'admin',
            timestamps: false
          }
      ); 
      return Admin;
  },
  
  getUserByEmail:function(email,callback)
  {  
    var sql='select * from admin where email = ?';     
    connectPool.query(sql,email,function(error,result){ 
      if (error) {
        callback(null);
      }  
      else
      {  
        if(result.length==0 || result==null){
          callback(false);
        }else{
          callback(result);
        }  
      } 
    });  
  },


};


async function updateUserData(data) {   
  try { 
    if(data){  

      var sql = "UPDATE admin set ? WHERE id = ?";   
      return new Promise((resolve,reject)=>{
        connectPool.query(sql,[data, data.id], (err, result) => {
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
  } catch (err) {
        return err; 
    } finally {
    //if (connectPool && connectPool.end) connectPool.end();
  }   
}