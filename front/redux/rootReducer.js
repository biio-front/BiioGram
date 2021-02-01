import { HYDRATE } from 'next-redux-wrapper';
import { combineReducers } from 'redux';
import user from '../redux/user/userSlice';
import post from '../redux/post/postSlice';
import image from '../redux/image/imageSlice';

const rootReducer = (state, action) => {
  switch (action.type) {
    case HYDRATE:
      return action.payload;
    default: {
      const combinedReducer = combineReducers({ user, post, image });
      return combinedReducer(state, action);
    }
  }
};

export default rootReducer;
