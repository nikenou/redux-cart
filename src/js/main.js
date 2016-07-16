import '../styles/styles.scss';

import 'babel-polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import configureStore  from './store/configureStore';

const store = configureStore();
const rootElement = document.getElementById('app');
const CartListApp = require('./containers/CartListApp').default;


// Render the React application to the DOM
ReactDOM.render(
  <Provider store={store}>
    <CartListApp />
  </Provider>,
  rootElement
);
