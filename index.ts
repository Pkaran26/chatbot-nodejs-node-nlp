import * as Koa from "koa";
import app from './app';
import * as socket from 'socket.io';
import * as http from 'http';
import axios from 'axios';
import * as Router from "koa-router";
import { createReadStream } from 'fs';

const server = http.createServer(app.callback())
const io = socket(server)

const router = new Router({
  prefix: '/'
})

router.get('/', async (ctx: Koa.Context, next: ()=> Promise<any>): Promise<any> => {
  ctx.type = 'html';
  ctx.body = createReadStream(__dirname+'/public/index.html');
  await next()
})

app.use( router.routes() ).use( router.allowedMethods() );

let connections = []

function welcomeMessages(io: any, socket: any, message: string, time: number): void{
  setTimeout(()=>{
    io.sockets.to(`${ socket.id }`).emit('ANSWER', {
      matched: message,
      date: new Date()
    })
    console.log('welcomeMessages')
  }, time)
}

io.sockets.on('connection', function(socket: any){
    connections.push(socket)
    console.log('Connected: ', connections.length)

    welcomeMessages(io, socket, 'Welcome here!', 1000)
    welcomeMessages(io, socket, 'Hi, i am helper ChatBot', 2000)

    socket.on('disconnect', function(){
      const index = connections.indexOf(socket)
      connections.splice(index, 1)
      console.log('Connected: ', connections.length)
    })

    socket.on('QUESTION', function(payload: any){
      const { socket_id, question } = payload

      axios.post(`http://localhost:8081/`, { question: question })
      .then(res=>{
        io.sockets.to(`${ socket_id }`).emit('ANSWER', res.data)
      })
      .catch(err=>{
        console.log(err)
        io.sockets.to(`${ socket_id }`).emit('ANSWER', {
          matched: 'server is down',
          date: new Date()
        })
      })
    })
  })

server.listen(8080)
console.log('Server running...')
