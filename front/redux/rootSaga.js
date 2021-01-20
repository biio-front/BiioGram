import { all, fork } from 'redux-saga/effects';
import userSaga from '../redux/user/userSaga';
import postSaga from '../redux/post/postSaga';
import imageSaga from '../redux/image/imageSaga';
import axios from 'axios';

axios.defaults.baseURL = 'http://localhost:3055';
axios.defaults.withCredentials = true;

export default function* rootSaga() {
  yield all([fork(userSaga), fork(postSaga), fork(imageSaga)]);
}
