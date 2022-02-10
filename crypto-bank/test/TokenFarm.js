var assert=require('assert');

const DaiToken = artifacts.require('DaiToken')
const DappToken = artifacts.require('DappToken')
const TokenFarm = artifacts.require('TokenFarm')


  function tokens(n) {
    return web3.utils.toWei(n, 'ether');
  };

  contract(TokenFarm,(accounts)=>
  {
   let daiToken;
   let dappToken;
   let tokenFarm;
   before(async () => {
      
        daiToken = await DaiToken.new();
        dappToken = await DappToken.new();
        tokenFarm = await TokenFarm.new(dappToken.address, daiToken.address);
        await dappToken.transfer(tokenFarm.address,'1000000000000000000000000');

        await daiToken.transfer( accounts[1],'100000000000000000000');
     
      });
    


  describe("mock-dai deployment ",async ()=>
  {
    
    it("has a name",async()=>
    {
     let dai=await DaiToken.deployed();
     let name=await dai.name();
     assert.equal(name,"Dai Token");
    }
    
    );

  });


  describe("dapp token deployment ",async ()=>
  {
    
    it("has a name",async()=>
    {
     let dapp=await DappToken.deployed();
     let name=await dapp.name();
     assert.equal(name,"Dapp Token");
    }
    
    );
  });


    describe(" tokenfarm deployment ",async ()=>
    {
     
      it("has a name",async()=>
      {
      // let tokenfarm=await TokenFarm.deployed();
       let name=await tokenFarm.name();
       assert.equal(name,"Dapp token farm");
      }
      );

      it("contract has some money",async()=>
      {
         let balance=await dappToken.balance(tokenFarm.address);
         assert.equal(balance.toString(),tokens('1000000'));

      });

  });

  describe("person has staked",async ()=>{
  
    
  it("initial amount is good",async()=>{
    let bal=await daiToken.balance(accounts[1]);
    let balo=await daiToken.balance(tokenFarm.address);
    assert.equal(bal.toString(),tokens('100'));
    assert.equal(balo.toString(),tokens('0'));

  });

   it("transforfrom took placed",async ()=>{


    await daiToken.approve(tokenFarm.address,tokens('30'),{from:accounts[1]});
    let allowed=await daiToken.allowence(accounts[1],tokenFarm.address);

     assert.equal(allowed.toString(),tokens('30'),"worked this");

    await tokenFarm.stakeToken(tokens('30'),{from:accounts[1]});

  

   let bal=await daiToken.balance(accounts[1]);

   let balo=await daiToken.balance(tokenFarm.address);

   assert.equal(bal.toString(),tokens('70'));

   assert.equal(balo.toString(),tokens('30'));

   });


  });


  describe('person is issued with dapptokens',async ()=>{
   
     it('before issuing',async()=>{
    let bal1=await dappToken.balance(accounts[1]);
    let bal2=await dappToken.balance(accounts[2]);
    assert.equal(bal1.toString(),tokens('0'));
    assert.equal(bal2.toString(),tokens('0'));
    });

    it("amount has been issued",async()=>{
     
    await tokenFarm.issueToken({from:accounts[0]});
    let bal1=await dappToken.balance(accounts[1]);
    let bal2=await dappToken.balance(accounts[2]);
    assert.equal(bal1.toString(),tokens('30'));
    assert.equal(bal2.toString(),tokens('0'));
    });;

    it("only owner can send the stuff",async()=>{
      try{
    await tokenFarm.issueToken({from:accounts[1]});
   throw("wrong!");}
    catch(err){
      assert(err.message.includes("only owner"));
    }
    
    });


  });

 describe('unissue works properly',async ()=>{
  it('unissue works proprly',async()=>{
    await tokenFarm.unissueToken({from:accounts[1]});
    let bal=await daiToken.balance(accounts[1]);
    assert.equal(bal.toString(),tokens('100'));
    let bal2=await daiToken.balance(tokenFarm.address);
    assert.equal(bal2.toString(),tokens('0'));
    let suc=await tokenFarm.hasstaked(accounts[1]);
     assert.equal(suc,false);
  });
 });




});