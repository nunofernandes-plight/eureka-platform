import {combineReducers} from 'redux';
import {userData} from './user.js';
import {unassignedArticlesData} from './editor-methods.js';


const reducer = combineReducers({
  userData,
  unassignedArticlesData
});

export default reducer;
