
// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract Voting{

mapping(address=>bool) public isVoted;
address [] public peopleVoted;

string []public votingOptions;
uint public totalCount;
uint public totalOptions;
uint256 public startDelay;
uint256 public duration;

uint256 []  private resultArr;
address public admin;
uint256 public creatingTime;


mapping (string=>uint) public findind;   
enum Stages{wait,voting,result}
Stages stage;



constructor() public {
 admin=msg.sender;
 totalCount=0;
}

event Voted(address _from,string _to);
event NewVoting(uint256 _options,uint256 _deley,uint256 _duration);





function updateTime() internal
{
if(creatingTime+startDelay*1 minutes<=block.timestamp && block.timestamp<=creatingTime+startDelay*1 minutes+duration*1 minutes)
{
 stage=Stages.voting;
}

else if(block.timestamp>=creatingTime+startDelay*1 minutes+duration*1 minutes)
{
 stage=Stages.result;
}
}


modifier onlyByAdmin(address user)
{
 require(user==admin,'invalid person');
 _;
}



function destroyVoting ()internal {
for(uint256 i=0;i<totalCount;i++)
{
 isVoted[peopleVoted[i]]=false;
}
totalCount=0;

while(peopleVoted.length>0)
{
 peopleVoted.pop();
}

while(votingOptions.length>0)
{
 findind[votingOptions[votingOptions.length-1]]=0;
 //voteCount[votingOptions[votingOptions.length-1]]=0;
  votingOptions.pop();
}
while(resultArr.length>0)
{
  resultArr.pop();
}

creatingTime=0;
}






function newVoting(string []memory _options,uint256 _startDelay,uint256 _duration) public onlyByAdmin(msg.sender){
destroyVoting();
for(uint256 i=0;i<_options.length;i++)
{
 votingOptions.push(_options[i]);
 findind[_options[i]]=i+1;
 resultArr.push(0);
}

totalOptions=votingOptions.length;
startDelay=_startDelay;
duration=_duration;
stage=Stages.wait;
creatingTime=block.timestamp;
emit NewVoting(_options.length,_startDelay,_duration);
}


modifier onlyNonVoted(address user)
{
 
 require(isVoted[user]==false,'already voted');
 _;
}


modifier onlyVotingTime()
{
 updateTime();
 require(stage==Stages.voting,'not voting time');
 _;
}



modifier correctOptions(string  memory _option )
{
 bool result=false;

 for(uint256 i=0;i<totalOptions;i++)
 {  
    if(keccak256(abi.encodePacked((votingOptions[i]))) == keccak256(abi.encodePacked((_option))))
    {
       result=true;
       break;
    }
 }
 require(result==true,'invalid option');
 _;
}


function giveVote(string memory _option) public correctOptions(_option)  onlyNonVoted(msg.sender) onlyVotingTime{
   isVoted[msg.sender]=true;
  // voteCount[_option]+=1;
   peopleVoted.push(msg.sender);
   totalCount++;
   resultArr[findind[_option]-1]+=1;
   emit Voted(msg.sender,_option);
}


modifier onlyResultTime()
{
   updateTime();
   require(stage==Stages.result,'wrong time');
   _;
}




function showResult() public onlyResultTime returns(uint256 [] memory){
  return (resultArr);
}



}