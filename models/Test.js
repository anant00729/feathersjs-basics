const Sequelize = require('sequelize')
const db = require('../config/database')



const Test = db.define('tests', {

    text : {
        type : Sequelize.STRING
    },
    tech : {
        type : Sequelize.STRING
    },
    author : {
        type : Sequelize.STRING
    }
  
})



module.exports = Test
