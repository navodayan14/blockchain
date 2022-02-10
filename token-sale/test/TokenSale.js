
var DappToken=artifacts.require('./DappToken.sol');
var TokenSale=artifacts.require('./TokenSale.sol');
var assert=require('assert');



function tokens(n) {
    return web3.utils.toWei(n, 'ether');
  };


contract(TokenSale,async (accounts)=>{
let tokenSale=null;
let dappToken=null;

    before (async()=>{
     dappToken=await DappToken.deployed();
     tokenSale=await TokenSale.deployed();
    });

describe("deployed correctly",async()=>{

    it ("owner is defined",async()=>{

   let _owner=await tokenSale.owner();
   assert.equal(_owner,accounts[0]);

    }); });

    describe("priced correctly",async()=>{

        it ("price is defined",async()=>{
    
       let bal0=await tokenSale.tokenPrice();
       await tokenSale.setPrice(2,{from:accounts[0]});
       let bal1=await tokenSale.tokenPrice();

       assert.equal(bal0,0);
       assert.equal(bal1,2);
    
        });
        it ("only owner can set price",async()=>{
    
             try{
            await tokenSale.setPrice(101,{from:accounts[1]});}
            catch(err){
                let bal1=await tokenSale.tokenPrice();
                assert.equal(bal1,2);
                assert(err.message.includes("only owner"));
            }
          
         
             });

});

describe('buying works normaly',async()=>{
it('amount got transffred',async()=>{
 await tokenSale.buyToken(tokens('10'),{from:accounts[3],value:tokens('20')});
 let bal1=await dappToken.balance(accounts[3]);
 let bal2=await dappToken.balance(tokenSale.address);
 let _sold=await tokenSale.tokensolded();
 assert.equal(bal1.toString(),tokens('10'),'right transfer');
 assert.equal(bal2.toString(),tokens('990'),'right deduction');
 assert.equal(_sold,tokens('10'),'right count increase');

});

it('less value is never accepted',async()=>{
    try{
 await tokenSale.buyToken(tokens('10'),{from:accounts[3],value:tokens('19')});}
 catch(err)
  {assert(err.message.includes('less amount'));}
});


it('more token than bank have is never accepted',async()=>{
    try{
 await tokenSale.buyToken(tokens('991'),{from:accounts[3],value:tokens('2000')});}
 catch(err)
  {   let bal=await dappToken.balance(accounts[3]);
      assert.equal(bal.toString(),tokens('10'),'i m gud');
      assert(err.message.includes('less tokens'));
   }
});






});







});