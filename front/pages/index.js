import Router from 'next/router';
import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import Posts from '../components/posts/Posts';
import { loadPostsRequest } from '../redux/post/postSlice';
import Auth from './auth';

const App = () => {
  const { me } = useSelector((state) => state.user);
  const router = Router;
  useEffect(() => !me && router.replace('/'), [me]);
  return <>{me ? <Posts whatPosts={loadPostsRequest} /> : <Auth />}</>;
};

export default App;
