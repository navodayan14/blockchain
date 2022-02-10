

App = {
  web3Provider: null,
  contracts: {},
  account: '0x0',
  hasVoted: false,

  init: function() {
    return App.initWeb3();
  },

  initWeb3: function() {
    // TODO: refactor conditional
    if (typeof web3 !== 'undefined') {
      // If a web3 instance is already provided by Meta Mask.
      App.web3Provider = web3.currentProvider;
      web3 = new Web3(web3.currentProvider);
    } else {
      // Specify default instance if no web3 instance provided
      App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
      web3 = new Web3(App.web3Provider);
    }
    return App.initContract();
  },

  initContract: function() {
    $.getJSON("Election.json", function(election) {
      // Instantiate a new truffle contract from the artifact
      App.contracts.Election = TruffleContract(election);
      // Connect provider to interact with contract
      App.contracts.Election.setProvider(App.web3Provider);

       App.listenForEvents();

      return App.render();
    });
  },

  // Listen for events emitted from the contract
  listenForEvents:async function() {
    let instance= await App.contracts.Election.deployed();
      // Restart Chrome if you are unable to receive this event
      // This is a known issue with Metamask
      // https://github.com/MetaMask/metamask-extension/issues/2393
      instance.VoteDone({}, {
        fromBlock: 0,
        toBlock: 'latest'
      }).watch(function(error, event) {
        console.log("event triggered", event)

       App.render();
      });
    
  },






  render: async function() {
    
    var loader = document.querySelector("#loader");
    var content = document.querySelector("#content");

    loader.style.display="block";
    content.style.display="none";

    web3.eth.getCoinbase(function(err, account) {
      if (err === null) {
        App.account = account;
        var acadd=document.querySelector('#accountAddress');
        acadd.innerHTML=`Your Account: ${account}`;
      }
    });


    // Load contract data
     let  electionInstance = await App.contracts.Election.deployed();
    
     // var candidatesResults = document.querySelector
      $("#candidatesResults").empty();
      //candidatesResults.innerHTML="";

      $('#candidatesSelect').empty();
      //candidatesSelect.innerHTML="";

      let candidatesCount= await electionInstance.candidatecount();
      var candidateTemplate="";
      var candidateOption="";
      for (var i = 1; i <= candidatesCount.toNumber(); i++) {
       var candidate= await electionInstance.Candidates(i);
        
          var id = candidate[0].toNumber();
          var name = candidate[1];
          var voteCount = candidate[2].toNumber();

          // Render candidate Result
           candidateTemplate += "<tr><th>" + id + "</th><td>" + name + "</td><td>" + voteCount + "</td></tr>";
         // $('#candidatesResults').html(candidateTemplate);

           candidateOption += "<option value='" + id + "' >" + name + "</ option>";
         // $('#candidatesSelect').append(candidateOption);

        } 
        $('#candidatesResults').html(candidateTemplate);
        $('#candidatesSelect').html(candidateOption);


       var candi=await electionInstance.voted(App.account);
       if(candi)
       {
         var amp=document.querySelector('form');
         amp.style.display="none";
       }
      loader.style.display="none";
      content.style.display="block";
    },
  
  

  castVote: async function() {
    
   var candidateId =document.querySelector('#candidatesSelect').value;

   let electionInstance= await  App.contracts.Election.deployed();

   try{
   loader.style.display="block";
   content.style.display="none";
   await electionInstance.vote(candidateId, { from: App.account });
   alert("vote given");}
   catch(err){
     alert("vote not given!!");
   }
   
  
  }
};

$(function() {
  $(window).load(function() {
    App.init();
  });
});
