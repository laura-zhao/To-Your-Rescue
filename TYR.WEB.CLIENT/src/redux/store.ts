import { createStore, applyMiddleware } from 'redux';
import logger from 'redux-logger';
import thunk from 'redux-thunk';
import { persistStore } from 'redux-persist';
import rootReducer from './root-reducer';

const middlewares = [thunk, logger];

// consuming middleware only during developmental phase
if (process.env.NODE_ENV === 'development') {
  middlewares.push(logger);
}

// applying root reducer and middleware to the store
const store = createStore(rootReducer, applyMiddleware(...middlewares));

const persistor = persistStore(store);

export { store, persistor };
