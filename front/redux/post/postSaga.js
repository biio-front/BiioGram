import axios from 'axios';
import { all, call, delay, fork, put, takeLatest } from 'redux-saga/effects';
import {
  addCommentRequest,
  addCommentSuccess,
  addCommentFail,
  addLikersRequest,
  addLikersSuccess,
  addLikersFail,
  addPostRequest,
  addPostSuccess,
  addPostFail,
  removeCommentRequest,
  removeCommentSuccess,
  removeCommentFail,
  removeLikersRequest,
  removeLikersSuccess,
  removeLikersFail,
  removePostRequest,
  removePostSuccess,
  removePostFail,
  updatePostRequest,
  updatePostSuccess,
  updatePostFail,
  uploadImagesRequest,
  uploadImagesSuccess,
  uploadImagesFail,
  loadPostsRequest,
  loadPostsSuccess,
  loadPostsFail,
} from './postSlice';
import { addCommentToMe, addPostToMe, removeCommentToMe } from '../user/userSlice';

function loadPostsAPI() {
  return axios.get('/posts');
}
function* loadPosts() {
  try {
    const result = yield call(loadPostsAPI);
    yield put(loadPostsSuccess(result.data));
  } catch (err) {
    console.log(err);
    yield put(loadPostsFail(err));
  }
}

function uploadImagesAPI(data) {
  return axios.post('/post/images', data);
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

function addPostAPI(data) {
  return axios.post('/post', data);
}
function* addPost({ payload }) {
  try {
    const result = yield call(addPostAPI, payload);
    console.log(result.data);
    yield put(addPostSuccess(result.data));
    // yield put(addPostToMe({ ...payload }));
  } catch (err) {
    console.log(err);
    yield put(addPostFail(err));
  }
}

function* updatePost({ payload }) {
  try {
    yield delay(1000);
    yield put(updatePostSuccess({ ...payload }));
    yield put(addPostToMe({ ...payload }));
  } catch (err) {
    console.log(err);
    yield put(updatePostFail(err));
  }
}

function removePostAPI(data) {
  return axios.delete(`/post/${data}`); // DELET /post/postId
}
function* removePost({ payload }) {
  try {
    const result = yield call(removePostAPI, payload);
    yield put(removePostSuccess(result.data));
  } catch (err) {
    console.log(err);
    yield put(removePostFail(err));
  }
}

function* addComment({ payload }) {
  try {
    yield delay(1000);
    yield put(addCommentSuccess(payload));
    yield put(addCommentToMe(payload));
  } catch (err) {
    console.log(err);
    yield put(addCommentFail(err));
  }
}

function* removeComment({ payload }) {
  try {
    yield delay(1000);
    yield put(removeCommentSuccess(payload));
    yield put(removeCommentToMe(payload));
  } catch (err) {
    console.log(err);
    yield put(removeCommentFail(err));
  }
}

function* addLikers({ payload }) {
  try {
    yield put(addLikersSuccess(payload));
  } catch (err) {
    console.log(err);
    yield put(addLikersFail(err));
  }
}

function* removeLikers({ payload }) {
  try {
    yield put(removeLikersSuccess(payload));
  } catch (err) {
    console.log(err);
    yield put(removeLikersFail(err));
  }
}

export function* watchLoadPosts() {
  yield takeLatest(loadPostsRequest, loadPosts);
}
export function* watchUploadImages() {
  yield takeLatest(uploadImagesRequest, uploadImages);
}
export function* watchAddPost() {
  yield takeLatest(addPostRequest, addPost);
}
export function* watchUpdatePost() {
  yield takeLatest(updatePostRequest, updatePost);
}
export function* watchremovePost() {
  yield takeLatest(removePostRequest, removePost);
}
export function* watchAddComment() {
  yield takeLatest(addCommentRequest, addComment);
}
export function* watchRemoveComment() {
  yield takeLatest(removeCommentRequest, removeComment);
}
export function* watchAddLikers() {
  yield takeLatest(addLikersRequest, addLikers);
}
export function* watchRemoveLikers() {
  yield takeLatest(removeLikersRequest, removeLikers);
}

export default function* postSaga() {
  yield all([
    fork(watchLoadPosts),
    fork(watchUploadImages),
    fork(watchAddPost),
    fork(watchUpdatePost),
    fork(watchremovePost),
    fork(watchAddComment),
    fork(watchRemoveComment),
    fork(watchAddLikers),
    fork(watchRemoveLikers),
  ]);
}
