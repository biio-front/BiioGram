import Router from 'next/router';
import React, { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Form, Input } from 'semantic-ui-react';
import styled from 'styled-components';
import AppLayout from '../../components/layout/AppLayout';
import { editProfileRequest, getMyInfoRequest } from '../../redux/user/userSlice';
import { useInput } from '../../hooks/useInput';
import useUploadImages from '../../hooks/useUploadImages';
import ProfileHead from '../../components/profile/ProfileHead';
import { getImagePaths } from '../../redux/image/imageSlice';
import wrapper from '../../store/configureStore';
import axios from 'axios';
import { END } from 'redux-saga';

const EditProfile = () => {
  const { me, editProfileLoading } = useSelector((state) => state.user);
  const { imagePaths } = useSelector((state) => state.image);
  const dispatch = useDispatch();

  const [onFileChange, imageInput, onImageUpload] = useUploadImages('avatar');
  const [nickname, onChangeNickname] = useInput(me?.nickname);
  const [desc, onChangeDesc] = useInput(me?.desc || '');

  useEffect(() => !me && Router.replace('/'));
  useEffect(() => me?.avatar && dispatch(getImagePaths([{ src: me.avatar }])), []);

  const onSubmit = useCallback(() => {
    const userId = me.id;
    dispatch(
      editProfileRequest({
        src: (imagePaths && imagePaths[0].src) || me?.avatar,
        nickname,
        desc,
        userId,
      }),
    );
    Router.replace(`/profile/${me.id}`);
  }, [imagePaths, nickname, desc]);

  return (
    <AppLayout>
      <s.article>
        <ProfileHead
          avatar={imagePaths ? imagePaths[0]?.src : me?.avatar}
          nickname={nickname}
        >
          <input
            type="file"
            accept="image/*"
            hidden
            ref={imageInput}
            onChange={onFileChange}
          />
          <div>
            <p>{me?.email}</p>
            <s.changeAvatar onClick={onImageUpload}>프로필 사진 바꾸기</s.changeAvatar>
          </div>
        </ProfileHead>
        <s.Form onSubmit={onSubmit}>
          <div>
            <label htmlFor="nickname">닉네임</label>
            <Input
              id="nickname"
              type="text"
              value={nickname}
              onChange={onChangeNickname}
              size="small"
            />
          </div>
          <div>
            <label htmlFor="user-desc">소개</label>
            <Input
              id="user-desc"
              type="text"
              value={desc}
              onChange={onChangeDesc}
              size="small"
            />
          </div>
          <div>
            <s.Button
              type="submit"
              content="수정사항 저장하기"
              color="pink"
              loading={editProfileLoading}
            />
          </div>
        </s.Form>
      </s.article>
    </AppLayout>
  );
};

const s = {};
s.article = styled.article`
  padding: 10px;
  max-width: 640px;
  margin: 0 auto;
`;
s.changeAvatar = styled.a`
  cursor: pointer;
`;
s.Form = styled(Form)`
  margin-top: 20px;
  padding: 0 60px;
  & > div {
    margin-bottom: 10px;
    & label {
      font-weight: bold;
    }
  }
`;
s.Button = styled(Button)`
  width: 100%;
`;

export const getServerSideProps = wrapper.getServerSideProps(async (context) => {
  axios.defaults.headers.Cookie = '';
  const cookie = context.req?.headers.cookie;
  if (cookie) {
    axios.defaults.headers.Cookie = cookie;
    context.store.dispatch(getMyInfoRequest());
  }
  context.store.dispatch(END);
  await context.store.sagaTask.toPromise();
});
export default EditProfile;
