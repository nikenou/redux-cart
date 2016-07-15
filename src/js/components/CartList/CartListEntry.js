import React, { Component, PropTypes } from 'react';
import classnames from 'classnames';
import { Map, Set } from 'immutable';
import * as CartAction from '../../actions/CartAction';
import EmptyImage from '../Common/EmptyImage';
import EntryImage from '../Common/EntryImage';
import InputQuantity from '../Common/InputQuantity';
import CommonUtil from '../Common/services/CommonUtil';

export default class CartListEntry extends Component {

  static propTypes = {
    cartId: PropTypes.string.isRequired,
    isChecked: PropTypes.bool.isRequired,
    vipFlag: PropTypes.string.isRequired,
    cartEntry: PropTypes.object,
    onUpdateQuantity: PropTypes.func,
    onDeleteCart: PropTypes.func,
    dispatch: PropTypes.func.isRequired
  };

  static contextTypes = {
    cartEntryInstances: PropTypes.array
  };

  constructor(props) {
    super(props);
    this.state = {
      data: Map({
        warningMessageHidden: true
      }),
    };

    this.errors = Set();

    this.handleQuantityChangeDebounced = CommonUtil.debounce(()=> {
      const { quantity, oldQuantity } = this.state.data.get('query');
      if (quantity !== '') {
        this.handleQuantityChange.apply(this, [quantity, oldQuantity]);
      }
    }, 300);
  }

  componentDidMount() {
    const { cartEntryInstances } = this.context;
    if (cartEntryInstances) {
      cartEntryInstances.push(this);
    }
  }

  setImmState = (fn)=>
    this.setState(({ data }) => ({
      data: fn(data),
    }));

  setWarningMessage = (message)=> {
    this.setImmState(d => d.set('warningMessage', message));
  };

  showWarningMessage = ()=> {
    this.setImmState(d => d.set('warningMessageHidden', false));
  };

  hideWarningMessage = ()=> {
    this.setImmState(d => d.set('warningMessageHidden', true));
  };

  isValid = ()=> {
    return this.errors.size === 0;
  };

  handleCartCheckboxClick = (cartId,id)=> {
    const { dispatch } = this.props;
    dispatch(CartAction.selectItem(cartId,id));
    dispatch(CartAction.getSelectedTotalPrice());
  };

  handleDeleteClick = ()=> {
    //alert('a');
    const { dispatch } = this.props;
    //e.stopPropagation();
    const { cartId, cartEntry, onDeleteCart } = this.props;
    if (typeof onDeleteCart === 'function') {
      onDeleteCart(cartId,cartEntry.product.productCode,cartEntry.cartEntryId);
    }
    //dispatch(CartAction.deleteItem(cartId));
    //dispatch(CartAction.getSelectedTotalPrice());
  };

  /* 获取对应供应商报价的最低起批量 */
  getMinValidQuantity = ()=> {
    const { cartEntry } = this.props;
    const distributorId = cartEntry.product.distributor.distributorId;
    const distributor = cartEntry.product.distributors.find(distor=>distor.distributorId === distributorId);
    return parseInt(distributor.priceRanges[0].MOQ.match(/\d+/g)[0], 10);
  };

  onChange = (quantity, oldQuantity)=> {
    const { dispatch, isChecked, cartId, cartEntry, onUpdateQuantity } = this.props;
    dispatch(CartAction.quantityChange(cartId,cartEntry.cartEntryId,quantity));
    /*if (isChecked === true) {
      //dispatch(CartAction.selectItem(cartId,cartEntry.cartEntryId));
      dispatch(CartAction.getSelectedTotalPrice());
    }*/
    this.setImmState(d => d.set('query', { quantity, oldQuantity }));
    this.handleQuantityChangeDebounced();
    //this.handleQuantityChange(quantity, oldQuantity);
  };

  handleQuantityChange = (quantity, oldQuantity)=> {
    const { cartEntry, onUpdateQuantity } = this.props;
    let errors = Set();
    const self = this;
    if (typeof onUpdateQuantity === 'function') {
      const minValidQuantity = self.getMinValidQuantity(cartEntry);
      //const minValidQuantity = 3;
      if (quantity < 1) {
        errors = errors.add({
          msg: `该商品起批量不可少于 1 ${cartEntry.product.saleUnitName}`,
        });
        self.refs.inputQuantity.setQuantity(1);
      }
      if (quantity < minValidQuantity) {
        errors = errors.add({
          msg: `该商品起批量不可少于 ${minValidQuantity} ${cartEntry.product.saleUnitName}`,
        });
      }
      if (quantity > 9999) {
        errors = errors.add({
          msg: '商品最大购买数量为 9999',
        });
      }

      self.errors = errors;
      if (errors.size > 0) {
        self.setWarningMessage(errors.first().msg);
        self.showWarningMessage();
      } else {
        self.hideWarningMessage();
        onUpdateQuantity(cartEntry, quantity);
      }
    }
  };

  render () {
    const { cartId, vipFlag, isChecked, cartEntry } = this.props;
    const { errors, hide } = this.state;
    const image = cartEntry.product.images.length < 1 ? <EmptyImage /> : <EntryImage image={cartEntry.product.images[0]} />;
    const product_url = "/innershops/product/"+cartEntry.product.distributor.distributorId+'/'+cartEntry.product.productCode;
    const { warningMessage, warningMessageHidden } = this.state.data.toJS();

    return (
      <tr>
        <td><input type="checkbox" checked={isChecked} onChange={() => this.handleCartCheckboxClick(cartId,cartEntry.cartEntryId)} /></td>
        <td width="100">
          <a className="cartImg" href="javascript:void(0);">
            {image}
          </a>
        </td>
        <td width="320" className="textLeft">
          <a title={cartEntry.product.name} href={product_url} target="_blank">{cartEntry.product.name}</a>
          <p className="message">
            <span>编号：{cartEntry.product.productCode}  规格：{cartEntry.product.packagingSpecification} </span>
          </p>
        </td>
        <td width="160">
          {
            (cartEntry.price == 0 && vipFlag !== '20') ?
              <p className="pPrice">面议</p>
              :
              <p><b className="pPrice">{`￥${parseFloat(cartEntry.price).toFixed(2)}`}</b></p>
          }
        </td>
        <td width="144" className="quantityTd">
            <InputQuantity quantity={cartEntry.quantity} max={9999} onQuantityChange={this.onChange} ref="inputQuantity" />
              <p className="warm" hidden={warningMessageHidden} >{warningMessage}</p>
        </td>
        <td width="160">
          {
            (cartEntry.price == 0 && vipFlag !== '20') ?
              <p className="pPrice">面议</p>
              :
              <p><b className="pPrice">{`￥${parseFloat(cartEntry.totalPrice).toFixed(2)}`}</b></p>
          }
        </td>
        <td><a href="javascript:void(0);" title="删除" onClick={this.handleDeleteClick}>删除</a></td>
      </tr>
    );
  }
}
