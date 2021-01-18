import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loadMyInfoRequest } from '../../redux/user/userSlice';
import AppLayout from '../layout/AppLayout';
import PostCard from './PostCard';

const Home = () => {
  const { mainPosts } = useSelector((state) => state.post);
  const dispatch = useDispatch();

  const onClick = useCallback(() => dispatch(loadMyInfoRequest()), []);
  return (
    <>
      <AppLayout>
        <button onClick={onClick}>Load My Info</button>
        {mainPosts.map((v) => (
          <PostCard
            key={v.id}
            user={v.User}
            content={v.content}
            Images={v.Images}
            comments={v.Comments}
            postId={v.id}
            Likers={v.Likers}
          />
        ))}
      </AppLayout>
    </>
  );
};

export default Home;
