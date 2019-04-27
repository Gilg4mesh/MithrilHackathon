const Koa = require('koa');
const Router = require('koa-router');
const json = require('koa-json');
const logger = require('koa-logger')
const bodyParser = require('koa-bodyparser');
const serve = require('koa-static');
const mount = require('koa-mount');
const axios = require('axios');
const models = require('../models');
const fs = require('fs');
const path = require('path');
const util = require('util');
const app = new Koa();
const router = new Router();
const readFile = util.promisify(fs.readFile);
const auth = require('./auth');
const jwa = require('jwa');
const privateKey = fs.readFileSync(__dirname + '/../rs256-4096-private.rsa');
const publicKey = fs.readFileSync(__dirname + '/../rs256-4096-public.pem');
const ecdsa = jwa('RS256');


app.use(logger());
app.use(bodyParser());
app.use(json());
app.use(router.routes())
   .use(router.allowedMethods()); 



router.post('/login', async ctx => {
    let rec = await auth.login(ctx.request.body.user_name, ctx.request.body.password);
    if (rec)
		ctx.body = {
			ok: true,
			token: rec.signature,
			uuid: rec.uuid
		}
    else
	    ctx.body = {
	        ok: false,
	        msg: 'user not exist'
	    }
});

router.post('/register', async ctx => {
    let rec = await auth.register(ctx.request.body.user_name, ctx.request.body.password);
    console.log(rec)
    if (rec) 
	    ctx.body = {
	        ok: true,
			token: rec.signature,
			uuid: rec.uuid
	    }
	else 
	    ctx.body = {
	        ok: false,
	        msg: 'user exists'
	    }
});

router.post('/api/auth', async ctx => {
	if (!ecdsa.verify(ctx.request.header.user_name, ctx.request.header.signature, publicKey)) {
	    ctx.body = { ok: false, msg: 'Authorization Failed' }
	    return;
	}


    ctx.body = {
        ok: true
    }
});

router.get('/success', async ctx => {
	
    let res = await axios.post('https://mith.ramiel.io/api/success', 
		{ 
			grant_code: ctx.request.query.grant_code,
			state: ctx.request.query.state,
			user_id: ctx.request.query.user_id
		}).catch(err => {
			console.log(err);
		});


	if (res.result)
	    ctx.body = {
	        ok: true
	    }
	else
	    ctx.body = {
	        ok: false,
	        msg: res.data.errorMessage
	    }

});



app.use(mount('/dist', serve(path.join(__dirname, '../dist'))));

app.use(async (ctx) => {
  ctx.set('Content-Type', 'text/html');
  ctx.body = await readFile(path.join(__dirname, '../index.html'));
});




models.db.sync().then(() => {
  app.listen(process.env.PORT || 4000);
});