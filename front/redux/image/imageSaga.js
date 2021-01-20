import axios from 'axios';
import { all, call, fork, put, takeLatest } from 'redux-saga/effects';
import { uploadImagesRequest, uploadImagesSuccess, uploadImagesFail } from './imageSlice';

function uploadImagesAPI(data) {
  return axios.post('/images', data);
}
function* uploadImages({ payload }) {
  try {
    const result = yield call(uploadImagesAPI, payload);
    yield put(uploadImagesSuccess(result.data));
  } catch (err) {
    console.log(err);
    yield put(uploadImagesFail(err));
  }
}

export function* watchUploadImages() {
  yield takeLatest(uploadImagesRequest, uploadImages);
}
export default function* imageSaga() {
  yield all([fork(watchUploadImages)]);
}
