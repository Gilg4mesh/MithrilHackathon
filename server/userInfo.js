const axios = require('axios');
const models = require('../models');
const Sequelize = require('sequelize')
const BigNumber = require('bignumber.js');
const Op = Sequelize.Op;




async function setWallet(user_name, new_address) {
    let user = await models.Users.findOne({ where: { name: user_name } });
    let wallet =  await models.Wallets.create({
    	user_id: user.id,
        address: new_address
    }).catch(err => {
    	return false;
    });

    if (!wallet)
    	return false;

    user.current_address = wallet.dataValues.address;
    user.save();

    return user.current_address;
}

async function checkGame(game_address, user_address) {
    return true;
}

async function endGame(user_name, game_address) {
    let user = await models.Users.findOne({ where: { name: user_name } });
    let game_address_used = await models.History.findOne({ where: { user_id: user.id, game_addr: game_address } });
    if (game_address_used != null || !checkGame(game_address, user.current_address))
    	return false;

    let has_first_win = await models.History.findOne({ where: { user_id: user.id, done: false } });
    let reward = has_first_win == null ? 2 : 1;
    // if (with_friend) reward = reward * 1.2;

    let success = await models.History.create({
    	game_addr: game_address,
        user_addr: user.current_address,
        user_id: user.id,
        reward: reward
    }).catch(err => {
    	return false;
    });

    if (!success)
    	return false;

    user.interest = user.interest + reward;
    user.save();

    return true;
}

async function getVault(user_name) {
    let user = await models.Users.findOne({ where: { name: user_name } });
    let res = await axios.get('https://mith.ramiel.io/api/user/' + user.uuid);
    if (!res.data.result)
    	return false;

    // console.log(res.data)
    return res.data;
}

async function firstWinExist(user_name) {
    let user = await models.Users.findOne({ where: { name: user_name } });
    let has_first_win = await models.History.findOne({ where: { user_id: user.id, done: false } });

    return has_first_win == null ? true : false;
}

async function getReward(user_name) {
    let user = await models.Users.findOne({ where: { name: user_name } });
    let reward = await models.History.sum('reward', { where: { user_id: user.id, done: 0 } });

    // console.log(res.data)
    return reward;
}

async function withdrawMith(user_name) {
    let user = await models.Users.findOne({ where: { name: user_name } });
    let res = await axios.post('https://mith.ramiel.io/api/withdraw', { uid: user.uuid, amount: user.interest });
    user.interest = 0;
    user.save();

    return res.data.result;
}


async function addFriend(user_name, new_friend) {
    let user = await models.Users.findOne({ where: { name: user_name } });
    let friend_user = await models.Users.findOne({ where: { name: new_friend } });

    if (friend_user == null)
    	return false;

	models.Friends.create({
    	user_id: user.id,
        friend_id: friend_user.id
    }).catch(err => {
    	return false;
    });

    return true;
}

async function getFriends(user_name) {
    let user = await models.Users.findOne({ where: { name: user_name } });
    let friend_id_list = await models.Friends.findAll({ where: { user_id: user.id }, attributes: ['friend_id'] })
	.then(friends => friends.map(friend => friend.friend_id));
    let friend_list = await models.Users.findAll({ where: { id: { [Op.in]: friend_id_list } } });

    return friend_list;
}



async function endCycle() {
    let users = await models.Users.findAll({ where: { interest: { [Op.ne]: 0 } } });
    users.map(async user => {
    	let reward = await models.History.sum('reward', { where: { done: 0 } });
    	await models.History.update({ done : true }, { where: { user_id: user.id, done: 0 } });

    	let s_reward = new BigNumber(reward);
    	let s_interest = new BigNumber(user.interest);

    	// console.log(reward + " " + user.interest + " " + (user.interest + reward) * 0.01);
		if (reward > s_interest.times(0.01).toNumber()) {
			user.interest = s_interest.times(1.01).toNumber();
			user.save();
		}
		else {
			let force_withdraw = ((user.interest - reward) - s_reward.times(100).toNumber());
			force_withdraw = new BigNumber(0.5).times(force_withdraw).toNumber();
			await axios.post('https://mith.ramiel.io/api/withdraw', { uid: user.uuid, amount: force_withdraw });
			user.interest = s_interest.minus(force_withdraw).toNumber();
			user.save();
		}
	});



    return true;
}



module.exports = Object.freeze({
    setWallet: setWallet,
    getReward: getReward,
    getVault: getVault,
    withdrawMith: withdrawMith,
    endGame: endGame,
    endCycle: endCycle,
    addFriend: addFriend,
    getFriends: getFriends,
    firstWinExist: firstWinExist
});