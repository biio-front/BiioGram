const { createSlice } = require('@reduxjs/toolkit');
const { backURL } = require('../../config/config');

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
    uploadImagesRequest(state) {
      state.uploadImagesLoading = true;
      state.uploadImagesDone = false;
      state.uploadImagesError = null;
    },
    uploadImagesSuccess(state, { payload }) {
      state.uploadImagesLoading = false;
      state.uploadImagesDone = true;
      state.imagePaths = payload.map((v) => ({ src: `${backURL}/${v}` }));
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
  uploadImagesRequest,
  uploadImagesSuccess,
  uploadImagesFail,
  getImagePaths,
  resetImagePaths,
} = slice.actions;
