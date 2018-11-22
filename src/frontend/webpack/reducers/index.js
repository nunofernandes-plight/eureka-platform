import {combineReducers} from 'redux';
import {userData} from './user.js';
import {unassignedArticlesData} from './editor-methods.js';
import {networkData} from './network.js';
import {metamaskData} from './metamask.js';
import {accountsData} from './account.js';
import {transactionsData} from './transactions.js';



const reducer = combineReducers({
  userData,
  unassignedArticlesData,
  networkData,
  metamaskData,
  accountsData,
  transactionsData

});

export default reducer;
