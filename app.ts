import * as Koa from "koa";
import * as logger from "koa-logger";
import * as json from "koa-json";
import * as bodyParser from "koa-bodyparser";
import * as cors from '@koa/cors';
import * as serve from 'koa-static';
const app = new Koa();

app.use(json());
app.use(logger());
app.use(bodyParser());
app.use(cors());
app.use(serve(__dirname + '/public'));

export default app
