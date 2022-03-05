var assert = require('assert')
const { isMainThread } = require('worker_threads')
var Voting = artifacts.require('./Voting.sol')

contract('Voting', (accounts) => {
  let voting
  before(async function () {
    voting = await Voting.deployed()
  })

  describe('correct intialisation', () => {
    it('admin is correct', async () => {
      const admin = await voting.admin()
      assert(admin === accounts[0])
    })
  })

  describe('new voting is correct', () => {
    let reciept
    it('correct intializations', async () => {
      reciept = await voting.newVoting(['bjp', 'sp', 'cong'], '2', '5', {
        from: accounts[0],
      })
      let totalOptions = await voting.totalOptions()
      assert(totalOptions.toNumber() === 3)
      let startDelay = await voting.startDelay()
      assert(startDelay == 2)
      let duration = await voting.duration()
      assert(duration == 5)
      let creatingTime = await voting.creatingTime()
      assert(creatingTime != 0)
      let ind = await voting.findind('cong')
      assert(ind.toString() == '3', 'it right')
    })

    it('event emmited', async () => {
      assert(reciept.logs.length == 1)
      assert(reciept.logs[0].event === 'NewVoting')
    })

    it('other than admin not allowed', async () => {
      try {
        await voting.newVoting(['sp', 'cong'], '2', '5', { from: accounts[0] })
      } catch (e) {
        assert(e.message.includes('invalid person'))
      }
    })
  })

  describe('giving vote is going good', async () => {
    it('basic conditions are met', async () => {
      setTimeout(async () => {
        await voting.giveVote('sp', { from: accounts[2] })
        let isVoted = await voting.isVoted(accounts[2])
        assert(isVoted === true)
        let increasevote = await voting.resultArr[2]
      }, 12000)
    })
  })
})
