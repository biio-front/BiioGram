import { createSlice } from '@reduxjs/toolkit';

export const initialState = {
  loadPostsLoading: false,
  loadPostsDone: false,
  loadPostsError: null,
  uploadImagesLoading: false,
  uploadImagesDone: false,
  uploadImagesError: null,
  addPostLoading: false,
  addPostDone: false,
  addPostError: null,
  updatePostLoading: false,
  updatePostDone: false,
  updatePostError: null,
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
  imagePaths: null,
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
      state.mainPosts = payload;
    },
    loadPostsFail(state, { payload: error }) {
      console.log(error);
      state.loadPostsLoading = false;
      state.loadPostsError = error;
    },
    uploadImagesRequest(state) {
      state.uploadImagesLoading = true;
      state.uploadImagesDone = false;
      state.uploadImagesError = null;
    },
    uploadImagesSuccess(state, { payload }) {
      console.log(payload);
      state.uploadImagesLoading = false;
      state.uploadImagesDone = true;
      state.imagePaths = payload.map((v) => ({ src: `http://localhost:3055/${v}` }));
    },
    uploadImagesFail(state, { payload: error }) {
      console.log(error);
      state.uploadImagesLoading = false;
      state.uploadImagesError = error;
    },
    addPostRequest(state) {
      state.addPostLoading = true;
      state.addPostDone = false;
      state.addPostError = null;
    },
    addPostSuccess(state) {
      state.addPostLoading = false;
      state.addPostDone = true;
      state.imagePaths = null;
    },
    addPostFail(state, { payload: error }) {
      console.log(error);
      state.addPostLoading = false;
      state.addPostError = error;
    },
    updatePost(state, { payload: postId }) {
      const findPost = state.mainPosts.find((v) => v.id === postId);
      state.singlePost = findPost;
      state.imagePaths = findPost.Images;
    },
    updatePostRequest(state) {
      state.updatePostLoading = true;
      state.updatePostDone = false;
      state.updatePostError = null;
    },
    updatePostSuccess(state, { payload: { images, text } }) {
      const updatePost = state.mainPosts.find((v) => v.id === state.singlePost.id);
      state.updatePostLoading = false;
      state.updatePostDone = true;
      updatePost.Images = [...images];
      updatePost.content = text;
      state.singlePost = null;
    },
    updatePostFail(state, { payload: error }) {
      console.log(error);
      state.updatePostLoading = false;
      state.updatePostError = error;
    },
    removePostRequest(state) {
      state.removePostLoading = true;
      state.removePostDone = false;
      state.removePostError = null;
    },
    removePostSuccess(state, { payload }) {
      console.log(payload);
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
    addCommentSuccess(state, { payload: { postId, me, text } }) {
      state.addCommentLoading = false;
      state.addCommentDone = true;
      const post = state.mainPosts.find((v) => v.id === postId);
      post.Comments.push({
        id: post.Comments.length + 1,
        User: {
          id: me.id,
          nickname: me.nickname,
          avatar: me.avatar,
        },
        content: text,
      });
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
    addLikersSuccess(state, { payload: { postId, me } }) {
      state.addLikersLoading = false;
      state.addLikersDone = true;
      const post = state.mainPosts.find((v) => v.id === postId);
      post.Likers.push({
        id: me.id,
        nickname: me.nickname,
        avatar: me.avatar,
      });
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
    removeLikersSuccess(state, { payload: { postId, me } }) {
      state.removeLikersLoading = false;
      state.removeLikersDone = true;
      const post = state.mainPosts.find((v) => v.id === postId);
      post.Likers = post.Likers.filter((v) => v.id !== me.id);
    },
    removeLikersFail(state, { payload: error }) {
      console.log(error);
      state.removeLikersLoading = false;
      state.removeLikersError = error;
    },
    editProfileToPost(state, { payload: { userId, nickname, src } }) {
      const posts = state.mainPosts.filter((v) => v.User.id === userId);
      return posts.forEach((v) => (v.User.avatar = src) && (v.User.nickname = nickname));
    },
  },
});

export default slice.reducer;
export const {
  updatePost,
  loadPostsRequest,
  loadPostsSuccess,
  loadPostsFail,
  uploadImagesRequest,
  uploadImagesSuccess,
  uploadImagesFail,
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
  editProfileToPost,
} = slice.actions;
