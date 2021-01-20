import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import AppLayout from '../layout/AppLayout';
import PostCard from './PostCard';
import PropTypes from 'prop-types';

const Posts = ({ whatPosts, query }) => {
  const { mainPosts } = useSelector((state) => state.post);
  const dispatch = useDispatch();
  useEffect(() => dispatch(whatPosts(query)), []);

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

Posts.propTypes = {
  whatPosts: PropTypes.func.isRequired,
  query: PropTypes.string,
};
export default Posts;
