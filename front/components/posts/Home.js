import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loadPostsRequest } from '../../redux/post/postSlice';
import AppLayout from '../layout/AppLayout';
import PostCard from './PostCard';

const Home = () => {
  const { mainPosts } = useSelector((state) => state.post);
  const dispatch = useDispatch();
  useEffect(() => dispatch(loadPostsRequest()), []);

  return (
    <div>
      <AppLayout>
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
    </div>
  );
};

export default Home;
