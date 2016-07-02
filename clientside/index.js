import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import appStore from './AppReducer';
import AppContainer from './containers/AppContainer';

let store = createStore(appStore, applyMiddleware(thunk));

render(
  <Provider store={store}>
    <AppContainer />
  </Provider>,
  document.getElementById('root')
);
