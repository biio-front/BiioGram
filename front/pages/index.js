import React from 'react';
import { useSelector } from 'react-redux';
import Auth from './auth';
import Home from './home';

const App = () => {
  const { me } = useSelector((state) => state.user);
  return <>{me ? <Home /> : <Auth />}</>;
};

export default App;
