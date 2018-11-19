import {combineReducers} from 'redux';
import {userData} from './user.js';
import {unassignedArticlesData} from './editor-methods.js';
import {networkData} from './network.js';


const reducer = combineReducers({
  userData,
  unassignedArticlesData,
  networkData
});

export default reducer;
