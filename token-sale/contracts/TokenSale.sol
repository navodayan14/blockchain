pragma solidity >=0.4.22 <0.9.0;

import './DappToken.sol';

contract TokenSale{

address payable public  owner ;
DappToken dappToken;
uint256 public tokenPrice;
uint256 public tokensolded;

constructor (DappToken _dapptoken) public {
dappToken=_dapptoken;
owner=msg.sender;
 }

event Sell(address _to, uint256 _tokencount);

modifier onlybyowner(address person)
{
require(owner==person,'only owner');
_;
}

function setPrice(uint256 _price) public onlybyowner(msg.sender)
{
tokenPrice=_price;
}
function mul(uint256 x, uint256 y) internal pure returns (uint256 z) {
        require(y == 0 || (z = x * y) / y == x, "ds-math-mul-overflow");
    }

modifier rightamount(uint256 _tokencounts,uint256 amount) {
 require(amount==mul(_tokencounts,tokenPrice),'less amount');
 _;
}

 

 modifier rightbalance(uint256 _tokencounts){
  require(dappToken.balance(address(this))>=_tokencounts,'less tokens');
  _;
 }



function buyToken(uint256 _tokencounts)public rightbalance(_tokencounts)  rightamount(_tokencounts,msg.value) payable{
   dappToken.transfer(msg.sender,_tokencounts);
   tokensolded+=_tokencounts;

  emit  Sell(msg.sender,_tokencounts);
   (bool sent, bytes memory data) = owner.call{value: msg.value}("");
        require(sent, "Failed to send Ether");
}










} 