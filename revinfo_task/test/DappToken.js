var assert = require('assert')
var DappToken = artifacts.require('./DappToken.sol')

function tokens(n) {
  return web3.utils.toWei(n, 'ether')
}

contract('DappToken', function (accounts) {
  let instance = null
  before(async function () {
    instance = await DappToken.deployed()
  })

  it('intialised with correct values', async function () {
    var _name = await instance.name()
    var _symbol = await instance.symbol()
    var _totalsupply = await instance.totalsupply()
    var _owner = await instance.owner()
    var _balance = await instance.balance(_owner)
    var _bal = await instance.balance(accounts[2])
    assert.equal(_name, 'Dapp Token', 'correct name')
    assert.equal(_symbol, 'DAT', 'correct type')
    assert.equal(_totalsupply.toString(), tokens('101000'), 'correct supply')
    assert(_owner != '0x0', 'owner has a address')
    assert.equal(_balance.toString(), tokens('100000'), 'owner has all balance')
    assert.equal(_bal.toString(), tokens('0'))
  })

  it('transfer is going good', async function () {
    var success = await instance.transfer(accounts[2], tokens('1000'), {
      from: accounts[0],
    })
    var _ownerbalance = await instance.balance(accounts[0])
    var _toaccount = await instance.balance(accounts[2])
    // assert(success==true,"return true");
    assert.equal(_ownerbalance.toString(), tokens('99000'), 'amount deducted')
    assert.equal(
      _toaccount.toString(),
      tokens('1000'),
      '_to account has credited'
    )
  })

  it('event got emitted on transfer', async function () {
    var reciept = await instance.transfer(accounts[3], tokens('100'), {
      from: accounts[0],
    })
    assert(reciept.logs.length == 1)
    assert.equal(reciept.logs[0].event, 'Transfer')
    assert(reciept.logs[0].args._to == accounts[3])
    assert(reciept.logs[0].args._value.toString() == tokens('100'))
    assert(reciept.logs[0].args._from == accounts[0])
  })

  it('transfer modifier are working', async function () {
    try {
      var success = await instance.transfer(accounts[3], tokens('98901'), {
        from: accounts[0],
      })
      throw 'wrong!!'
    } catch (err) {
      assert(err.message.includes('not adequate balance'))
    }
  })

  it('approval is right and event emmited', async function () {
    var reciept = await instance.approve(accounts[4], tokens('100'), {
      from: accounts[2],
    })
    var _val = await instance.allowence(accounts[2], accounts[4])
    assert(_val.toString() == tokens('100'), 'correct approval amount')

    assert(reciept.logs.length == 1)
    assert.equal(reciept.logs[0].event, 'Approval')
    assert(reciept.logs[0].args._owner == accounts[2])
    assert(reciept.logs[0].args._value.toString() == tokens('100'))
    assert(reciept.logs[0].args._spender == accounts[4])
  })

  it('approval modifier are working ', async function () {
    try {
      var reciept = await instance.approve(accounts[4], tokens('1001'), {
        from: accounts[2],
      })
      throw 'wrong!!'
    } catch (err) {
      assert(err.message.includes(' not adequate balance'))
    }
  })

  it('transforfrom is on the way and event is emmitting', async function () {
    let reciept = await instance.tranferFrom(
      accounts[2],
      accounts[3],
      tokens('80'),
      { from: accounts[4] }
    )
    let _frombal = await instance.balance(accounts[2])
    let _tobal = await instance.balance(accounts[3])
    assert(_frombal.toString() == tokens('920'))
    assert(_tobal.toString() == tokens('180'))

    assert(reciept.logs.length == 1)
    assert.equal(reciept.logs[0].event, 'Transfer')
    assert(reciept.logs[0].args._to == accounts[3])
    assert(reciept.logs[0].args._value.toString() == tokens('80'))
    assert(reciept.logs[0].args._from == accounts[2])
  })

  it('transferfrom will allow only correct amount', async function () {
    try {
      var reciept = await instance.tranferFrom(
        accounts[2],
        accounts[3],
        tokens('21'),
        { from: accounts[4] }
      )
      throw 'wrong!!'
    } catch (err) {
      assert(err.message.includes('not allowed'))
    }
  })
})
