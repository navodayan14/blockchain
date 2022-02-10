var assert = require('assert');

var Election = artifacts.require("./Election.sol");


contract("Election",function(accounts){
  let instance;
    before(
        async function()
        {
            instance=await Election.deployed();
        }
    );

    it("intisialised with two candidates....", 
    async function(){
    let  count= await instance.candidatecount();
    assert(count==2);
    }
    );

it("initialised with currect name",async function()
{
    let candidate=await instance.Candidates(1);

    assert(candidate[0].toNumber()===1);
    assert(candidate[1]==="candidate 1");
    assert(candidate[2].toNumber()===0);
   

    candidate=await instance.Candidates(2);

    assert(candidate[0].toNumber()===2);
    assert(candidate[1]==="candidate 2");
    assert(candidate[2].toNumber()===0);


}) ;

   it("vote is going the way, no one can vote twice,event also emitted",async function(){

  let reciept=await instance.vote(1, {from : accounts[1]});
  let voter=await instance.voted(accounts[1]);
  assert(voter==true);

  let candidate=await instance.Candidates(1);
  assert(candidate[2].toNumber()==1);

  try{
  await instance.vote(1, {from: accounts[1]});
}

  catch (e){
    assert(e.message.includes("votetwice"));
  }

assert.equal(reciept.logs.length,1);
assert.equal(reciept.logs[0].event,"VoteDone");
assert.equal(reciept.logs[0].args.candidate_id.toNumber(),1);

   });













    });
    

