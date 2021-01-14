import { createWrapper } from 'next-redux-wrapper';
import createSagaMiddleware from 'redux-saga';
import { configureStore } from '@reduxjs/toolkit';

import { combineReducers } from 'redux';
import user from '../redux/user/userSlice';
import post from '../redux/post/postSlice';

import { all } from 'redux-saga/effects';
import userSaga from '../redux/user/userSaga';
import postSaga from '../redux/post/postSaga';

const rootReducer = combineReducers({ user, post });

function* rootSaga() {
  yield all([userSaga(), postSaga()]);
}

const Store = () => {
  const sagaMiddleware = createSagaMiddleware();
  const store = configureStore({
    reducer: rootReducer,
    middleware: [sagaMiddleware],
    devTools: process.env.NODE_ENV === 'development',
  });
  sagaMiddleware.run(rootSaga);

  return store;
};

const wrapper = createWrapper(Store, {
  debug: process.env.NODE_ENV === 'development',
});

export default wrapper;
