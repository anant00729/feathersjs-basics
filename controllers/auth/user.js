const  User = require('../../models/User')
const  UserSession = require('../../models/UserSessions')
const _db = require('../../config/database')
const {checkUserPresent} = require('./checkPresent')
const { GOOGLE_AUTH, FB_AUTH } = require('../../config/app_constants')
const fetch = require('node-fetch');


 exports.register = async (req,res) => {

    const email = req.body.email
    const password = req.body.password
    const name = email.split('@')[0]
    const isActive = '1'
    const UserType = 'nor'
    const picture = ''

    try{

        
        const res_d1 = await checkUserPresent(email , password)

        if(res_d1[0] == 0 ){
            const res_d = User.create({ 
                name,
                email,
                password,
                isActive,
                UserType,
                picture
            })    
            res.json({Status : true , Message : "" , res_d})
        }else {
            res.json({Status : false , Message : "Already a user" })
        }
    


        
    }catch(err){
        res.json({Status : false , Message : err.message})
    }
 }


 exports.truncateAll = async (req,res) => {

    const _t = `TRUNCATE ONLY 
                "CQuestions",
                "UserSessions",
                "Users",
                "Articles",
                "CAns"`
    try{
        const res_d = await _db.query(_t)
        //[results, metadata]
        res.json({Status : true , Message : "" , res_d : res_d[0]})
    }catch(err){
        res.json({Status : false , Message : err.message})
    }
 }



 exports.login = async (req,res) => {

    const email = req.body.email
    const password = req.body.password
    
    try{
        const res_d = await checkUserPresent(email , password)

        if(res_d[0] > 0){
            const user = res_d[1]
            const token = randomString(50)
            const userId = user.id
            const res_d1 = await UserSession.create({
                userId, token
            })

            if(res_d1){
                res.json({Status : true , Message : '', token})
            }
            
        }else{
            res.json({Status : false , Message : 'Please register'})
        }
        
    }catch(err){
        res.json({Status : false , Message : err.message})
    }
 }


 exports.logout = async (req,res) => {
    const token = req.body.token
    const q1 = `SELECT * FROM "UserSessions" WHERE "token" = '${token}'`
    const res_d = await _db.query(q1)

    if(res_d[0].length > 0){
        const _d = res_d[0][0]

        const q2 = `DELETE FROM public."UserSessions" WHERE "token" = '${_d.token}'`
        const res_d2 = await _db.query(q2)
        res.json({Status : true , Message : ''})
    }else {
        res.json({Status : false , Message : 'Token Expired'})
    }

 }

 const randomString = (len, charSet) => {
    charSet = charSet || 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var randomString = '';
    for (var i = 0; i < len; i++) {
        var randomPoz = Math.floor(Math.random() * charSet.length);
        randomString += charSet.substring(randomPoz,randomPoz+1);
    }
    return randomString;
}


exports.s_login = async (req,res) => {
    const sToken = req.body.sToken
    const sCode = req.body.sCode


    try{

        if(sCode == 1){
            // for google
            const res_d = await fetch(`${GOOGLE_AUTH}${sToken}`)
            const data = await res_d.json()

            const _d = {
                email : data.email,
                name : data.name,
                picture : data.picture,
                UserType : 'google'
            }

            _chechUserPresent(_d,res)



            
        }else {
            // for facebook
            const res_d = await fetch(`${FB_AUTH}${sToken}`)
            const data = await res_d.json()

            const _d = {
                email : data.email,
                name : data.first_name + ' ' + data.last_name,
                picture : data.picture.data.url || '',
                UserType : 'fb'
            }

            _chechUserPresent(_d,res)


        }

    }catch(err){
        res.json({Status : false , Message : err.message})
    }
 }



 const _chechUserPresent = async (_d,res) => {
    const {email, name, picture, UserType} = _d


    try{

    const q1 = `SELECT * FROM "Users" WHERE "email" = '${email}' AND "UserType" = '${UserType}'`
    const res_d = await _db.query(q1)
    
    if(res_d[0].length == 0){
        
        // user exists
        const isActive = 1
        const password = ''

        await User.create({email, name, picture, UserType, isActive , password})

        const q2 = `SELECT * FROM "Users" WHERE "email" = '${email}' AND "UserType" = '${UserType}'`
        const res_d2 = await _db.query(q2)


        if(res_d2[0].length > 0){
            const user = res_d2[0][0]
            const token = randomString(50)
            const userId = user.id
            const res_d3 = await UserSession.create({
                userId, token
            })

            if(res_d3){
                res.json({Status : true , Message : '', token})
            }

        }
        
    }else {
        // user not present

        const user = res_d[0][0]
            const token = randomString(50)
            const userId = user.id
            const res_d3 = await UserSession.create({
                userId, token
            })

            if(res_d3){
                res.json({Status : true , Message : '', token})
            }
    }

    }catch(err){
        res.json({Status : false , Message : err.message})
    }
    

    
 }
 


 