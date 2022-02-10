pragma solidity >=0.4.22 <0.9.0;

import './DAPPToken.sol';

contract EthSwap {
    string public name="Eth Swap";
    DAPPToken dappToken;
    uint256 rate=100;

   constructor (DAPPToken _dappToken)public {
       dappToken=_dappToken;
   }

event BUY(address _to,uint256 tokens);
event SELL(address _from,uint256 tokens);

 function mul(uint x, uint y) internal pure returns (uint z) {
        require(y == 0 || (z = x * y) / y == x, "ds-math-mul-overflow");
    }
 function div(uint x,uint y)internal pure returns(uint z)
{
    z=x/y;
}
modifier enoughbalance(address _cust,uint256 _tokens){
    require(dappToken.balance(_cust)>=_tokens,'not balance');
    _;
}

modifier enoughtokens(uint256 _val){
    require(dappToken.balance(address(this))>=mul(rate,_val),'not tokens');
    _;
}

modifier enoughamount(uint256 _tokens){
require(address(this).balance>=div(_tokens,rate),'not money');
    _;
}




function buyToken()public enoughtokens(msg.value) payable{
uint256 tokencounts=mul(rate,msg.value);
dappToken.transfer(msg.sender,tokencounts);
emit BUY(msg.sender,tokencounts);
}


function sellToken(uint256 tokens)public enoughbalance(msg.sender,tokens)  enoughamount(tokens) {
dappToken.tranferFrom(msg.sender,address(this),tokens);
uint256 amount=div(tokens,rate);
address payable cust=payable(msg.sender);
cust.transfer(amount);
emit SELL(msg.sender, tokens);
}




}