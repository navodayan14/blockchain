var DappToken = artifacts.require('./DappToken.sol')
var TokenSale = artifacts.require("'./TokenSale.sol")

function tokens(n) {
  return web3.utils.toWei(n, 'ether')
}

module.exports = async function (deployer, networks, accounts) {
  await deployer.deploy(DappToken, 'Dapp Token', 'DAT', tokens('100000000'))
  let dappToken = await DappToken.deployed()

  await deployer.deploy(TokenSale, dappToken.address)
  let tokenSale = await TokenSale.deployed()
  await dappToken.burn(tokens('25000000'), {
    from: accounts[0],
  })
  await dappToken.transfer(tokenSale.address, tokens('75000000'), {
    from: accounts[0],
  })
}
