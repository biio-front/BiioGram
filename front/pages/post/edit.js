import React from 'react';
import { useSelector } from 'react-redux';
import PostForm from '../../components/posts/PostForm';

const EditPost = () => {
  const { singlePost } = useSelector((state) => state.post);
  return <PostForm post={singlePost} />;
};

export default EditPost;
