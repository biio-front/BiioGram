import { combineReducers } from 'redux';
import user from '../redux/user/userSlice';
import post from '../redux/post/postSlice';
import image from '../redux/image/imageSlice';

const rootReducer = combineReducers({ user, post, image });

export default rootReducer;
