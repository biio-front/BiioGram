import { combineReducers } from 'redux';
import user from '../redux/user/userSlice';
import post from '../redux/post/postSlice';

const rootReducer = combineReducers({ user, post });

export default rootReducer;
