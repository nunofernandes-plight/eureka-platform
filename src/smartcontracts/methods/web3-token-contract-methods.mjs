import {getGasEstimation} from './web3-utils-methods.mjs';

export const mintEurekaTokens = async (
  eurekaTokenContract,
  accounts,
  amounts,
  owner
) => {
  let gasEstimated = await getGasEstimation(
    eurekaTokenContract.methods.mint(accounts, amounts)
  );

  //Minting
  return eurekaTokenContract.methods.mint(accounts, amounts).send({
    from: owner,
    gas: gasEstimated
  });
};

export const finishMinting = (contract, owner) => {
  return contract.methods.finishMinting().send({
    from: owner
  });
};

export const submitArticle = (_contract, _to, _amount, _data) => {
  return _contract.methods
    .transferAndCall(
      _to,
      _amount,
      '0x0861681c',
      _data
    )
};

/*
  Getters
 */

export const getBalanceOf = (contract, account) => {
  return contract.methods.balanceOf(account).call({from: account});
};

export const getTotalSupplyOf = (contract, fromAccount) => {
  return contract.methods.totalSupply().call({from: fromAccount});
};
