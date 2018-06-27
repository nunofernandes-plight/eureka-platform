const Eureka = artifacts.require('./eureka.sol');
const Utils = artifacts.require('./Utils.sol');
const Safemath = artifacts.require('./SafeMath.sol');

let EUREKA_CONTRACT_ADDRESS = '';

module.exports = (deployer) => {
  deployer.deploy(Utils);
  // deployer.deploy(Safemath);
  deployer.link(Utils, Eureka);
  // deployer.link(Safemath, Eureka);
  deployer.deploy(Eureka)
    .then(contract => {
      EUREKA_CONTRACT_ADDRESS = contract.address;
    });
};
exports.EUREKA_CONTRACT_ADDRESS = EUREKA_CONTRACT_ADDRESS;
