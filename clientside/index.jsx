import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import appStore from './reducers';
import App from './components/App.jsx';

let store = createStore(appStore);

render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);
