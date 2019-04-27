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
const userInfo = require('./userInfo');
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

router.post('/res/auth', async ctx => {
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
			uid: ctx.request.query.user_id
		}).catch(err => {
			console.log(err);
		});


	if (res.data.result)
	    ctx.body = {
	        ok: true
	    }
	else
	    ctx.body = {
	        ok: false,
	        msg: res.data.errorMessage
	    }

});

router.post('/res/get_user', async ctx => {
	if (!ecdsa.verify(ctx.request.header.user_name, ctx.request.header.signature, publicKey)) {
	    ctx.body = { ok: false, msg: 'Authorization Failed' }
	    return;
	}

	let user = await models.Users.findOne({ where: { name: ctx.request.header.user_name } });

    ctx.body = {
        ok: true,
        user: user
    }
});

router.post('/res/set_wallet', async ctx => {
	if (!ecdsa.verify(ctx.request.header.user_name, ctx.request.header.signature, publicKey)) {
	    ctx.body = { ok: false, msg: 'Authorization Failed' }
	    return;
	}

	let new_wallet = await userInfo.setWallet(ctx.request.header.user_name, ctx.request.body.address);

	if (new_wallet)
	    ctx.body = {
	        ok: true,
	        address: new_wallet
	    }
	else
	    ctx.body = {
	        ok: false
	    }
});

router.post('/res/get_vault', async ctx => {
	if (!ecdsa.verify(ctx.request.header.user_name, ctx.request.header.signature, publicKey)) {
	    ctx.body = { ok: false, msg: 'Authorization Failed' }
	    return;
	}

	let vault = await userInfo.getVault(ctx.request.header.user_name);

    ctx.body = {
        ok: true,
        vault: vault
    }
});

router.post('/res/get_reward', async ctx => {
	if (!ecdsa.verify(ctx.request.header.user_name, ctx.request.header.signature, publicKey)) {
	    ctx.body = { ok: false, msg: 'Authorization Failed' }
	    return;
	}

	let reward = await userInfo.getReward(ctx.request.header.user_name);

    ctx.body = {
        ok: true,
        reward: reward
    }
});

router.post('/res/end_game', async ctx => {
	if (!ecdsa.verify(ctx.request.header.user_name, ctx.request.header.signature, publicKey)) {
	    ctx.body = { ok: false, msg: 'Authorization Failed' }
	    return;
	}

	let res = await userInfo.endGame(ctx.request.header.user_name, ctx.request.body.game_address);

    ctx.body = {
        ok: res
    }
});

router.post('/res/withdraw_mith', async ctx => {
	if (!ecdsa.verify(ctx.request.header.user_name, ctx.request.header.signature, publicKey)) {
	    ctx.body = { ok: false, msg: 'Authorization Failed' }
	    return;
	}

	let res = await userInfo.withdrawMith(ctx.request.header.user_name);

    ctx.body = {
        ok: res
    }
});

router.post('/res/add_friend', async ctx => {
	if (!ecdsa.verify(ctx.request.header.user_name, ctx.request.header.signature, publicKey)) {
	    ctx.body = { ok: false, msg: 'Authorization Failed' }
	    return;
	}

	let res = await userInfo.addFriend(ctx.request.header.user_name, ctx.request.body.new_friend);

    ctx.body = {
        ok: res
    }
});

router.post('/res/get_friends', async ctx => {
	if (!ecdsa.verify(ctx.request.header.user_name, ctx.request.header.signature, publicKey)) {
	    ctx.body = { ok: false, msg: 'Authorization Failed' }
	    return;
	}

	let res = await userInfo.getFriends(ctx.request.header.user_name);

    ctx.body = {
        ok: true,
        friends: res
    }
});

router.post('/res/first_win_exist', async ctx => {
	if (!ecdsa.verify(ctx.request.header.user_name, ctx.request.header.signature, publicKey)) {
	    ctx.body = { ok: false, msg: 'Authorization Failed' }
	    return;
	}

	let first_win_exist = await userInfo.firstWinExist(ctx.request.header.user_name);

    ctx.body = {
        ok: true,
        first_win_exist: first_win_exist
    }
});




// for demo
router.get('/admin/end_cycle', async ctx => {
	await userInfo.endCycle();

    ctx.body = {
        ok: true
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