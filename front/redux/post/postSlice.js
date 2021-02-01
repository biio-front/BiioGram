import { createSlice } from '@reduxjs/toolkit';

export const initialState = {
  loadPostsLoading: false,
  loadPostsDone: false,
  loadPostsError: null,
  loadHashtagPostsLoading: false,
  loadHashtagPostsDone: false,
  loadHashtagPostsError: null,
  addPostLoading: false,
  addPostDone: false,
  addPostError: null,
  removePostLoading: false,
  removePostDone: false,
  removePostError: null,
  addCommentLoading: false,
  addCommentDone: false,
  addCommentError: null,
  removeCommentLoading: false,
  removeCommentDone: false,
  removeCommentError: null,
  addLikersLoading: false,
  addLikersDone: false,
  addLikersError: null,
  removeLikersLoading: false,
  removeLikersDone: false,
  removeLikersError: null,
  mainPosts: [],
  singlePost: null,
};

const slice = createSlice({
  name: 'post',
  initialState,
  reducers: {
    loadPostsRequest(state) {
      state.loadPostsLoading = true;
      state.loadPostsDone = false;
      state.loadPostsError = null;
    },
    loadPostsSuccess(state, { payload }) {
      state.loadPostsLoading = false;
      state.loadPostsDone = true;
      state.hasMorePosts = payload.length === 5;
      state.mainPosts.push(...payload);
    },
    loadPostsFail(state, { payload: error }) {
      console.log(error);
      state.loadPostsLoading = false;
      state.loadPostsError = error;
    },
    loadHashtagPostsRequest(state) {
      state.loadHashtagPostsLoading = true;
      state.loadHashtagPostsDone = false;
      state.loadHashtagPostsError = null;
    },
    loadHashtagPostsSuccess(state, { payload }) {
      state.loadHashtagPostsLoading = false;
      state.loadHashtagPostsDone = true;
      state.hasMorePosts = payload.length === 5;
      state.mainPosts.push(...payload);
    },
    loadHashtagPostsFail(state, { payload: error }) {
      console.log(error);
      state.loadHashtagPostsLoading = false;
      state.loadHashtagPostsError = error;
    },
    addPostRequest(state) {
      state.addPostLoading = true;
      state.addPostDone = false;
      state.addPostError = null;
    },
    addPostSuccess(state, { payload }) {
      console.log(payload);
      state.addPostLoading = false;
      state.addPostDone = true;
      state.mainPosts.splice(0, 0, payload);
    },
    addPostFail(state, { payload: error }) {
      console.log(error);
      state.addPostLoading = false;
      state.addPostError = error;
    },
    preupdatePost(state, { payload: postId }) {
      const findPost = state.mainPosts.find((v) => v.id === postId);
      state.singlePost = findPost;
    },
    updatePostRequest(state) {
      state.addPostLoading = true;
      state.addPostDone = false;
      state.addPostError = null;
    },
    updatePostSuccess(state, { payload: { images, content } }) {
      const updatePost = state.mainPosts.find((v) => v.id === state.singlePost.id);
      state.addPostLoading = false;
      state.addPostDone = true;
      updatePost.Images = images;
      updatePost.content = content;
      state.singlePost = null;
    },
    updatePostFail(state, { payload: error }) {
      console.log(error);
      state.addPostLoading = false;
      state.addPostError = error;
    },
    removePostRequest(state) {
      state.removePostLoading = true;
      state.removePostDone = false;
      state.removePostError = null;
    },
    removePostSuccess(state, { payload }) {
      state.removePostLoading = false;
      state.removePostDone = true;
      state.mainPosts = state.mainPosts.filter((v) => v.id !== payload);
    },
    removePostFail(state, { payload: error }) {
      console.log(error);
      state.removePostLoading = false;
      state.removePostError = error;
    },
    addCommentRequest(state) {
      state.addCommentLoading = true;
      state.addCommentDone = false;
      state.addCommentError = null;
    },
    addCommentSuccess(state, { payload }) {
      state.addCommentLoading = false;
      state.addCommentDone = true;
      const post = state.mainPosts.find((v) => v.id === payload.PostId);
      post.Comments.unshift(payload);
    },
    addCommentFail(state, { payload: error }) {
      console.log(error);
      state.addCommentLoading = false;
      state.addCommentError = error;
    },
    removeCommentRequest(state) {
      state.removeCommentLoading = true;
      state.removeCommentDone = false;
      state.removeCommentError = null;
    },
    removeCommentSuccess(state, { payload: { postId, commentId } }) {
      state.removeCommentLoading = false;
      state.removeCommentDone = true;
      const post = state.mainPosts.find((v) => v.id === postId);
      post.Comments = post.Comments.filter((v) => v.id !== commentId);
    },
    removeCommentFail(state, { payload: error }) {
      console.log(error);
      state.removeCommentLoading = false;
      state.removeCommentError = error;
    },
    addLikersRequest(state) {
      state.addLikersLoading = true;
      state.addLikersDone = false;
      state.addLikersError = null;
    },
    addLikersSuccess(state, { payload: { postId, user } }) {
      state.addLikersLoading = false;
      state.addLikersDone = true;
      const post = state.mainPosts.find((v) => v.id === postId);
      post.Likers.push(user);
    },
    addLikersFail(state, { payload: error }) {
      console.log(error);
      state.addLikersLoading = false;
      state.addLikersError = error;
    },
    removeLikersRequest(state) {
      state.removeLikersLoading = true;
      state.removeLikersDone = false;
      state.removeLikersError = null;
    },
    removeLikersSuccess(state, { payload: { postId, userId } }) {
      state.removeLikersLoading = false;
      state.removeLikersDone = true;
      const post = state.mainPosts.find((v) => v.id === postId);
      post.Likers = post.Likers.filter((v) => v.id !== userId);
    },
    removeLikersFail(state, { payload: error }) {
      console.log(error);
      state.removeLikersLoading = false;
      state.removeLikersError = error;
    },
    resetPostForm(state) {
      state.addPostDone = false;
    },
  },
});

export default slice.reducer;
export const {
  preupdatePost,
  loadPostsRequest,
  loadPostsSuccess,
  loadPostsFail,
  loadHashtagPostsRequest,
  loadHashtagPostsSuccess,
  loadHashtagPostsFail,
  addPostRequest,
  addPostSuccess,
  addPostFail,
  updatePostRequest,
  updatePostSuccess,
  updatePostFail,
  removePostRequest,
  removePostSuccess,
  removePostFail,
  addCommentRequest,
  addCommentSuccess,
  addCommentFail,
  removeCommentRequest,
  removeCommentSuccess,
  removeCommentFail,
  addLikersRequest,
  addLikersSuccess,
  addLikersFail,
  removeLikersRequest,
  removeLikersSuccess,
  removeLikersFail,
  resetPostForm,
} = slice.actions;
