import axios from 'axios';
import React from 'react';
import { useSelector } from 'react-redux';
import { END } from 'redux-saga';
import { getMyInfoRequest } from '../redux/user/userSlice';
import wrapper from '../store/configureStore';
import Auth from '../components/auth';
import { loadPostsRequest } from '../redux/post/postSlice';
import Posts from '../components/posts';

const App = () => {
  const { me } = useSelector((state) => state.user);
  return <>{me ? <Posts whatPosts={loadPostsRequest} /> : <Auth />}</>;
};

export const getServerSideProps = wrapper.getServerSideProps(async (context) => {
  context.store.dispatch(loadPostsRequest({ lastId: 0 })); // 처음 목록 불러오기
  const cookie = context.req?.headers.cookie;
  if (context.req && cookie) {
    axios.defaults.headers.Cookie = cookie;
    context.store.dispatch(getMyInfoRequest());
    axios.defaults.headers.Cookie = '';
  }
  context.store.dispatch(END);
  await context.store.sagaTask.toPromise();
});
export default App;
