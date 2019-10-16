const _feathers = require('@feathersjs/feathers')
const _exp = require('@feathersjs/express')
const _socket = require('@feathersjs/socketio')
const moment = require('moment')
const bodyParser = require('body-parser')
const cors = require('cors')
const db = require('./config/database')
const Test = require('./models/Test')


// Test DB 
db.authenticate()
.then(()=> console.log('connected to the database'))
.catch((err)=> console.log('faild to connect', err.message))




// Ideas Service
class IdeaService {
  constructor(){
    this.ideas = []
  }

  async find(){


    try {
      const res_d = await Test.findAll({order: [
        ['id', 'DESC'],
    ]})  
      this.ideas = res_d

    } catch (error) {
      console.log('error.message :', error.message);
    }

    
 
    return this.ideas
  }
  async create(data){
    const idea = {
      text : data.text,
      tech : data.tech,
      viewer : data.viewer
    }

    idea.time = moment().format('h:mm:ss a')

    // saving data to db
    // const _t = `INSERT INTO public.tests(
    //   text, tech, author)
    //    VALUES ( (:text), (:tech), (:viewer));`
      
      try{

          const { text, tech } = idea 

          await Test.create({
            text , tech , author : idea.viewer
          })
          // const res_d = await db.query(_t, {
          //     replacements: {text: idea.text, viewer: idea.viewer , tech : idea.tech},
          //     type: db.QueryTypes.INSERT
          //   })
          //[results, metadata]
          this.ideas.push(idea)
          return idea
          
      }catch(err){
          console.log('err.message :', err.message);
      }


    
  }
}


const app = _exp(_feathers())

app.use(cors())

app.use(_exp.json())
app.configure(_socket())
app.configure(_exp.rest())

app.use('/ideas',  new IdeaService())


console.log('_exp.Router() :', );



app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())



// app.use('/article' , require('./routes/article'))
// app.use('/auth' , require('./routes/user'))
// app.use('/community' , require('./routes/community'))



app.on('connection' , conn => app.channel('stream').join(conn))
app.publish(data=> app.channel('stream'))

const PORT = process.env.PORT || 3030

app.listen(PORT).on('listening' , () => console.log(`Realtime server is running on PORT number ${PORT}`))



