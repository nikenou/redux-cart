import React, { Component, PropTypes } from 'react';
import * as CartAction from '../../actions/CartAction';

export default class CartNoGoods extends Component {

  static propTypes = {
  };

  constructor(props) {
    super(props);
  };

  
  render () {

    return (
        <div className="shoppingCart">
          <div className="noGoods">
            <p>购物车还没有商品，去看看心仪的商品吧</p>
            <p>
              <a className="toShopping" href="/" title="去购物">去购物 &gt;&gt;</a>
            </p>
          </div>
        </div>
    );
  }
}
