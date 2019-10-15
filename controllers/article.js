const  Article = require('../models/Article')
const { Op } = require('sequelize')
const _db = require('../config/database')

 exports.getAllArticles = async (req,res) => {
    Article.findAll()
    .then((res_d)=> {

        res_d = res_d.map((d)=> {
            d.ArticleTemplate = JSON.parse(d.ArticleTemplate)
            return d
        })

        res.json(res_d)
    })
    .catch((err)=> {
        res.json(err.message)
    })
 }


 exports.insertAllArticles = async (req,res) => {
    Article.findAll()
    .then((res_d)=> {
        res.json(res_d)
    })
    .catch((err)=> {
        res.json(err.message)
    })
 }



 exports.uploadImageForArticles = async(req,res) => {
    res.json(req.file.filename)
 }

 exports.updateArticlesTemplate = async(req,res) => {
    const _t = `UPDATE "Articles"
	SET "ArticleTemplate"= (:data)
    WHERE "id" = (:id);`
    
    try{
        const res_d = await _db.query(_t, {
            replacements: {id: '4' , data : JSON.stringify(req.body.data)},
            type: _db.QueryTypes.UPDATE
          })
        //[results, metadata]
        res.json({Status : true , Message : "" , res_d : res_d[0]})
    }catch(err){
        res.json({Status : false , Message : err.message})
    }
 }



 exports.instert100Articles = async(req,res) => {
    
    let dataList = []

    for(let i = 0; i < 100 ; i++){
        const _a = {
            ArticleName : 'asdasdd',
            ArticleAuthorName : 'asdasdd',
            PublishedOn : 'asdasdd',
            ReadTime : 'asdasdd',
            ArticleTemplate : JSON.stringify(req.body.data),
            isActive : 1
        }

        dataList.push(_a)
    }

    
    try{
        const res_d = await Article.bulkCreate(dataList)
        //[results, metadata]
        res.json({Status : true , Message : "" , res_d : res_d[0]})
    }catch(err){
        res.json({Status : false , Message : err.message})
    }
 }
 


 

