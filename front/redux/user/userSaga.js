import axios from 'axios';
import { all, call, fork, put, takeLatest } from 'redux-saga/effects';
import { resetImagePaths } from '../image/imageSlice';
import {
  loginFail,
  loginRequest,
  loginSuccess,
  logoutFail,
  logoutRequest,
  logoutSuccess,
  signUpFail,
  signUpRequest,
  signUpSuccess,
  editProfileRequest,
  editProfileSuccess,
  editProfileFail,
  addFollowRequest,
  addFollowSuccess,
  addFollowFail,
  removeFollowRequest,
  removeFollowSuccess,
  removeFollowFail,
  loadMyInfoRequest,
  loadMyInfoSuccess,
  loadMyInfoFail,
  getAccessToken,
} from './userSlice';

function getAccessTokenAPI() {
  return axios.post('/auth/refresh-token');
}
function* getAccessTokenSaga() {
  try {
    const result = yield call(getAccessTokenAPI);
    console.log(result.data.token);
    // yield put(loadMyInfoSuccess(result.data));
  } catch (err) {
    console.error(err);
    // yield put(loadMyInfoFail(err));
  }
}

function loadMyInfoAPI() {
  return axios.get('/user');
}
function* loadMyInfo() {
  try {
    const result = yield call(loadMyInfoAPI);
    yield put(loadMyInfoSuccess(result.data));
  } catch (err) {
    console.error(err);
    yield put(loadMyInfoFail(err));
  }
}

function loginAPI(data) {
  return axios.post('/auth/login', data);
}
function* login({ payload }) {
  try {
    const result = yield call(loginAPI, payload);
    const { token: accessToken } = result.data;
    axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
    yield put(loginSuccess(result.data.me));
  } catch (err) {
    console.error(err);
    yield put(loginFail(err));
  }
}

function logoutAPI() {
  return axios.delete('/auth/logout');
}
function* logout() {
  try {
    const result = yield call(logoutAPI);
    axios.defaults.headers.common['Authorization'] = '';
    yield put(logoutSuccess(result));
  } catch (err) {
    console.error(err);
    yield put(logoutFail(err));
  }
}

function signUpAPI(data) {
  return axios.post('/auth/signup', data);
}
function* signUp({ payload }) {
  try {
    yield call(signUpAPI, payload);
    yield put(signUpSuccess());
  } catch (err) {
    console.error(err);
    yield put(signUpFail(err));
  }
}

function editProfileAPI(data) {
  const { userId } = data;
  return axios.patch(`/user/${userId}/edit`, data);
}
function* editProfile({ payload }) {
  try {
    const result = yield call(editProfileAPI, payload);
    yield put(editProfileSuccess(result.data));
    yield put(resetImagePaths());
  } catch (err) {
    console.error(err);
    yield put(editProfileFail(err));
  }
}

function addFollowAPI(data) {
  return axios.patch(`/user/${data}/follow`); // PATCH /user/userId/follow
}
function* addFollow({ payload }) {
  try {
    const result = yield call(addFollowAPI, payload);
    yield put(addFollowSuccess(result.data));
  } catch (err) {
    console.error(err);
    yield put(addFollowFail(err));
  }
}

function removeFollowAPI(data) {
  return axios.delete(`/user/${data}/follow`); // DELETE /user/userId/follow
}
function* removeFollow({ payload }) {
  try {
    const result = yield call(removeFollowAPI, payload);
    yield put(removeFollowSuccess(result.data));
  } catch (err) {
    console.error(err);
    yield put(removeFollowFail(err));
  }
}

export function* watchGetAccessToken() {
  yield takeLatest(getAccessToken, getAccessTokenSaga);
}
export function* watchLoadMyInfo() {
  yield takeLatest(loadMyInfoRequest, loadMyInfo);
}
export function* watchLogin() {
  yield takeLatest(loginRequest, login);
}
export function* watchLogout() {
  yield takeLatest(logoutRequest, logout);
}
export function* watchSignUp() {
  yield takeLatest(signUpRequest, signUp);
}
export function* watchEditProfile() {
  yield takeLatest(editProfileRequest, editProfile);
}
export function* watchAddFollow() {
  yield takeLatest(addFollowRequest, addFollow);
}
export function* watchRemoveFollow() {
  yield takeLatest(removeFollowRequest, removeFollow);
}

export default function* userSaga() {
  yield all([
    fork(watchGetAccessToken),
    fork(watchLoadMyInfo),
    fork(watchLogin),
    fork(watchLogout),
    fork(watchSignUp),
    fork(watchEditProfile),
    fork(watchAddFollow),
    fork(watchRemoveFollow),
  ]);
}
