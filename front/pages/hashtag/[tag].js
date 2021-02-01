import axios from 'axios';
import Head from 'next/head';
import { useRouter } from 'next/router';
import React from 'react';
import { END } from 'redux-saga';
import Posts from '../../components/posts';
import { frontURL } from '../../config/config';
import { loadHashtagPostsRequest } from '../../redux/post/postSlice';
import { getMyInfoRequest } from '../../redux/user/userSlice';
import wrapper from '../../store/configureStore';

const hashtag = () => {
  const router = useRouter();
  const { tag } = router.query;
  return (
    <>
      <Head>
        <title>BiioGram | {tag}</title>
        <meta name="description" content={tag} />
        <meta property="og:title" content={tag} />
        <meta property="og:description" content={tag} />
        <meta property="og:image" content={`${frontURL}/favicon.png`} />
        <meta property="og:url" content={`${frontURL}/hashtag/${tag}`} />
      </Head>
      <Posts whatPosts={loadHashtagPostsRequest} query={tag} />
    </>
  );
};

export const getServerSideProps = wrapper.getServerSideProps(async (context) => {
  console.log('getServerSideProps start');
  const { tag } = context.params;
  axios.defaults.headers.Cookie = '';
  const cookie = context.req?.headers.cookie;
  if (cookie) {
    axios.defaults.headers.Cookie = cookie;
    context.store.dispatch(getMyInfoRequest());
  }
  context.store.dispatch(
    loadHashtagPostsRequest({ query: encodeURIComponent(tag), lastId: 0 }), // 처음 목록 불러오기
  );
  context.store.dispatch(END);
  await context.store.sagaTask.toPromise();
});
export default hashtag;
