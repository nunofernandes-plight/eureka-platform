const eureka = artifacts.require('./eureka.sol');

const utils = artifacts.require('./Utils.sol');

const safemath = artifacts.require('./SafeMath.sol');

module.exports = async deployer => {
  // overwrite: false --> Don't deploy this contract if it has already been deployed
  await deployer.deploy(utils, {overwrite: false});
  await deployer.deploy(safemath, {overwrite: false});
  await deployer.link(utils, eureka);
  await deployer.link(safemath, eureka);
  await deployer.deploy(eureka, {overwrite: false});
};
