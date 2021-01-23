import axios from 'axios';
import { all, call, fork, put, takeLatest } from 'redux-saga/effects';
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
  loadPostsRequest,
  loadPostsSuccess,
  loadPostsFail,
  loadHashtagPostsRequest,
  loadHashtagPostsSuccess,
  loadHashtagPostsFail,
} from './postSlice';
import { resetImagePaths } from '../image/imageSlice';

function loadPostsAPI({ lastId }) {
  return axios.get(`/posts?lastId=${lastId || 0}`);
}
function* loadPosts({ payload }) {
  try {
    const result = yield call(loadPostsAPI, payload);
    yield put(loadPostsSuccess(result.data));
  } catch (err) {
    console.error(err);
    yield put(loadPostsFail(err));
  }
}

function loadHashtagPostsAPI({ lastId, query }) {
  return axios.get(`/hashtag/${query}?lastId=${lastId}`);
}
function* loadHashtagPosts({ payload }) {
  try {
    const result = yield call(loadHashtagPostsAPI, payload);
    yield put(loadHashtagPostsSuccess(result.data));
  } catch (err) {
    console.error(err);
    yield put(loadHashtagPostsFail(err));
  }
}

function addPostAPI(data) {
  return axios.post('/post', data);
}
function* addPost({ payload }) {
  try {
    const result = yield call(addPostAPI, payload);
    yield put(addPostSuccess(result.data));
    yield put(resetImagePaths());
  } catch (err) {
    console.error(err);
    yield put(addPostFail(err));
  }
}

function updatePostAPI(data) {
  const { postId } = data;
  return axios.patch(`/post/${postId}`, data);
}
function* updatePost({ payload }) {
  try {
    const result = yield call(updatePostAPI, payload);
    yield put(updatePostSuccess(result.data));
    yield put(resetImagePaths());
  } catch (err) {
    console.error(err);
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
    console.error(err);
    yield put(removePostFail(err));
  }
}

function addCommentAPI({ postId, content }) {
  return axios.post(`/post/${postId}/comment`, { content });
}
function* addComment({ payload }) {
  try {
    const result = yield call(addCommentAPI, payload);
    yield put(addCommentSuccess(result.data));
  } catch (err) {
    console.error(err);
    yield put(addCommentFail(err));
  }
}

function removeCommentAPI({ postId, commentId }) {
  return axios.delete(`/post/${postId}/comment/${commentId}`);
}
function* removeComment({ payload }) {
  try {
    const result = yield call(removeCommentAPI, payload);
    yield put(removeCommentSuccess(result.data));
  } catch (err) {
    console.error(err);
    yield put(removeCommentFail(err));
  }
}

function addLikersAPI(data) {
  return axios.patch(`/post/${data}/like`); // PATCH /post/postId/like
}
function* addLikers({ payload }) {
  try {
    const result = yield call(addLikersAPI, payload);
    yield put(addLikersSuccess(result.data));
  } catch (err) {
    console.error(err);
    yield put(addLikersFail(err));
  }
}

function removeLikersAPI(data) {
  return axios.delete(`/post/${data}/like`); // DELET /post/postId/like
}
function* removeLikers({ payload }) {
  try {
    const result = yield call(removeLikersAPI, payload);
    yield put(removeLikersSuccess(result.data));
  } catch (err) {
    console.error(err);
    yield put(removeLikersFail(err));
  }
}

export function* watchLoadHashtagPosts() {
  yield takeLatest(loadHashtagPostsRequest, loadHashtagPosts);
}
export function* watchLoadPosts() {
  yield takeLatest(loadPostsRequest, loadPosts);
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
    fork(watchLoadHashtagPosts),
    fork(watchAddPost),
    fork(watchUpdatePost),
    fork(watchremovePost),
    fork(watchAddComment),
    fork(watchRemoveComment),
    fork(watchAddLikers),
    fork(watchRemoveLikers),
  ]);
}
