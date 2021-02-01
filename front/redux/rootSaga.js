import { all, fork } from 'redux-saga/effects';
import userSaga from '../redux/user/userSaga';
import postSaga from '../redux/post/postSaga';
import imageSaga from '../redux/image/imageSaga';
import axios from 'axios';
import { backURL } from '../config/config';

axios.defaults.baseURL = backURL;
axios.defaults.withCredentials = true;

export default function* rootSaga() {
  yield all([fork(userSaga), fork(postSaga), fork(imageSaga)]);
}
