import React from 'react';
import wrapper from '../store/configureStore';
import PropTypes from 'prop-types';
import Head from 'next/head';
import '../style/global.css';

const BiioGram = ({ Component }) => {
  return (
    <>
      <Head>
        <title>BiioGram</title>
        <meta
          name="description"
          content="sns 서비스 비오그램입니다. 사진업로드, 글쓰기, 좋아요, 덧글, 팔로우 기능이 있습니다."
        />
        <meta
          name="keywords"
          content="클론코딩, 인스타그램클론, sns, 좋아요, 팔로우, 사진업로드"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="shortcut icon" type="image/x-icon" href="/favicon.png" />
      </Head>
      <Component />
    </>
  );
};
BiioGram.propTypes = {
  Component: PropTypes.elementType.isRequired,
};
export default wrapper.withRedux(BiioGram);
