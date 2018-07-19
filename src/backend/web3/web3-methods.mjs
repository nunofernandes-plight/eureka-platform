import web3 from './web3Instance.mjs';
import getAccounts from "./get-accounts.mjs";

let accounts = [];

const testMethod = async (eurekaTokenContract, eurekaPlatformContract) => {

  await mintEurekaTokens(eurekaTokenContract, eurekaPlatformContract);

  // let bytes = web3.utils.padRight(web3.utils.utf8ToHex("salit"), 64);
  let bytes = web3.utils.utf8ToHex("sali");

  console.log(bytes);
  console.log(eurekaPlatformContract.options.address);
  console.log(accounts[1]);

  // submit Article = send submission fee to service contract
  await eurekaTokenContract.methods
    .transferAndCall(eurekaPlatformContract.options.address, 5000, bytes)
    // .transferAndCall(accounts[1], 5000, bytes)
    .send({
      from: accounts[0]
    })
    .then((receipt) => {
      console.log(receipt);
    })
    .catch((err) => {
      console.error(err)
    });

  //  WORKS
  // await eurekaPlatformContract.methods
  //   .submitTestArticle (bytes, 300)
  //   .send({
  //     from: accounts[1]
  //   })
  //   .then((receipt) => {
  //     console.log(receipt);
  //   })
  //   .catch((err) => {
  //     console.error(err)
  //   });
};


const mintEurekaTokens = async (eurekaTokenContract, eurekaPlatformContract) => {
  accounts = await getAccounts();

  accounts.push(eurekaPlatformContract.options.address);

  let amounts = [];

  let amount = 10000;
  accounts.forEach(() => {
    amounts.push(amount);
  });

  let gasEstimated = await eurekaTokenContract.methods.mint(accounts, amounts)
    .estimateGas({
      from: accounts[0]
    });

  //Minting
  await eurekaTokenContract.methods
    .mint(accounts, amounts)
    .send({
      from: accounts[0],
      gas: gasEstimated
    })
    .then((receipt) => {
      return receipt;
    });

  await eurekaTokenContract.methods
    .finishMinting()
    .send({
      from: accounts[0]
    })
    .then((receipt) => {
      return receipt;
    });

  eurekaTokenContract.methods
    .totalSupply()
    .call({from: accounts[0]})
    .then( succ => {
      console.log('Total Supply: ' + succ);
    });
};

export default testMethod;
