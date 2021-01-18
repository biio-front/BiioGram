import Router from 'next/router';
import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Form, Input } from 'semantic-ui-react';
import styled from 'styled-components';
import AppLayout from '../../components/layout/AppLayout';
import { editProfileRequest } from '../../redux/user/userSlice';
import { useInput } from '../../hooks/useInput';
import useUploadImages from '../../hooks/useUploadImages';
import ProfileHead from '../../components/profile/profileHead';

const EditProfile = () => {
  const { me, editProfileLoading } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const [images, onFileChange, imageInput, onImageUpload] = useUploadImages();
  const [nickname, onChangeNickname] = useInput(me.nickname);
  const [desc, onChangeDesc] = useInput(me.desc);

  const onSubmit = useCallback(() => {
    let src = null;
    if (images) src = images[0]?.src;
    const userId = me.id;
    dispatch(editProfileRequest({ src, nickname, desc, userId }));
    Router.push('/profile');
  }, [images, nickname, desc]);

  return (
    <AppLayout>
      <s.article>
        <ProfileHead avatar={images ? images[0]?.src : me.avatar} nickname={nickname}>
          <input
            type="file"
            accept="image/*"
            hidden
            ref={imageInput}
            onChange={onFileChange}
          />
          <div>
            <p>{me.email}</p>
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
              color="teal"
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
export default EditProfile;
