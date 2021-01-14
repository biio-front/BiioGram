import React from 'react';
import { useSelector } from 'react-redux';
import Home from '../components/posts/Home';
import Auth from './auth';

const App = () => {
  const { currentUser } = useSelector((state) => state.user);
  return <>{currentUser ? <Home /> : <Auth />}</>;
};

export default App;
