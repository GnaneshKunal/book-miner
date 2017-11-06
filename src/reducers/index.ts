import * as redux from 'redux';
import searchReducer from './search';
import bookReducer from './book';

const rootReducer: redux.Reducer<any> = redux.combineReducers({
  // state: (state = {}) => state,
  search: searchReducer,
  book: bookReducer
});

export default rootReducer;
