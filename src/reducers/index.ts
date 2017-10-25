import * as redux from 'redux';
import searchReducer from './search';

const rootReducer: redux.Reducer<any> = redux.combineReducers({
  // state: (state = {}) => state,
  search: searchReducer
});

export default rootReducer;
