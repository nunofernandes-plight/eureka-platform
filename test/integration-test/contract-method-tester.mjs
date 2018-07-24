import web3 from '../../src/backend/web3/web3Instance.mjs';

let EurekaPlatformContract = undefined;
let account = undefined;

export default {
  setup: async (eurekaPlatformContract) => {
    return web3.eth.getAccounts()
      .then(accounts => {
        account = accounts[0];
        EurekaPlatformContract = eurekaPlatformContract;
        return account;
      });
  },
  // signUpEditor() on SC
  testSignUpEditor: () => {
    if (EurekaPlatformContract) {
      EurekaPlatformContract.methods.signUpEditor(account).send({
        from: account,
        gas: 4678127 //TODO change amount to sth which makes sense
      })
        .on('transactionHash', tx => {
          //this.addNewTx(tx, game.id, Status.GAME_JOINED);
          // this.setLoadingToTrue(game);
        })
        .on('receipt', res => {
          //console.log(res);
          console.log('Successful Editor Sign up for address ' + account);
        })
        .on('confirmation', function(confirmationNr) {
          // is returned for the first 24 block confirmations
        });
    } else {
      throw new Error('No setup Contract Method Tester - set it up with an adress');
    }
  },

  // StartSubmissionProcess on SC
/*  testStartSubmissionProcess: () => {
    if (EurekaPlatformContract) {
      //random input
      const articleHash = web3.utils.randomHex(32);
      const articleUrl = web3.utils.randomHex(32);
      const authors = ['0xc1912fee45d61c87cc5ea59dae31190fffff232d', 'c1912fee45d61c87cc5ea59dae31190fffff232d'];
      const linkedArticles = web3.utils.randomHex(32);


      EurekaPlatformContract.methods.startSubmissionProcess(
        account,
        articleHash,
        articleUrl,
        authors,
        linkedArticles
      ).send({
        from: account,
        gas: 4678127 //TODO change amount to sth which makes sense
      })
        .on('transactionHash', tx => {
          //this.addNewTx(tx, game.id, Status.GAME_JOINED);
          // this.setLoadingToTrue(game);
        })
        .on('receipt', res => {
          //console.log(res);
          console.log('Successful started submissionProcess ' + account);
        })
        .on('confirmation', function(confirmationNr) {
          // is returned for the first 24 block confirmations
        });
    } else {
      throw new Error('No setup Contract Method Tester - set it up with an adress');
    }
  }*/
};