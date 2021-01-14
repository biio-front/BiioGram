import React from 'react';
import { useSelector } from 'react-redux';
import AppLayout from '../layout/AppLayout';
import PostCard from './PostCard';

const Home = () => {
  const { mainPosts } = useSelector((state) => state.post);

  return (
    <>
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
    </>
  );
};

export default Home;
