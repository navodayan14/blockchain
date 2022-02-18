var DappToken = artifacts.require('./DappToken.sol')
var TokenSale = artifacts.require('./TokenSale.sol')
var assert = require('assert')

function tokens(n) {
  return web3.utils.toWei(n, 'ether')
}

contract(TokenSale, async (accounts) => {
  let tokenSale = null
  let dappToken = null

  before(async () => {
    dappToken = await DappToken.deployed()
    tokenSale = await TokenSale.deployed()
  })

  describe('deploying', async () => {
    it('owner is defined', async () => {
      let _owner = await tokenSale.devWallet()
      assert.equal(_owner, accounts[0])
    })
    it('buring happening successfully', async () => {
      let bal = await dappToken.balance(tokenSale.address)
      assert.equal(bal.toString(), tokens('75000000'))
      let totalsupply = await dappToken.totalsupply()
      assert.equal(totalsupply, tokens('75000000'))
    })
  })

  describe('buying ', async () => {
    it('amount got transffred', async () => {
      await tokenSale.buyToken(tokens('10'), {
        from: accounts[3],
        value: tokens('11'),
      })

      let bal1 = await dappToken.balance(accounts[3])
      let bal2 = await dappToken.balance(tokenSale.address)
      assert.equal(bal1.toString(), tokens('10'), 'right transfer')
      assert.equal(bal2.toString(), tokens('74999990'), 'right deduction')
    })

    it('less value is never accepted', async () => {
      try {
        await tokenSale.buyToken(tokens('10'), {
          from: accounts[3],
          value: tokens('10'),
        })
      } catch (err) {
        assert(err.message.includes('not adequate money'))
      }
    })

    it('more token than pool  is never accepted', async () => {
      try {
        await tokenSale.buyToken(tokens('74999991'), {
          from: accounts[4],
          value: tokens('74999991'),
        })
      } catch (err) {
        let bal = await dappToken.balance(accounts[3])
        assert.equal(bal.toString(), tokens('10'), 'i m gud')
        assert(err.message.includes('not enough tokens'))
      }
    })
  })

  describe('selling', async () => {
    it('selling normally', async () => {
      await dappToken.approve(tokenSale.address, tokens('5'), {
        from: accounts[3],
      })
      await tokenSale.sellToken(tokens('5'), { from: accounts[3] })
      let bal1 = await dappToken.balance(accounts[3])
      let bal2 = await dappToken.balance(tokenSale.address)
      assert.equal(bal1.toString(), tokens('5'))
      assert.equal(bal2.toString(), tokens('74999995'))
    })

    it('more tokens than the account has restricted', async () => {
      try {
        await tokenSale.sellToken(tokens('6'), {
          from: accounts[3],
        })
      } catch (err) {
        assert(err.message.includes('not balance'))
      }
    })
  })
})
