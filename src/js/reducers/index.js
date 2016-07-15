import { combineReducers } from 'redux';
import cartList from './cartList';
//import customerCode from './customerCode';

const rootReducer = combineReducers({
  cartList,
  //customerCode
});

export default rootReducer;
