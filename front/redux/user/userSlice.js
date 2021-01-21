import { createSlice } from '@reduxjs/toolkit';

export const initialState = {
  loadMyInfoLoading: false,
  loadMyInfoDone: false,
  loadMyInfoError: null,
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
  me: null,
};
const slice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    loadMyInfoRequest(state) {
      state.loadMyInfoLoading = true;
      state.loadMyInfoDone = false;
      state.loadMyInfoError = null;
    },
    loadMyInfoSuccess(
      state,
      { payload: { id, email, nickname, avatar, desc, Followers, Followings } },
    ) {
      state.loadMyInfoLoading = false;
      state.loadMyInfoDone = true;
      state.me = {
        id,
        email,
        nickname,
        avatar,
        desc,
        Followings,
        Followers,
      };
    },
    loadMyInfoFail(state, { payload: error }) {
      console.log(error);
      state.loadMyInfoLoading = false;
      state.loadMyInfoError = error;
    },
    loginRequest(state) {
      state.loginLoading = true;
      state.loginDone = false;
      state.loginError = null;
    },
    loginSuccess(
      state,
      { payload: { id, email, nickname, avatar, desc, Followers, Followings } },
    ) {
      state.loginLoading = false;
      state.loginDone = true;
      state.me = {
        id,
        email,
        nickname,
        avatar,
        desc,
        Followings,
        Followers,
      };
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
    enterGuest(state) {
      state.me = {
        id: 0,
        nickname: 'guest',
        Followings: [],
      };
    },
  },
});

export default slice.reducer;
export const {
  loadMyInfoRequest,
  loadMyInfoSuccess,
  loadMyInfoFail,
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
  enterGuest,
} = slice.actions;
