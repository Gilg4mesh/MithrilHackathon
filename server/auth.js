const models = require('../models');
const bcrypt = require('bcryptjs');
const uuidv4 = require('uuid/v4')
const jwa = require('jwa');
const fs = require('fs');
const privateKey = fs.readFileSync(__dirname + '/../rs256-4096-private.rsa');
const publicKey = fs.readFileSync(__dirname + '/../rs256-4096-public.pem');
const ecdsa = jwa('RS256');


async function login(user_name, password) {
    let user = await models.Users.findOne({ where: { name: user_name } });
    
    if (user == null)
        return false;
    if(!bcrypt.compareSync(password, user.password))
        return false;

    let signature = ecdsa.sign(user.name, privateKey);
    return { "signature": signature, "uuid": user.uuid };
}


async function register(user_name, password) {
    let salt = bcrypt.genSaltSync(10);
    let hash = bcrypt.hashSync(password, salt);
    let user = await models.Users.findOne({ where: { name: user_name } });
    if (user != null) return false;
    let result = await models.Users.create({
        name: user_name,
        password: hash,
        uuid: uuidv4()
    });

    let signature = ecdsa.sign(user_name, privateKey);
    return { "signature": signature, "uuid": result.dataValues.uuid };
}


module.exports = {
    login,
    register
}