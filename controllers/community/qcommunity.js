const  CQuestions = require('../../models/CQuestions')
const  CAns = require('../../models/CAns')
const _db = require('../../config/database')

exports.postQuestion = async (req,res) => {

    const question = req.body.question 
    const clap = req.body.clap || 0
    const qColor = req.body.qColor || '#ffffff'
    const isActive = req.body.isActive || 1
    const userId = req.user.id


    try{
        await CQuestions.create({
            question,
            clap,
            qColor,
            isActive,
            userId,
        })
        res.json({Status : true , Message : 'Question Created'})
    }catch(err){
        res.json({Status : false , Message : err.message })
    }
    
 }



 