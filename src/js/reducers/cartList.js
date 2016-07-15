/**
 * Another clever approach of writing reducers:
 *
 * export default function(state = initialState, action) {
 *   const actions = {
 *      [ACTION_TYPE]: () => [action.payload.data, ...state]
 *   };
 *
 *   return (_.isFunction(actions[action.type])) ? actions[action.type]() : state
 * }
 */

import * as types from '../constants/CartTypes';

const initialState = {
  logined: false,
  isFetching: false,
  fetchSuccess: false,
  carts: [],
  cartById: []
};

export default function (state = initialState, action) {
  //alert(action.type);
  switch (action.type) {
    case types.USER_UNLOGIN:
      return Object.assign({}, state, {
        logined: false,
        isFetching: false,
        fetchSuccess: false
      });

    case types.RECEIVE_FAILURE:
      return Object.assign({}, state, {
        logined: true,
        isFetching: false,
        fetchSuccess: false
      });

    case types.RECEIVE_REQUEST:
      return Object.assign({}, state, {
        logined: false,
        isFetching: true,
        fetchSuccess: false
      });

    case types.RECEIVE_SUCCESS:
      return Object.assign({}, state, {
        logined: true,
        isFetching: false,
        fetchSuccess: true,
        carts: action.carts,
        cartById: action.cartById,
        lastUpdated: action.receivedAt
      });

    case types.RECEIVE_BROWSEDPRODUCTS_SUCCESS:
      return Object.assign({}, state, {
        isFetching: false,
        fetchSuccess: true,
        carts: action.carts,
        cartById: action.cartById,
        lastUpdated: action.receivedAt
      });

    case types.SELECT_ITEM:
      return Object.assign({}, state, {
        cartById: state.cartById.map(node => {
          if(node.cartId === action.cartId) {
            return {
              cartId: node.cartId,
              distributor: node.distributor,
              entries: node.entries.map(entry => {
                if (entry.id === action.entryId) {
                  return Object.assign({}, entry, {isChecked: !entry.isChecked})
                } else
                  return entry
              })
            }
          } else
            return node
        })
      });

    case types.GET_TOTALPRICE:
      //console.log('SUCCESS');
      return Object.assign({}, state, {
        totalPrice: action.price
      });

    case types.SELECTED_TOTALPRICE:
      //console.log('SUCCESS');
      let sum, arr = [];
      for (let i = 0; i < state.cartById.length; i++) {
        for (let j = 0; j < state.cartById[i].entries.length; j++) {
          if (state.cartById[i].entries[j].isChecked === true) {
            arr.push(state.cartById[i].entries[j].details.totalPrice);
            //arr.push(state.cartById[i].entries[j].details.price * state.cartById[i].entries[j].details.quantity);
          }
        }
      }
      //console.log(arr);
      if(arr.length > 0) {
        sum = arr.reduce(function(a,b){
          return a + b;
        })
      } else sum = 0;
      return Object.assign({}, state, {
        selectedTotalPrice: sum
      });

    case types.QUANTITY_CHANGE:
      return Object.assign({}, state, {
        cartById: state.cartById.map(node => {
          if(node.cartId === action.cartId) {
            return Object.assign({}, node, {
              entries: node.entries.map(entry => {
                if (entry.id === action.entryId) {
                  return Object.assign({}, entry, {
                    details: Object.assign({}, entry.details, {
                      quantity: action.value,
                      totalPrice: action.value * entry.details.price
                    })
                  })
                } else
                  return entry
              })
            })
          } else
            return node
        })
      });

    case types.SELECT_ALL_ITEM:
      return Object.assign({}, state, {
        cartById: state.cartById.map(node => {
          return Object.assign({}, node, {
            entries: node.entries.map(entry => {
                return Object.assign({}, entry, { isChecked: action.checked})
            })
          })
        })
      });

    case types.SELECT_ALL_ITEM_FOR_CARTID:
      return Object.assign({}, state, {
        cartById: state.cartById.map(node => {
          if(node.cartId === action.cartId) {
            return Object.assign({}, node, {
              entries: node.entries.map(entry => {
                return Object.assign({}, entry, { isChecked: action.checked})
              })
            })
          } else
            return node
        })
      });

    case types.DELETE_ITEM:
      return Object.assign({}, state, {
        cartById: state.cartById.map(node => {
          return Object.assign({}, node, {
            entries: node.entries.filter(entry => entry.id !== action.entryId)
          })
        })
      });

    case types.UPDATE_CART_PRICE:
      return Object.assign({}, state, {
        cartById: state.cartById.map(node => {
          if(node.cartId === action.cartId) {
            return {
              cartId: node.cartId,
              distributor: node.distributor,
              entries: node.entries.map(entry => {
                if (entry.id === action.entryId) {
                  return Object.assign({}, entry, {
                    details: Object.assign({}, entry.details, {
                      price: action.price,
                      totalPrice: action.totalPrice
                    })
                  })
                } else
                  return entry
              })
            }
          } else
            return node
        })
      });

    default:
      return state
  }
}
