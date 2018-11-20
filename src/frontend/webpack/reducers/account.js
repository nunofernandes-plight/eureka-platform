import {getAllAccounts, getNetwork} from '../../web3/Helpers.js';
import {ACCOUNTS_SET, SET_NETWORK, SETTING_ACCOUNTS} from './types.js';
import Web3Providers from '../../web3/Web3Providers.js';
import {getBalanceOf} from '../../../smartcontracts/methods/web3-token-contract-methods.mjs';

const initialState = {
  accounts: null,
  loading: true,
  error: null,
  selectedAccount: null
};

export const updateAccounts = (web3, provider, tokenContract) => {
  return async dispatch => {
    dispatch({type: SETTING_ACCOUNTS});
    const accounts = await getAllAccounts(web3);
    const selectedAccount = {};

    if (provider === Web3Providers.META_MASK) {
      selectedAccount.address = [...accounts.keys()][0];
    } else if (provider === Web3Providers.LOCALHOST) {
      selectedAccount.address = localStorage.getItem('ganache')
        ? JSON.parse(localStorage.getItem('ganache'))
        : [...accounts.keys()][0];
    }

    if (selectedAccount.address) {
      selectedAccount.balance = accounts.get(selectedAccount.address);
      if (tokenContract)
        selectedAccount.EKABalance = await getBalanceOf(
          tokenContract,
          selectedAccount.address
        );
    }
    dispatch({type: ACCOUNTS_SET, accounts, selectedAccount});
  };
};

export const accountsData = (state = initialState, action) => {
  switch (action.type) {
    case SETTING_ACCOUNTS:
      return {
        loading: true
      };
    case ACCOUNTS_SET:
      return {
        loading: false,
        accounts: action.accounts,
        selectedAccount: action.selectedAccount
      };
    default:
      return state;
  }
};
