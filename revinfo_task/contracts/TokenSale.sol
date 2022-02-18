pragma solidity >=0.4.22 <0.9.0;

import './DappToken.sol';

contract TokenSale{

address payable public  devWallet; /*dev Wallet address*/
DappToken dappToken;
uint256 public tokenPrice=1;  /*price of a token */




/*intializing dappToken and address of dev Wallet */
constructor (DappToken _dapptoken) public {
dappToken=_dapptoken;
devWallet=payable(msg.sender);
 }





/*events */
event BUY(address _to,uint256 tokens);
event SELL(address _from,uint256 tokens);









/* a safe math function for multiplication */
 function mul(uint x, uint y) internal pure returns (uint z) {
        require(y == 0 || (z = x * y) / y == x, "ds-math-mul-overflow");
    }


/* returns total amount needed to buy a token along with 10% tax
*/
function balanceReq(uint256 _val)internal returns(uint256)
{
    uint256 simpleMoney=mul(tokenPrice,_val);
    uint256 tax=simpleMoney/10;
    return simpleMoney+tax;
}










/* checks that user selling token has enough tokens*/
modifier enoughbalance(address _cust,uint256 _tokens){
    require(dappToken.balance(_cust)>=_tokens,'not balance');
    _;
}

/*checks that liquidity account have more tokens than the 
user requisting for */
modifier enoughtokens(uint256 _val){
    require(dappToken.balance(address(this))>=_val,'not enough tokens');
    _;
}

/*checks that person buying the token has sended proper amount*/
modifier enoughamount(uint256 _tokens,uint256 _amount){
uint256 money=balanceReq(_tokens);
require(money<=_amount,'not adequate money');
    _;

}


/*checks that the account of liquidity contains proper ether*/
modifier enoughliquidity(uint256 _tokens)
{
   uint256 reqliquidity=balanceReq(_tokens);
   require(address(this).balance>=reqliquidity,'not enought liquidity');
    _;
}









/*this is the function when anyone want to buy the token*/
function buyToken(uint256 _amount)public enoughtokens(_amount)  enoughamount(_amount,msg.value)  payable{
uint256 tokencounts=_amount;
dappToken.transfer(msg.sender,tokencounts);
uint256 devMoney=msg.value/20;    //5% of tax
devWallet.send(devMoney);
emit BUY(msg.sender,tokencounts);
}




/* this is the function when anyone want to sell his token*/
function sellToken(uint256 tokens)public enoughbalance(msg.sender,tokens)  enoughliquidity(tokens) {
dappToken.tranferFrom(msg.sender,address(this),tokens);
uint256 amount=mul(tokens,tokenPrice);
uint256 custAmount=mul(amount,9)/10; //90% of net amount
address payable cust=payable(msg.sender);
cust.transfer(custAmount);
devWallet.transfer(amount/20);    //5% of net amount
emit SELL(msg.sender, tokens);
}



} 
/* 
sir/mam,
i have taken the address who is deploying as dev Wallet and
smartcontracts address as liquidity address.
thanks for reveiwing my code
regards
ravikant mishra
iet lucknow
*/