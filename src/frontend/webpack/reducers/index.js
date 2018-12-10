import {combineReducers} from 'redux';
import {userData} from './user.js';
import {networkData} from './network.js';
import {metamaskData} from './metamask.js';
import {accountsData} from './account.js';
import {transactionsData} from './transactions.js';
import {articlesData} from './articles.js';
import {editorsData} from './editor-methods.js';
import {reviewsData} from './reviews.js';
import {reviewerData} from './reviewer.js';

const reducer = combineReducers({
  userData,
  editorsData,
  networkData,
  metamaskData,
  accountsData,
  transactionsData,
  articlesData,
  reviewsData,
  reviewerData
});

export default reducer;
