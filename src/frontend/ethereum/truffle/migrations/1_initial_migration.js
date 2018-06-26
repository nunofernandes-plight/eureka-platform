const eureka = artifacts.require('./eureka.sol');
const utils = artifacts.require('./Utils.sol');
const safemath = artifacts.require('./SafeMath.sol');

let EUREKA_CONTRACT_ADDRESS = '';

const deploy = async deployer => {
  // overwrite: false --> Don't deploy this contract if it has already been deployed
  await deployer.deploy(utils, {overwrite: false});
  await deployer.deploy(safemath, {overwrite: false});
  await deployer.link(utils, eureka);
  await deployer.link(safemath, eureka);
  deployer.deploy(eureka, {overwrite: false}).then(contract => {
    EUREKA_CONTRACT_ADDRESS = contract.address;
  });
};

module.exports = deploy;
exports.EUREKA_CONTRACT_ADDRESS = EUREKA_CONTRACT_ADDRESS;
