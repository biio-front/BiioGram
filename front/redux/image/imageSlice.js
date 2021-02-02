const { createSlice } = require('@reduxjs/toolkit');

const initialState = {
  uploadImagesLoading: false,
  uploadImagesDone: false,
  uploadImagesError: null,
  imagePaths: null,
};

const slice = createSlice({
  name: 'image',
  initialState,
  reducers: {
    uploadPostImagesRequest(state) {
      state.uploadImagesLoading = true;
      state.uploadImagesDone = false;
      state.uploadImagesError = null;
    },
    uploadAvatarImageRequest(state) {
      state.uploadImagesLoading = true;
      state.uploadImagesDone = false;
      state.uploadImagesError = null;
    },
    uploadImagesSuccess(state, { payload }) {
      state.uploadImagesLoading = false;
      state.uploadImagesDone = true;
      state.imagePaths = payload.map((v) => ({ src: v }));
    },
    uploadImagesFail(state, { payload: error }) {
      console.log(error);
      state.uploadImagesLoading = false;
      state.uploadImagesError = error;
    },
    getImagePaths(state, { payload }) {
      state.imagePaths = payload;
    },
    resetImagePaths(state) {
      state.imagePaths = null;
    },
  },
});

export default slice.reducer;
export const {
  uploadPostImagesRequest,
  uploadAvatarImageRequest,
  uploadImagesSuccess,
  uploadImagesFail,
  getImagePaths,
  resetImagePaths,
} = slice.actions;
