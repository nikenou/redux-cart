import './cart.scss';

import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Dialog from 'rc-dialog';

import * as CartAction from '../actions/CartAction';
import CartList  from '../components/CartList/CartList';
import CartNoGoods  from '../components/CartList/CartNoGoods';

class CartListApp extends Component {

  static propTypes = {
    cartById: PropTypes.array.isRequired,
    logined: PropTypes.bool.isRequired,
    isFetching: PropTypes.bool.isRequired,
    fetchSuccess: PropTypes.bool.isRequired,
    lastUpdated: PropTypes.number,
    selectedTotalPrice: PropTypes.number,
    dispatch: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);
    this.state = {
      //login: false,
      fetchIng: false,
      fetched: false,
      loadingDialogVisible: true
    }
  }

  componentDidMount() {
    const { dispatch } = this.props;
    //const customerCode = window.data.customerCode;
    //dispatch(CartAction.fetchCustomerCode(customerCode));
    //alert(window.data.customerCode);
    /*if (customerCode != '' && customerCode != 'anonymous') {
      dispatch(CartAction.fetchCartIfNeeded());
    }*/
    dispatch(CartAction.fetchCartIfNeeded());
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.isFetching == true) {
      this.setState({
        fetchIng: true,
        loadingDialogVisible: true
      });
    } else {
      this.setState({
        fetchIng: false,
        loadingDialogVisible: false
      });
    }

    if (nextProps.fetchSuccess == true) {
      this.setState({
        fetchIng: false,
        fetched: true,
        loadingDialogVisible: false
      });
    }

    if(nextProps.selectedTotalPrice >= 0) {
      this.setState({selectedTotalPrice: nextProps.selectedTotalPrice});
    }
  }

  render () {
    const { dispatch, cartById, selectedTotalPrice, logined, isFetching, fetchSuccess, lastUpdated } = this.props;
    let { login, fetched, fetchIng, loadingDialogVisible } = this.state;

    let loadingDialog = (
      <Dialog className="lsDialog" closable={false} visible={loadingDialogVisible} animation="slide-fade" maskAnimation="fade" style={{ width: 80 }}>
        <div>
          <img src="/_ui/desktop/v3/app/build/img/common/loading.gif" />
        </div>
      </Dialog>
    );

    if(fetchIng == true) {
      return (
        <div className="shoppingCart">
          {loadingDialog}
        </div>
      );
    }

    if(fetched == true) {
      if(cartById.length != 0) {
        return (
          <div className="shoppingCart">
            <CartList totalPrice={selectedTotalPrice} cart={cartById} fetchSuccess={fetched} dispatch={dispatch} />
          </div>
        );
      } else {
        return (
          <CartNoGoods dispatch={dispatch} />
        );
      }
    } else {
      return (
        <CartNoGoods dispatch={dispatch} />
      );
    }
  }
}

function mapStateToProps(state) {
  const { cartList } = state;
  const {
    carts: carts,
    cartById: cartById,
    logined,
    isFetching,
    fetchSuccess,
    lastUpdated,
    selectedTotalPrice
    } = cartList || {
    carts: [],
    cartById: [],
    logined: false,
    isFetching: true,
    fetchSuccess: false,
    selectedTotalPrice: 0
  };

  return {
    carts,
    cartById,
    logined,
    isFetching,
    fetchSuccess,
    lastUpdated,
    selectedTotalPrice
  }
}
export default connect(
  mapStateToProps
)(CartListApp);
