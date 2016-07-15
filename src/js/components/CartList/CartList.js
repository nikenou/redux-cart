import React, { Component, PropTypes } from 'react';
import * as CartAction from '../../actions/CartAction';
import CartListItem from './CartListItem';

import Dialog from 'rc-dialog';

export default class CartList extends Component {

  static propTypes = {
    customerCode: PropTypes.string.isRequired,
    cart: PropTypes.array.isRequired,
    fetchSuccess: PropTypes.bool,
    totalPrice: PropTypes.number,
    dispatch: PropTypes.func.isRequired
  };

  static childContextTypes = {
    cartInstances: PropTypes.array
  };

  constructor(props) {
    super(props);
    this.state = {
      total: 0,
      customerCode: '',
      deleteDialogVisible: false,
      deleteCartCode: 0,
      warmDialogVisible: false,
      warmMessage: '',
      loginTag: false,
      cartInstances: []
    };
  }

  getChildContext = ()=> {
    const { cartInstances } = this.state;
    return {
      cartInstances: cartInstances
    };
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch(CartAction.getSelectedTotalPrice());
    //dispatch(CartAction.fetchCartIfNeeded());
  };

  //getCartInstances = ()=> this.state.data.get('cartInstances');

  isValid = ()=> {
    const { cartInstances } = this.state;
    //const cartInstances = this.getCartInstances();
    return cartInstances.every(cartInstance=>cartInstance.isValid());
  };

  handleCartCheckboxSelectAll = (event)=> {
    const { dispatch } = this.props;
    dispatch(CartAction.selectAllItem(event.target.checked));
    dispatch(CartAction.getSelectedTotalPrice());
  };

  /* 删除所选商品 */
  deleteSelectedProduct = ()=> {
    const { cart, dispatch } = this.props;
    let arr = [];
    for (let i = 0; i < cart.length; i++) {
      for (let j = 0; j < cart[i].entries.length; j++) {
        if (cart[i].entries[j].isChecked === true) {
          let subArr = [];
          subArr.push(cart[i].cartId,cart[i].entries[j].details.product.productCode,cart[i].entries[j].id);
          arr.push(subArr);
        }
      }
    }
    arr.map(this.handleDeleteCartClick); //删除对应商品
  };

  openDeleteDialogClick = () => {
    this.setState({
      deleteDialogVisible: true,
      deleteCartCode: 0
    });
  };

  /** 删除对应商品 **/
  handleDeleteCartClick = (selectedArr) => {
    const { dispatch } = this.props;
    //const form = new FormData();
    //form.append('cartId', selectedArr[0]);
    //form.append('productCode', selectedArr[1]);
    //form.append('quantity', 0);
    fetch(`/rest/api/v3/cart/updateCart?cartId=${selectedArr[0]}&productCode=${selectedArr[1]}&quantity=0`, {
      credentials: 'same-origin',
      method: 'POST'
      //body: form
    })
      .then(response => response.json())
      .then(json => {
        if(json.statusCode === '401') {
          this.setState({
            warmDialogVisible: true,
            warmMessage: '请先登录再进行操作！',
            loginTag: true
          });
        } else {
          if (json.carts != undefined && json.carts.length >= 0) {
            this.setState({deleteCartCode: 10});
            dispatch(CartAction.deleteItem(selectedArr[2]));
            if (json.carts.length == 0) {
              location.reload();
            }
            //dispatch(CartAction.deleteCartSuccess());
            //dispatch(CartAction.fetchCartIfNeeded());
          } else if (json.Error != undefined && json.Error.code == '500') {
            this.setState({deleteCartCode: 30});
            dispatch(CartAction.deleteCartFailure());
          }
        }
      })
      .then(() => {
        dispatch(CartAction.getSelectedTotalPrice());
      })
      .catch(err => {
        console.log(err);
      });
  };

  /** 点击结算按钮 **/
  handleCartCheckoutClick = ()=> {
    const { dispatch, customerCode, cart, totalPrice, fetchSuccess } = this.props;
    //const { customerCode } = this.state;
    const hasSelectOne = cart.some((node) => {
      return node.entries.some(entry => entry.isChecked == true)
    });
    if (hasSelectOne === false) {
      this.setState({
        warmDialogVisible: true,
        warmMessage: '请先勾选产品！'
      });
    } else {
      if (this.isValid()) {
        //表单上要post到下一个页面前的cart处理
        const filterCart = cart.map((node) => {
          return Object.assign({}, node, {
            entries: node.entries.filter(entry => entry.isChecked == true)
          })
        }).filter((node) => node.entries.length > 0);
        //const form = new FormData();
        const filterUpdateCart = filterCart.map((node) => {
          return {
            cartId: node.cartId,
            entries: node.entries.map(entry => {
              return {
                cartEntryId:  entry.details.cartEntryId,
                productCode: entry.details.product.productCode,
                quantity: entry.details.quantity
              }
            })
          }
        }).filter((node) => node.entries.length > 0);
        //console.log(filterUpdateCart);
        const postUpdatedCart = JSON.stringify({
          //customerCode: customerCode,
          carts: filterUpdateCart.map((node) => node)
        });
        //console.log(postUpdatedCart);
        //form.append('selectedEncodedCartsInfoJSONStr', postUpdatedCart);
        this.refs.selectedCartEntries.value = postUpdatedCart;
        this.refs.orderFrom.submit();
      } else {
        this.setState({
          warmDialogVisible: true,
          warmMessage: '请输入正确的购买数量再提交！'
        })
      }
    }
  };

  /*
   * 主要是用来避免表单里面的关键值为空时候避免表单提交了
   * */
  handleSubmit = (event) => {
    event.preventDefault();
    const sEntries = this.refs.selectedCartEntries.getDOMNode().value;
    if (!sEntries) {
      return false;
    }
  };

  onDeleteDialogClose = () => {
    this.setState({
      deleteDialogVisible: false
    });
  };

  onWarmDialogClose = () => {
    this.setState({
      warmDialogVisible: false
    });
  };

  renderList() {
    const { cart, dispatch } = this.props;
    return cart.map((node) => {
      if (node.entries.length > 0) {
      return (
          <CartListItem
            key={node.cartId}
            cart={node}
            id={node.cartId}
            entries={node.entries}
            dispatch={dispatch}
          />
        )
      } else
        return false;
    });
  }

  render () {
    const { cart, fetchSuccess, totalPrice } = this.props;
    const { warmDialogVisible, warmMessage, deleteDialogVisible, deleteCartCode, loginTag } = this.state;
    let sumPrice = totalPrice != undefined ? totalPrice : 0; //统计价格

    //警告弹出框结构
    let warmDialog = (
      <Dialog className="lsDialog" visible={warmDialogVisible} animation="slide-fade" maskAnimation="fade" onClose={this.onWarmDialogClose} style={{ width: 300 }}>
        <div className="tableMaterial fn-clear">
          <div className="rc-dialog-infoList">{warmMessage}<br />{ loginTag === true && <a href="/login">返回登录</a> }</div>
        </div>
      </Dialog>
    );

    //删除购物车弹出框结构
    let deleteCartDialog = (
      <Dialog className="lsDialog" visible={deleteDialogVisible} animation="slide-fade" maskAnimation="fade" onClose={this.onDeleteDialogClose} style={{ width: 300 }}>
        {
          deleteCartCode == 0 ?
            <div className="addressForm">
              <div className="infoList fix">
                <div className="leftTitle w200">&nbsp;</div>
                <div className="inputText">确定删除该商品？</div>
              </div>
              <div className="infoList fix">
                <div className="leftTitle w200">&nbsp;</div>
                <div className="inputText">
                  <div className="btnYes" onClick={this.deleteSelectedProduct}>删除</div>
                  <div className="btnNo" onClick={this.onDeleteDialogClose}>返回</div>
                </div>
              </div>
            </div>
            :
            <div className="addressForm">
              <div className="infoList fix">
                <div className="leftTitle">&nbsp;</div>
                <div className="inputText">
                  {deleteCartCode == 10 && '删除成功！'}
                  {deleteCartCode == 30 && '很抱歉，操作失败！'}
                </div>
              </div>
              <div className="infoList fix">
                <div className="leftTitle">&nbsp;</div>
                <div className="inputText">
                  <div className="btnNo" onClick={this.onDeleteDialogClose}>确定</div>
                </div>
              </div>
            </div>
        }
      </Dialog>
    );

    return (
        <form ref="orderFrom" method="post" action="/checkout" onSubmit={this.handleSubmit} >
          <input type="hidden" ref="selectedCartEntries" name="selectedCartsWithChosenEntriesJSONStr" value="" />
          <div className="tableCart">
            <table width="100%" className="tableStyle">
              <thead>
              <tr>
                <th width="60">
                  <div className="selectAll">
                    <input type="checkbox" id="selectAll01" onChange={this.handleCartCheckboxSelectAll} />
                    <label for="selectAll01">全选</label>
                  </div>
                </th>
                <th width="440" className="textLeft">商品信息</th>
                <th width="160">单价(元)</th>
                <th width="144">数量</th>
                <th width="160">金额(元)</th>
                <th>操作</th>
              </tr>
              </thead>
            </table>
            {this.renderList()}
          </div>
          <div className="balance">
            <div className="selectAll">
              <input type="checkbox" id="selectAll02" onChange={this.handleCartCheckboxSelectAll} /><label for="selectAll02">全选</label>
            </div>
            <a href="javascript:void(0);" title="删除选中商品" onClick={this.openDeleteDialogClick} >删除选中商品</a>
            <div className="fn-right">
              <span>合计（不含物流费用）：<b className="pPrice">{`￥${parseFloat(sumPrice).toFixed(2)}`}</b></span>
              <a className="balanceLink checked" href="javascript:void(0)" title="先勾选商品再结算" onClick={this.handleCartCheckoutClick} >结 算</a>
            </div>
          </div>
          {deleteCartDialog}
          {warmDialog}
        </form>
    );
  }
}
