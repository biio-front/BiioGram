import axios from 'axios';
import { all, call, fork, put, takeLatest } from 'redux-saga/effects';
import {
  uploadImagesSuccess,
  uploadImagesFail,
  uploadPostImagesRequest,
  uploadAvatarImageRequest,
} from './imageSlice';

function uploadPostImagesAPI(data) {
  return axios.post('/images/post', data);
}
function* uploadPostImages({ payload }) {
  try {
    const result = yield call(uploadPostImagesAPI, payload);
    yield put(uploadImagesSuccess(result.data));
  } catch (err) {
    console.log(err);
    yield put(uploadImagesFail(err));
  }
}

function uploadAvatarImageAPI(data) {
  return axios.post('/images/avatar', data);
}
function* uploadAvatarImage({ payload }) {
  try {
    const result = yield call(uploadAvatarImageAPI, payload);
    yield put(uploadImagesSuccess(result.data));
  } catch (err) {
    console.log(err);
    yield put(uploadImagesFail(err));
  }
}

export function* watchUploadPostImages() {
  yield takeLatest(uploadPostImagesRequest, uploadPostImages);
}
export function* watchUploadAvatarImage() {
  yield takeLatest(uploadAvatarImageRequest, uploadAvatarImage);
}
export default function* imageSaga() {
  yield all([fork(watchUploadPostImages), fork(watchUploadAvatarImage)]);
}
