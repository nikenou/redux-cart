/**
 * Created by Soon on 9/25/2015.
 */

import React, { PropTypes } from 'react';

export default class EntryImage extends React.Component {

  constructor(props) {
    super(props);
  }

  static propTypes = {
    image: PropTypes.object.isRequired,
  };

  render() {
    const { image } = this.props;

    return <img className="image" src={image.url} />;
  }

}
