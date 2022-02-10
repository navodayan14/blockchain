pragma solidity >=0.4.22 <0.9.0;

contract DaiToken{

event Transfer(address _from, address _to, uint256 _value);
event Approval(address  _owner, address _spender, uint256 _value);

string public name="Dai Token";
string public symbol="DAI";
uint256 public totalsupply=1000000000000000000000000;
uint8 public decimals=18;

mapping(address=>uint256) public balance;
mapping(address=>mapping(address=>uint256)) public allowence;

constructor () public {
balance[msg.sender]=totalsupply;
}



modifier isright(uint256 _bal,uint256 _val)
{
require(_bal>=_val,"not adequate balance");
_;

}



modifier isallow(address _parent,address _child,uint256 _value)
{
   require(allowence[_parent][_child]>=_value,'not allowed' );
   _;
}






function transfer(address _to, uint256 _value) public isright(balance[msg.sender],_value) returns (bool)
{
  balance[msg.sender]-=_value;
  balance[_to]+=_value;
  emit Transfer(msg.sender,_to,_value);
  return true;

}




function tranferFrom (address _from ,address _to,uint256 _value) public isright(balance[_from],_value) isallow(_from,msg.sender,_value)  returns (bool)
{
balance[_from]-=_value;
balance[_to]+=_value;
 allowence[_from][msg.sender] -= _value;
emit Transfer(_from,_to,_value);
return true;
}


function approve(address _spender,uint256 _value)public returns(bool)
{
allowence[msg.sender][_spender]=_value;
emit Approval(msg.sender,_spender,_value);
return true;
}


}