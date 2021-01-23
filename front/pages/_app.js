import React, { useEffect } from 'react';
import wrapper from '../store/configureStore';
import PropTypes from 'prop-types';
import Head from 'next/head';
import '../style/global.css';
import { getAccessToken } from '../redux/user/userSlice';
import { useDispatch } from 'react-redux';

const BiioGram = ({ Component }) => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getAccessToken()); // 로그인 정보 가져오기
    return;
  }, []);
  return (
    <>
      <Head>
        <title>Biio Gram</title>
        <meta
          name="discription"
          content="sns 서비스 비오그램입니다. 사진업로드, 글쓰기, 좋아요, 덧글, 팔로우 기능이 있습니다."
        />
        <meta name="keywords" content="클론코딩, 인스타그램클론, sns, 좋아요, 팔로우" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <Component />
    </>
  );
};
BiioGram.propTypes = {
  Component: PropTypes.elementType.isRequired,
};
export default wrapper.withRedux(BiioGram);
