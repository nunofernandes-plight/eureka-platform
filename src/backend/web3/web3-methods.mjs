import web3 from './web3Instance.mjs';
import getAccounts from "./get-accounts.mjs";

let accounts = [];

const testMethod = async (eurekaTokenContract, eurekaPlatformContract) => {

  await mintEurekaTokens(eurekaTokenContract);

  // submit Article = send submission fee to service contract
  await eurekaTokenContract.methods
    .transferAndCall(eurekaPlatformContract.options.address, 5000, "0x0")
    .send({
      from: accounts[1]
    })
    .then((receipt) => {
      console.log(receipt);
    })
    .catch((err) => {
      console.error(err)
    });
};


const mintEurekaTokens = async (eurekaTokenContract) => {
  accounts = await getAccounts();

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
