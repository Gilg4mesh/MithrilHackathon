const fs = require('fs')
const Web3 = require('web3')

const web3 = new Web3(new Web3.providers.HttpProvider('https://testnet-rpc.dexon.org'))
// const web3 = new Web3(new Web3.providers.WebsocketProvider('wss://ws-proxy.dexon.org'))

const ADDR_FACTORY = '0xcb95a144fCb142B8f5464c5BCE1699786dad9EB1'
const ABI_FACTORY = JSON.parse(fs.readFileSync(__dirname + '/../lobby.abi', 'utf-8'))
const ABI_GAME = JSON.parse(fs.readFileSync(__dirname + '/../ramiel.abi', 'utf-8'))

const SOURCE = 'ramiel-v2-dxn.sol'

const contrLobby = new web3.eth.Contract(ABI_FACTORY, ADDR_FACTORY)

async function checkGameParticipant(gameAddress, playerAccount) {
  // check isGame
  const isGame = await contrLobby.methods.isGame(gameAddress).call()
  if (!isGame) {
    throw new Error('Game address not redeemible.')
  }

  const contrGame = new web3.eth.Contract(ABI_GAME, gameAddress)
  const playerInfo = await contrGame.methods.players(playerAccount).call()

  if (!playerInfo.started) {
    throw new Error('The player is not a participant of this game.')
  }

  return true
}


checkGameParticipant(
  '0xF5a42E2e14B6dDCeD475bB90cC655ba363f7572b',
  '0x355d949c99e708e6d84e3341182029ce96b5c8f2',
)
.then(success => {
  if (success) {
    console.log('Yes!')
  }
})
.catch(error => {
  console.log('No.', error.message)
})



module.exports = Object.freeze({
    checkGameParticipant: checkGameParticipant
});