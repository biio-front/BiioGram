import { createSlice } from '@reduxjs/toolkit';
// session 사용x 프론트로 리프레시토큰 발급.
export const initialState = {
  me: null,
  user: null,
  loginLoading: false,
  loginDone: false,
  loginError: null,
  logoutLoading: false,
  logoutDone: false,
  logoutError: null,
  signUpLoading: false,
  signUpDone: false,
  signUpError: null,
  editProfileLoading: false,
  editProfileDone: false,
  editProfileError: null,
  addFollowLoading: false,
  addFollowDone: false,
  addFollowError: null,
  removeFollowLoading: false,
  removeFollowDone: false,
  removeFollowError: null,
  getuserInfoLoading: false,
  getuserInfoDone: false,
  getuserInfoError: null,
};
const slice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    loginRequest(state) {
      state.loginLoading = true;
      state.loginDone = false;
      state.loginError = null;
    },
    loginSuccess(state, { payload }) {
      state.loginLoading = false;
      state.loginDone = true;
      state.me = payload;
    },
    loginFail(state, { payload: error }) {
      console.log(error);
      state.loginLoading = false;
      state.loginError = error;
    },
    logoutRequest(state) {
      state.logoutLoading = true;
      state.logoutDone = false;
      state.logoutError = null;
    },
    logoutSuccess(state) {
      state.logoutLoading = false;
      state.logoutDone = true;
      state.me = null;
    },
    logoutFail(state, { payload: error }) {
      state.logoutLoading = false;
      state.logoutError = error;
    },
    signUpRequest(state) {
      state.signUpLoading = true;
      state.signUpDone = false;
      state.signUpError = null;
    },
    signUpSuccess(state) {
      state.signUpLoading = false;
      state.signUpDone = true;
    },
    signUpFail(state, { payload: error }) {
      state.signUpLoading = false;
      state.signUpError = error;
    },
    editProfileRequest(state) {
      state.editProfileLoading = true;
      state.editProfileDone = false;
      state.editProfileError = null;
    },
    editProfileSuccess(state, { payload: { src, nickname, desc } }) {
      state.editProfileLoading = false;
      state.editProfileDone = true;
      state.me.avatar = src;
      state.me.nickname = nickname;
      state.me.desc = desc;
    },
    editProfileFail(state, { payload: error }) {
      state.editProfileLoading = false;
      state.editProfileError = error;
    },
    addFollowRequest(state) {
      state.addFollowLoading = true;
      state.addFollowDone = false;
      state.addFollowError = null;
    },
    addFollowSuccess(state, { payload }) {
      state.addFollowLoading = false;
      state.addFollowDone = true;
      state.me.Followings.push({ id: payload });
    },
    addFollowFail(state, { payload: error }) {
      console.log(error);
      state.addFollowLoading = false;
      state.addFollowError = error;
    },
    removeFollowRequest(state) {
      state.removeFollowLoading = true;
      state.removeFollowDone = false;
      state.removeFollowError = null;
    },
    removeFollowSuccess(state, { payload: userId }) {
      state.removeFollowLoading = false;
      state.removeFollowDone = true;
      const me = state.me;
      me.Followings = me.Followings.filter((v) => v.id !== userId);
    },
    removeFollowFail(state, { payload: error }) {
      console.log(error);
      state.removeFollowLoading = false;
      state.removeFollowError = error;
    },
    getUserInfoRequest(state) {
      state.getUserInfoLoading = true;
      state.getUserInfoDone = false;
      state.getUserInfoError = null;
    },
    getUserInfoSuccess(state, { payload }) {
      state.getUserInfoLoading = false;
      state.getUserInfoDone = true;
      state.user = payload;
    },
    getUserInfoFail(state, { payload: error }) {
      console.log(error);
      state.getUserInfoLoading = false;
      state.getUserInfoError = error;
    },
    getMyInfoRequest(state) {
      state.getUserInfoLoading = true;
      state.getUserInfoDone = false;
      state.getUserInfoError = null;
    },
    getMyInfoSuccess(state, { payload }) {
      state.getUserInfoLoading = false;
      state.getUserInfoDone = true;
      state.me = payload;
    },
    getMyInfoFail(state, { payload: error }) {
      console.log(error);
      state.getUserInfoLoading = false;
      state.getUserInfoError = error;
    },
    resetSignUp(state) {
      state.signUpDone = false;
    },
  },
});

export default slice.reducer;
export const {
  loginRequest,
  loginSuccess,
  loginFail,
  logoutRequest,
  logoutSuccess,
  logoutFail,
  signUpRequest,
  signUpSuccess,
  signUpFail,
  editProfileRequest,
  editProfileSuccess,
  editProfileFail,
  addFollowRequest,
  addFollowSuccess,
  addFollowFail,
  removeFollowRequest,
  removeFollowSuccess,
  removeFollowFail,
  getUserInfoRequest,
  getUserInfoSuccess,
  getUserInfoFail,
  getMyInfoRequest,
  getMyInfoSuccess,
  getMyInfoFail,
  resetSignUp,
} = slice.actions;
