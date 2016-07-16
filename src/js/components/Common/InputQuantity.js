import './InputQuantity.scss';

import React, { PropTypes } from 'react';
import { Map } from 'immutable';
import classnames from 'classnames';

export default class InputQuantity extends React.Component {

  static propTypes = {
    max: PropTypes.number,
    quantity: PropTypes.number,
    onQuantityChange: PropTypes.func,
  };

  constructor(props) {
    super(props);
    this.state = {
      data: Map({
        quantity: props.quantity || 1,
      }),
    };
  }

  setImmState = (fn)=>
    this.setState(({ data }) => ({
      data: fn(data),
    }));

  setQuantity = (value)=> {
    this.setImmState(d => d.set('quantity', value));
  };

  triggerQuantityChange = (newValue)=> {
    const { max } = this.props;
    const oldValue = this.state.data.get('quantity');
    const isInteger = /^[1-9]\d*$/.test(newValue);
    const isEmpty = newValue === '';
    if (isInteger) {
      if (newValue > max) {
        return false;
      }
      //if (isInteger) {
      newValue = parseInt(newValue, 10);
      //}

      this.setQuantity(newValue);

      const { onQuantityChange } = this.props;
      if (typeof onQuantityChange === 'function') {
        onQuantityChange(newValue, oldValue);
      }
    } else if (isEmpty){
      this.setQuantity(1);
    }
  };

  handleMinus = ()=> {
    const { quantity } = this.state.data.toJS();
    this.triggerQuantityChange(parseInt(quantity - 1, 10));
  };

  handleAdd = ()=> {
    const { quantity } = this.state.data.toJS();
    this.triggerQuantityChange(parseInt(quantity + 1, 10));
  };

  handleChange = (event)=> {
    const value = event.target.value;
    this.triggerQuantityChange(value);
  };

  render() {
    const {} = this.props;
    const { quantity } = this.state.data.toJS();
    let minClass = classnames({
      'opt': true,
      'opt-min': true,
      'disabled': quantity == 1 ? true : false
    });

    return (
      <div className="input-quantity fix">
        <span className={minClass} onClick={this.handleMinus} >-</span>
        <input className="input-text" value={quantity} onChange={this.handleChange} />
        <span className="opt opt-add" onClick={this.handleAdd} >+</span>
      </div>
    );
  }
}
