// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;


import "./DaiToken.sol";
import "./DappToken.sol";



contract TokenFarm{

string public name ="Dapp token farm";
DappToken public dapptoken;
DaiToken public daitoken;
mapping (address=>uint256) public stakedamount;
mapping(address=>bool) public hasstaked;
address [] public stakedpersons;
address owner;

constructor(DappToken _token1,DaiToken _token2) public {
dapptoken=_token1;
daitoken=_token2;
owner=msg.sender;
}

function stakeToken(uint256 amount) public{

    //daitoken.approve(address(this),amount);
    daitoken.tranferFrom(msg.sender, address(this), amount);

   if(!hasstaked[msg.sender])
   {
       hasstaked[msg.sender]=true;
       stakedpersons.push(msg.sender);
   }
   stakedamount[msg.sender]+=amount;
}

modifier onlyby(address _caller)
{
    require(_caller==owner,'only owner');
    _;
}



function issueToken() public onlyby(msg.sender) {

    for(uint i=0;i<stakedpersons.length;i++)
{
        address investor=stakedpersons[i];
        uint256 bal=stakedamount[investor];
        if(bal>0)
      { dapptoken.transfer(investor,bal);}
    }
}

modifier stakedandhave(address _investor)
{
    require(hasstaked[_investor]==true,'person not staked');
    require(stakedamount[_investor]>0,'have not balance');
    _;
}

function unissueToken() public stakedandhave(msg.sender) {

  uint256 _value=stakedamount[msg.sender];
  daitoken.transfer(msg.sender, _value);
  stakedamount[msg.sender]=0;
  hasstaked[msg.sender]=false;
 

}






}