import { createSlice } from '@reduxjs/toolkit';

export const initialState = {
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
  currentUser: null,
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
    loginSuccess(state, { id, email, nickname }) {
      state.loginLoading = false;
      state.loginDone = true;
      state.currentUser = {
        id,
        email,
        nickname,
        avatar: null,
        Followers: [],
        Followings: [],
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
      state.currentUser = null;
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
      state.currentUser.avatar = src;
      state.currentUser.nickname = nickname;
      state.currentUser.desc = desc;
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
    addFollowSuccess(state, { payload: { userId, nickname } }) {
      state.addFollowLoading = false;
      state.addFollowDone = true;
      state.currentUser.Followings.push({ id: userId, nickname });
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
      const me = state.currentUser;
      me.Followings = me.Followings.filter((v) => v.id !== userId);
    },
    removeFollowFail(state, { payload: error }) {
      console.log(error);
      state.removeFollowLoading = false;
      state.removeFollowError = error;
    },
    addPostToMe(state, { payload: { images, newId } }) {
      state.currentUser.Posts.unshift({
        id: newId,
        Images: { ...images },
        Comments: [],
        Likers: [],
      });
    },
    updatePostToMe(state, { payload: { images, postId } }) {
      const post = state.currentUser.Posts.find((v) => v.id === postId);
      post.Images = [...images];
    },
    removePostToMe(state, { payload }) {
      state.currentUser.Posts = state.currentUser.Posts.filter((v) => v.id !== payload);
    },
    addCommentToMe(state, { payload: { postId } }) {
      const post = state.currentUser.Posts.find((v) => v.id === postId);
      post.Comments.push({ id: post.Comments.length + 1 });
    },
    removeCommentToMe(state, { payload: { postId, commentId } }) {
      const post = state.currentUser.Posts.find((v) => v.id === postId);
      post.Comments = post.Comments.filter((v) => v.id !== commentId);
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
  addPostToMe,
  removePostToMe,
  addCommentToMe,
  removeCommentToMe,
} = slice.actions;
