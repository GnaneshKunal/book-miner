import * as redux from 'redux';

const rootReducer: redux.Reducer<any> = redux.combineReducers({
  state: (state = {}) => state
});

export default rootReducer;
