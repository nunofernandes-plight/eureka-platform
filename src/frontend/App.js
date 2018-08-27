import React, {Component} from 'react';
import Web3 from 'web3';
import {Detector} from 'react-detect-offline';
import {getBalanceOf} from '../backend/web3/web3-token-contract-methods.mjs';
import MainRouter from './webpack/components/routers/MainRouter.js';
import Web3Providers from './web3/Web3Providers.js';
import NoConnection from './webpack/NoConnection.js';
import {getMetaMaskStatus} from './web3/IsLoggedIn.js';
import {getAllAccounts, getNetwork} from './web3/Helpers.js';
import platformABI from './web3/eurekaPlatform-ABI.json';
import tokenABI from './web3/eurekaToken-ABI.json';
import platformAddress from './web3/eurekaPlatform-Address.json';
import tokenAddress from './web3/eurekaToken-Address.json';

class App extends Component {
	constructor() {
		super();
		const EUREKA_PLATFORM_PROD_ADDRESS = ''; // TODO: change this to the EUREKA_PLATFORM_PROD_ADDRESS once deployed
		const EUREKA_TOKEN_PROD_ADDRESS = ''; // TODO: change this to the EUREKA_TOKEN_PROD_ADDRESS once deployed
		const web3 = window.web3;
		let web3Instance = null;
		let platformContract = null;
		let tokenContract = null;
		let provider;
		if (typeof web3 !== 'undefined' && web3.currentProvider.isMetaMask) {
			// MetaMask as main provider
			console.info('MetaMask detected in this browser');
			web3Instance = new Web3(web3.currentProvider);
			provider = Web3Providers.META_MASK;
			platformContract = new web3Instance.eth.Contract(
				platformABI,
				EUREKA_PLATFORM_PROD_ADDRESS
			);

			tokenContract = new web3Instance.eth.Contract(
				tokenABI,
				EUREKA_TOKEN_PROD_ADDRESS
			);
		} else {
			web3Instance = new Web3('http://localhost:7545');
			platformContract = new web3Instance.eth.Contract(platformABI);
			tokenContract = new web3Instance.eth.Contract(tokenABI);
			platformContract.options.address = platformAddress;
			tokenContract.options.address = tokenAddress;
			provider = Web3Providers.LOCALHOST;
		}

		console.log(tokenContract.options.address);
		console.log(platformContract.options.address);

		this.state = {
			web3: web3Instance,
			provider,
			metaMaskStatus: null,
			accounts: null,
			platformContract,
			tokenContract,
			selectedAccount: {
				address: null,
				balance: null,
				EKABalance: null
			}
		};
	}

	async componentDidMount() {
		const network = await getNetwork(this.state.web3);
		const metaMaskStatus = await getMetaMaskStatus(this.state.web3);
		const accounts = await getAllAccounts(this.state.web3);

		const selectedAccount = {...this.state.selectedAccount};
		// Default account for MetaMask
		if (this.state.provider === Web3Providers.META_MASK) {
			selectedAccount.address = [...accounts.keys()][0];

			// GANACHE case
		} else if (this.state.provider === Web3Providers.LOCALHOST) {
			selectedAccount.address = localStorage.getItem('ganache') ?
				JSON.parse(localStorage.getItem('ganache')) :
				[...accounts.keys()][0];
		}

		selectedAccount.balance = accounts.get(selectedAccount.address);

		selectedAccount.EKABalance = await getBalanceOf(
			this.state.tokenContract,
			selectedAccount.address
		);

		this.setState({selectedAccount});

		this.setState({network, metaMaskStatus, accounts});
		this.interval = setInterval(async () => {
			const metaMaskStatus = await getMetaMaskStatus(this.state.web3);
			// Const accounts = await getAllAccounts(this.state.web3);
			this.setState({metaMaskStatus});
		}, 5000);
	}

	// Ganache switch addresses
	async changeAccount(selectedAccount) {
		const account = {...this.state.selectedAccount};
		account.address = selectedAccount.address;

		const accounts = await getAllAccounts(this.state.web3);
		if (accounts.get(account.address)) {
			account.balance = accounts.get(account.address);
		}

		this.setState({selectedAccount: account});
		localStorage.setItem('ganache', JSON.stringify(account.address.toString()));
	}

	componentWillUnmount() {
		clearInterval(this.interval);
	}

	render() {
		return (
			<div>
				<Detector
					render={({online}) =>
						online ? (
							<MainRouter
								platformContract={this.state.platformContract}
								tokenContract={this.state.tokenContract}
								web3={this.state.web3}
								provider={this.state.provider}
								network={this.state.network}
								metaMaskStatus={this.state.metaMaskStatus}
								accounts={this.state.accounts}
								selectedAccount={this.state.selectedAccount}
								changeAccount={account => {
									this.changeAccount(account);
								}}
							/>
						) : (
							<NoConnection />
						)
					}
				/>
			</div>
		);
	}
}

export default App;
