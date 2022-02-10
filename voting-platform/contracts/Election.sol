pragma solidity ^0.8.10;
contract Election {
    
  struct candidate{
  uint id;
  string name;
  uint votecount;
  }

mapping (address=>bool) public voted;

mapping(uint=>candidate) public Candidates;

  constructor(){
  addcandidate("candidate 1");
  addcandidate("candidate 2");
  
  }
 event VoteDone(uint candidate_id);

uint public candidatecount =0;

function addcandidate(string memory name) private{
candidate memory ktr;
candidatecount++;
ktr.id=candidatecount;
ktr.name=name;
ktr.votecount=0;
Candidates[candidatecount]=ktr;
}

modifier notvoted(address owner){
  require(
    !voted[owner],"votetwice"
  );
  _;
}


function vote(uint  cid) public notvoted(msg.sender){
voted[msg.sender]=true;
Candidates[cid].votecount++;
emit VoteDone(cid);
}


}
