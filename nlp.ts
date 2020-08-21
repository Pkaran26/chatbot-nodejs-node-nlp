import * as Router from "koa-router";
import * as Koa from "koa";
import app from './app';
const { dockStart } = require('@nlpjs/basic');

const router = new Router({
  prefix: '/'
})

router.post('/', async (ctx: Koa.Context, next: ()=> Promise<any>): Promise<any> => {
  const dock = await dockStart();
  const nlp = await dock.get('nlp');
  await nlp.train();
  const body = ctx.request.body
  const response: any = await nlp.process('en', body.question);
  ctx.body = {
    answers: response.answers,
    matched: response.answer,
    date: new Date()
  }
  await next()
})

app.use( router.routes() ).use( router.allowedMethods() );

app.listen(8081, ()=>{
  console.log('server running...')
})
