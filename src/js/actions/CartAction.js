/**
 * Created by ouli on 2016/5/11.
 */
//import fetch from 'isomorphic-fetch'
//import fetch from 'fetch-ie8'
import * as types from '../constants/CartTypes';

const rootUrl = '/rest/api/v3';

export function selectItem(cartId,entryId) {
  return {
    type: types.SELECT_ITEM,
    cartId,
    entryId
  }
}

export function deleteItem(entryId) {
  return {
    type: types.DELETE_ITEM,
    entryId
  }
}

export function deleteCartSuccess() {
  return {
    type: types.DELETE_CART_SUCCESS
  }
}

export function deleteCartFailure() {
  return {
    type: types.DELETE_CART_FAILURE
  }
}

export function selectAllItem(checked) {
  return {
    type: types.SELECT_ALL_ITEM,
    checked
  }
}

export function selectAllItemForCartId(checked,cartId) {
  return {
    type: types.SELECT_ALL_ITEM_FOR_CARTID,
    checked,
    cartId
  }
}

export function quantityChange(cartId,entryId,value) {
  return {
    type: types.QUANTITY_CHANGE,
    cartId,
    entryId,
    value
  }
}

export function getTotalPrice(price) {
  return {
    type: types.GET_TOTALPRICE,
    price
  }
}

export function getSelectedTotalPrice() {
  return {
    type: types.SELECTED_TOTALPRICE
  }
}

/* 更新购物车最新价格 */
export function updateCartIfNeeded(price,totalPrice,cartId,entryId) {
  return {
    type: types.UPDATE_CART_PRICE,
    price,
    totalPrice,
    cartId,
    entryId
  }
}

/** start 最近浏览商品数据整理 **/
function receiveBrowsedProducts(data) {
  return {
    type: types.RECEIVE_BROWSEDPRODUCTS_SUCCESS,
    browsedProducts: data.map(child => {
      return {
        vendorCode: child.vendorCode,
        imagePath: child.imagePath,
        productCode: child.productCode,
        quantityC: child.quantityC,
        quantityB: child.quantityB,
        priceC: child.priceC,
        productName: child.productName,
        priceA: child.priceA,
        priceB: child.priceB
      }
    })
  }
}

/** start 如果购物车为空，获取最近浏览商品 **/
export function fetchBrowsedProductsIfNeeded (data) {
  return (dispatch) => {
    dispatch(receiveBrowsedProducts(data));
  }
}

function requestCart() {
  return {
    type: types.RECEIVE_REQUEST
  }
}

function receiveCart(json) {
  if (json.Error && json.Error.code === '500') {
    return {
      type: types.USER_UNLOGIN,
      carts: [],
      cartById: []
    }
  } else if (json.carts) {
    return {
      type: types.RECEIVE_SUCCESS,
      carts: json.carts.map(child => child.cartId),
      cartById: json.carts.map(child => {
        return {
          cartId: child.cartId,
          nodes: child.entries.map(node => node.cartEntryId),
          entries: child.entries.map(node => {
            return {
              id: node.cartEntryId,
              details: node,
              isChecked: true
            }
          }),
          qqNumber: child.qqNumber,
          distributor: child.distributor,
          totalItems: child.totalItems,
          totalPrice: child.totalPrice
        }
      }),
      receivedAt: Date.now()
    }
  } else {
    return {
      type: types.RECEIVE_FAILURE,
      carts: [],
      cartById: []
    }
  }
}

function fetchCart() {
  return dispatch => {
    dispatch(requestCart());
    fetch(`/api/cart.json`,{
      credentials: 'same-origin',
      method: 'GET'
    })
      .then(response =>response.json())
      .then(json => dispatch(receiveCart(json)))
  }
}

function shouldFetchCart(state) {
  console.log(state);
  const nodes = state.initialState;
  if (!nodes) {
    return true
  }
  if (nodes.isFetching) {
    return false
  }
  return nodes.fetchSuccess
}

export function fetchCartIfNeeded() {
  //if (shouldFetchCart() {
  //  return fetchCart();
  //}
  return (dispatch, getState) => {
    //console.log(getState());
    //if (shouldFetchCart(getState())) {
      return dispatch(fetchCart());
    //}
  }
}

/*
 * start 购物车内容模块的action操作
 * */
function receiveCustomerCode(code) {
  if(code) {
    return {
      type: types.RECEIVE_CUSTOMERCODE_SUCCESS,
      customerCode: code
    }
  } else {
    return {
      type: types.RECEIVE_CUSTOMERCODE_FAILURE,
      customerCode: ''
    }
  }
}

export function fetchCustomerCode (code) {
  return (dispatch) => {
    dispatch(receiveCustomerCode(code));
  }
}

export function previewOrder() {
  return {
    type: types.PREVIEW_ORDER
  }
}
