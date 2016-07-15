/**
 * Created by Soon on 9/30/2015.
 */

import React, { PropTypes } from 'react';

export default class EmptyImage extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Icon className="EmptyImage" type="lessomall-pic" />
    );
  }

}
