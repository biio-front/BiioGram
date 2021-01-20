import { useRouter } from 'next/router';
import React from 'react';
import Posts from '../../components/posts/Posts';
import { loadHashtagPostsRequest } from '../../redux/post/postSlice';

const hashtag = () => {
  const router = useRouter();
  const { tag } = router.query;
  return <Posts whatPosts={loadHashtagPostsRequest} query={tag} />;
};

export default hashtag;
