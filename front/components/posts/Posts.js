import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import AppLayout from '../layout/AppLayout';
import PostCard from './PostCard';
import PropTypes from 'prop-types';

const Posts = ({ whatPosts, query }) => {
  const { mainPosts, hasMorePosts, loadPostsLoading } = useSelector(
    (state) => state.post,
  );
  const dispatch = useDispatch();
  useEffect(() => dispatch(whatPosts(query)), []);

  useEffect(() => {
    function onScroll() {
      const { pageYOffset } = window;
      const { clientHeight, scrollHeight } = document.documentElement;
      if (pageYOffset + clientHeight > scrollHeight - 300) {
        if (hasMorePosts && !loadPostsLoading) {
          const lastId = mainPosts[mainPosts.length - 1]?.id;
          dispatch(whatPosts(lastId));
        }
      }
    }
    window.addEventListener('scroll', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
    };
  }, [hasMorePosts, loadPostsLoading, mainPosts]);

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
