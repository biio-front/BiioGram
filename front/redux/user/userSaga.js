import { all, delay, fork, put, takeLatest } from 'redux-saga/effects';
import { editProfileToPost } from '../post/postSlice';
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
} from './userSlice';

function* login({ payload }) {
  try {
    yield delay(1000);
    yield put(loginSuccess(payload));
  } catch (err) {
    console.log(err);
    yield put(loginFail(err));
  }
}

function* logout() {
  try {
    yield delay(1000);
    yield put(logoutSuccess());
  } catch (err) {
    console.log(err);
    yield put(logoutFail(err));
  }
}

function* signUp({ payload }) {
  try {
    yield delay(1000);
    yield put(signUpSuccess(payload));
  } catch (err) {
    console.log(err);
    yield put(signUpFail(err));
  }
}

function* editProfile({ payload }) {
  try {
    yield delay(1000);
    yield put(editProfileSuccess(payload));
    if (payload.src || payload.nickname) {
      yield put(editProfileToPost(payload));
    }
  } catch (err) {
    console.log(err);
    yield put(editProfileFail(err));
  }
}

function* addFollow({ payload }) {
  try {
    yield delay(1000);
    yield put(addFollowSuccess(payload));
  } catch (err) {
    console.log(err);
    yield put(addFollowFail(err));
  }
}

function* removeFollow({ payload }) {
  try {
    yield delay(1000);
    yield put(removeFollowSuccess(payload));
  } catch (err) {
    console.log(err);
    yield put(removeFollowFail(err));
  }
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
    fork(watchLogin),
    fork(watchLogout),
    fork(watchSignUp),
    fork(watchEditProfile),
    fork(watchAddFollow),
    fork(watchRemoveFollow),
  ]);
}
