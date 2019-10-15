const _feathers = require('@feathersjs/feathers')
const _exp = require('@feathersjs/express')
const _socket = require('@feathersjs/socketio')
const moment = require('moment')

// Ideas Service
class IdeaService {
  constructor(){
    this.ideas = []
  }

  async find(){
    return this.ideas
  }
  async create(data){
    const idea = {
      id : this.ideas.length,
      text : data.text,
      tech : data.tech,
      viewer : data.viewer
    }

    idea.time = moment().format('h:mm:ss a')
    this.ideas.push(idea)
    return idea
  }
}


const app = _exp(_feathers())

app.use(_exp.json())
app.configure(_socket())
app.configure(_exp.rest())

app.use('/ideas', new IdeaService())

app.on('connection' , conn => app.channel('stream').join(conn))
app.publish(data=> app.channel('stream'))

const PORT = process.env.PORT || 3030

app.listen(PORT).on('listening' , () => console.log(`Realtime server is running on PORT number ${PORT}`))



// app.service('ideas').create({
//   id : 1,
//   text : 'Some Idea',
//   tech : 'node js',
//   viewer : 'anant'
// })


// app.service('ideas').create({
//   id : 1,
//   text : 'Some Idea',
//   tech : 'node js',
//   viewer : 'anant'
// })



// app.service('ideas').create({
//   id : 1,
//   text : 'Some Idea',
//   tech : 'node js',
//   viewer : 'anant'
// })



// app.service('ideas').create({
//   id : 1,
//   text : 'Some Idea',
//   tech : 'node js',
//   viewer : 'anant'
// })






