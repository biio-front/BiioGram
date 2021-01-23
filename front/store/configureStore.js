import { createWrapper } from 'next-redux-wrapper';
import createSagaMiddleware from 'redux-saga';
import { configureStore } from '@reduxjs/toolkit';
import rootSaga from '../redux/rootSaga';
import rootReducer from '../redux/rootReducer';

const store = () => {
  const sagaMiddleware = createSagaMiddleware();
  const store = configureStore({
    reducer: rootReducer,
    middleware: [sagaMiddleware],
    devTools: process.env.NODE_ENV === 'development',
  });
  store.sagaTask = sagaMiddleware.run(rootSaga);

  return store;
};

const wrapper = createWrapper(store, {
  debug: process.env.NODE_ENV === 'development',
});

export default wrapper;
