const DappToken = artifacts.require("./DAPPToken.sol");
const EthSwap=artifacts.require('./EthSwap.sol');

function tokens(n) {
    return web3.utils.toWei(n, 'ether');
  };


module.exports = async function (deployer,Networks,accounts) {

 await  deployer.deploy(DappToken,"Dapp Token","DAT",tokens('100000'));
 let dappToken=await DappToken.deployed();
 await deployer.deploy(EthSwap,dappToken.address);
 let ethSwap=await EthSwap.deployed();
 await dappToken.transfer(ethSwap.address,tokens('100000'),{from:accounts[0]});


};
