import React from 'react';
import { useSelector } from 'react-redux';
import Home from '../components/posts/Home';
import Auth from './auth';

const App = () => {
  const { me } = useSelector((state) => state.user);
  return <>{me ? <Home /> : <Auth />}</>;
};

export default App;
