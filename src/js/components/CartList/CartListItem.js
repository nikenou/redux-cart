import React, { Component, PropTypes } from 'react';
import * as CartAction from '../../actions/CartAction';
import CartListEntry from './CartListEntry';

import classnames from 'classnames';
import Dialog from 'rc-dialog';

export default class CartListItem extends Component {

  static propTypes = {
    cart: PropTypes.object.isRequired,
    id: PropTypes.string.isRequired,
    entries: PropTypes.array.isRequired,
    dispatch: PropTypes.func.isRequired
  };

  static contextTypes = {
    cartInstances: PropTypes.array
  };

  static childContextTypes = {
    cartEntryInstances: PropTypes.array
  };

  constructor(props) {
    super(props);
    this.state = {
      deleteDialogVisible: false,
      deleteCartCode: 0,
      warmDialogVisible: false,
      warmMessage: '',
      loginTag: false,
      cartEntryInstances: []
    };
  }

  getChildContext = ()=> {
    const { cartEntryInstances } = this.state;
    return {
      cartEntryInstances: cartEntryInstances
    };
  };

  componentDidMount() {
    const { cartInstances } = this.context;
    if (cartInstances) {
      cartInstances.push(this);
    }
  }

  isValid = ()=> {
    //const cartEntryInstances = this.state.data.get('cartEntryInstances');
    const { cartEntryInstances } = this.state;
    return cartEntryInstances.every(cartEntryInstance=>cartEntryInstance.isValid());
  };

  selectAllForCartId = (event)=> {
    const { dispatch,id } = this.props;
    dispatch(CartAction.selectAllItemForCartId(event.target.checked,id));
    dispatch(CartAction.getSelectedTotalPrice());
  };

  openDeleteDialogClick = (cartId,productCode,cartEntryId) => {
    this.setState({
      deleteDialogVisible: true,
      cartId: cartId,
      productCode: productCode,
      cartEntryId: cartEntryId,
      deleteCartCode: 0
    });
  };

  handleDeleteCartClick = () => {
    const { deleteCartId, productCode, cartEntryId } = this.refs;
    const { dispatch } = this.props;
    //const form = new FormData();
    //const { address, phone, contact, addressId, isDefault } = obj;
    //form.append('cartId', deleteCartId.value);
    //form.append('productCode', productCode.value);
    //form.append('quantity', 0);
    fetch(`/rest/api/v3/cart/updateCart?cartId=${deleteCartId.value}&productCode=${productCode.value}&quantity=0`, {
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
            dispatch(CartAction.deleteItem(cartEntryId.value));
            if (json.carts.length == 0) {
              location.reload();
            }
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

  handleUpdateCart = (cartEntry, quantity) => {
    //const { deleteCartId, productCode } = this.refs;
    const { dispatch, id } = this.props;
    //const form = new FormData();
    //form.append('cartId', id);
    //form.append('productCode', cartEntry.product.productCode);
    //form.append('quantity', quantity);
    fetch(`/rest/api/v3/cart/updateCart?cartId=${id}&productCode=${cartEntry.product.productCode}&quantity=${quantity}`, {
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
            //console.log(json.carts);
            const cart = json.carts.find(cart => cart.cartId === id);
            const entry = cart.entries.find(entry => entry.cartEntryId === cartEntry.cartEntryId);
            //alert(entry.price);
            dispatch(CartAction.updateCartIfNeeded(entry.price,entry.totalPrice,id,cartEntry.cartEntryId));
          } else if (json.Error != undefined && json.Error.code == '500') {
            this.setState({
              warmDialogVisible: true,
              warmMessage: '网络出错了，请稍候。',
              loginTag: false
            });
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

  openOnlineClientService = (qqNumber) => {
    let url = "";

    if (qqNumber) {
      url = 'http://wpa.qq.com/msgrd?v=3&uin='+qqNumber+'&site=qq&menu=yes';
    } else {
      url = 'http://wpa.qq.com/msgrd?v=3&uin=3027189146&site=qq&menu=yes';
    }

    window.open(url,"_blank","width=605, height=490");
  };

  renderList() {
    const { id, cart, entries, dispatch } = this.props;
    return entries.map((node) =>
      (
        <CartListEntry
          key={node.id}
          vipFlag={cart.vip_flag}
          cartId={id}
          isChecked={node.isChecked}
          cartEntry={node.details}
          onUpdateQuantity={this.handleUpdateCart}
          onDeleteCart={this.openDeleteDialogClick}
          dispatch={dispatch}
        />
      )
    );
  }

  render () {
    const { dispatch, id, cart, entries } = this.props;
    const { warmDialogVisible, warmMessage, loginTag, deleteDialogVisible, deleteCartCode, cartId, productCode, cartEntryId } = this.state;

    /* 判断是否所有商品都被选中 */
    const allChecked = entries.every(node => node.isChecked === true);

    //删除购物车弹出框结构
    let deleteCartDialog = (
      <Dialog className="lsDialog" visible={deleteDialogVisible} animation="slide-fade" maskAnimation="fade" onClose={this.onDeleteDialogClose} style={{ width: 300 }}>
        {
          deleteCartCode == 0 ?
            <form>
              <input type="hidden" ref="deleteCartId" name="cartId" value={cartId} />
              <input type="hidden" ref="productCode" name="productCode" value={productCode} />
              <input type="hidden" ref="cartEntryId" name="cartEntryId" value={cartEntryId} />
              <div className="addressForm">
                <div className="infoList fix">
                  <div className="leftTitle w200">&nbsp;</div>
                  <div className="inputText">确定删除该商品？</div>
                </div>
                <div className="infoList fix">
                  <div className="leftTitle w200">&nbsp;</div>
                  <div className="inputText">
                    <div className="btnYes" onClick={this.handleDeleteCartClick}>删除</div>
                    <div className="btnNo" onClick={this.onDeleteDialogClose}>返回</div>
                  </div>
                </div>
              </div>
            </form>
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

    //警告弹出框结构
    let warmDialog = (
      <Dialog className="lsDialog" visible={warmDialogVisible} animation="slide-fade" maskAnimation="fade" onClose={this.onWarmDialogClose} style={{ width: 300 }}>
        <div className="tableMaterial fn-clear">
          <div className="rc-dialog-infoList">{warmMessage}<br />{ loginTag === true && <a href="/login">返回登录</a> }</div>
        </div>
      </Dialog>
    );

    return (
      <div>
        <table width="100%" className="tableStyle">
          <thead>
            <tr>
              <th width="60">
                <input type="checkbox" id="selectAll01" checked={allChecked} onChange={this.selectAllForCartId} />
              </th>
              <th colSpan="6" className="textLeft">
                <a className="distributorName" href={"/innershops/home/"+cart.distributor.distributorId} target="_blank"><b>{cart.distributor.name}</b></a>
                <a className="customService" href="javascript:void(0);" onClick={() => this.openOnlineClientService(cart.qqNumber)}><i className="icon"></i><span><i className="arrowIcon"></i><b>联系卖家</b></span></a>
              </th>
            </tr>
          </thead>
          <tbody>
          {this.renderList()}
          </tbody>
        </table>
        {deleteCartDialog}
        {warmDialog}
      </div>
    );
  }
}
