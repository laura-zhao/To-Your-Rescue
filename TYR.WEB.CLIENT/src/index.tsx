/* eslint-disable no-use-before-define */
import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import './index.css';

import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from './redux/store';

import reportWebVitals from './reportWebVitals';
import App from './App';

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <Router>
        <PersistGate persistor={persistor}>
          <App />
        </PersistGate>
      </Router>
    </Provider>
  </React.StrictMode>,
  document.getElementById('root'),
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
