/**
 * Created by Xin on 5/24/16.
 */

import React, { PropTypes } from 'react';
export default class Price extends React.Component {

  static propTypes = {
    value: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
    ]),
    zeroable: PropTypes.bool,
  };

  static defaultProps = {
    zeroable: false,
  };


  render() {
    const { value, zeroable } = this.props;

    return (
      <b className="pPrice">
        {value === 0 && !zeroable ? '面议' : `￥${parseFloat(value).toFixed(2)}`}
      </b>
    );
  }
}
