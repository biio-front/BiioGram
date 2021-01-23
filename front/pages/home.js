import React from 'react';
import { END } from 'redux-saga';
import Posts from '../components/posts/Posts';
import { loadPostsRequest } from '../redux/post/postSlice';
import wrapper from '../store/configureStore';

const Home = () => {
  return <Posts whatPosts={loadPostsRequest} />;
};

export const getServerSideProps = wrapper.getServerSideProps(async (context) => {
  console.log('getServerSideProps start');
  console.log(context.req?.headers.cookie);
  console.log('cookie....');
  context.store.dispatch(loadPostsRequest({ lastId: 0 })); // 처음 목록 불러오기
  context.store.dispatch(END);
  await context.store.sagaTask.toPromise();
});
export default Home;
