const Sequelize = require('sequelize')
const PatientsModel = require.main.require('./models/Patients');
const AdminModel = require.main.require('./models/Admin'); 

  
 
const sequelize = new Sequelize('tdcpanel_covid19', 'tdcpanel_covid19', 'KQN47Yt0(w,5', {
  host: 'localhost',
  dialect: 'mysql',
  pool: { 
    max: 10,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
})

global.PatientsTable = PatientsModel.Patients(sequelize, Sequelize)
global.AdminTable = AdminModel.Admin(sequelize, Sequelize)
 
sequelize.sync({ force: false })
  .then(() => {
    console.log(`Sequelize setp success`)
}) 

module.exports = {
  PatientsTable, 
  AdminTable
} 