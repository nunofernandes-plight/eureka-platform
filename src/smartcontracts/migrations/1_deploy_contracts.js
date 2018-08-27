const EurekaToken = artifacts.require('./Eureka.sol');
const Utils = artifacts.require('./Utils.sol');

module.exports = function (deployer, network, accounts) {
	deployer.deploy(Utils, {from: accounts[0]});
	deployer.link(Utils, EurekaToken);
	deployer.deploy(EurekaToken, {from: accounts[0]});
};
