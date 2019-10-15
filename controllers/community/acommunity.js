const  CQuestions = require('../../models/CQuestions')
const  CAns = require('../../models/CAns')
const _db = require('../../config/database')

exports.postAns = async (req,res) => {


    const answer = req.body.answer
    const userId  = req.user.id || 7
    const isActive = req.body.isActive || 1
    const cq_id = req.body.cq_id ||  23

    

    try{
        await CAns.create({
            answer,
            userId,
            isActive,
            cq_id
        })
        res.json({Status : true , Message : 'Answer Created'})
    }catch(err){
        res.json({Status : false , Message : err.message })
    }
    
 }
