import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PostForm from '../../components/posts/PostForm';
import { getImagePaths } from '../../redux/image/imageSlice';

const EditPost = () => {
  const { singlePost } = useSelector((state) => state.post);
  const dispatch = useDispatch();
  useEffect(() => dispatch(getImagePaths(singlePost.Images)), []);
  return <PostForm post={singlePost} />;
};

export default EditPost;
