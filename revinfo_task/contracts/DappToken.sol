pragma solidity >=0.4.22 <0.9.0;

contract DappToken{

event Transfer(address _from, address _to, uint256 _value);
event Approval(address  _owner, address _spender, uint256 _value);
event Burn(address _from,uint256 _value);

string public name;
string public symbol;
uint256 public totalsupply;
uint256 public decimals=18;
address public owner;

mapping(address=>uint256) public balance;
mapping(address=>mapping(address=>uint256)) public allowence;

constructor (string memory _name,string memory _symbol,uint256 _totalsupply) public {
name=_name;
symbol=_symbol;
totalsupply=_totalsupply;
owner=msg.sender;
balance[owner]=totalsupply;
}

//for burning
function burn(uint256 _value) public isright(balance[msg.sender],_value) returns (bool)
{
  balance[msg.sender]-=_value;
  balance[address(0)]+=_value;
  totalsupply-=_value;
  emit Transfer(msg.sender,address(0),_value);
  emit Burn(msg.sender,_value);
  return true;
}


modifier isright(uint256 _bal,uint _val)
{
require(_bal>=_val,"not adequate balance");
_;

}



modifier isallow(address _parent,address _child,uint _value)
{
   require(allowence[_parent][_child]>=_value,'not allowed' );
   _;
}





//direct transfer
function transfer(address _to,uint256 _value) public isright(balance[msg.sender],_value) returns (bool)
{
  balance[msg.sender]-=_value;
  balance[_to]+=_value;
  emit Transfer(msg.sender,_to,_value);
  return true;

}



//transfer on behalf of someone
function tranferFrom (address _from ,address _to,uint256 _value) public isright(balance[_from],_value) isallow(_from,msg.sender,_value)  returns (bool)
{
balance[_from]-=_value;
balance[_to]+=_value;
allowence[_from][msg.sender]-=_value;
emit Transfer(_from,_to,_value);
return true;
}

//approving for transferfrom....providing behalf
function approve(address _spender,uint256 _value)public isright(balance[msg.sender],_value)  returns(bool)
{
allowence[msg.sender][_spender]=_value;
emit Approval(msg.sender,_spender,_value);
return true;
}


}