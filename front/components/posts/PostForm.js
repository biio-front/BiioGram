import React, { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Form, Icon, TextArea } from 'semantic-ui-react';
import styled from 'styled-components';
import AppLayout from '../layout/AppLayout';
import {
  addPostRequest,
  resetPostForm,
  updatePostRequest,
} from '../../redux/post/postSlice';
import { useInput } from '../../hooks/useInput';
import useUploadImages from '../../hooks/useUploadImages';
import PropTypes from 'prop-types';
import Slider from './Slider';
import Router from 'next/router';

const PostForm = ({ post }) => {
  const { addPostLoading, addPostDone } = useSelector((state) => state.post);
  const { me } = useSelector((state) => state.user);
  const { imagePaths } = useSelector((state) => state.image);
  const dispatch = useDispatch();

  const [onFileChange, imageInput, onImageUpload] = useUploadImages('post');
  const [text, onChangeText, setText] = useInput(post?.content);

  useEffect(() => !me && Router.replace('/'));

  useEffect(() => {
    if (addPostDone) {
      Router.replace('/');
      setText('');
    }
    dispatch(resetPostForm());
  }, [addPostDone]);

  const onSubmit = useCallback(() => {
    if (!imagePaths) return window.alert('사진을 추가해주세요.');
    if (!text) return window.alert('내용을 작성해주세요');
    post
      ? dispatch(
          updatePostRequest({ content: text, images: imagePaths, postId: post.id }),
        )
      : dispatch(addPostRequest({ content: text, images: imagePaths }));
  }, [text, imagePaths]);
  return (
    <>
      <AppLayout>
        <s.div>
          <Form onSubmit={onSubmit}>
            <input
              type="file"
              accept="image/*"
              multiple
              hidden
              ref={imageInput}
              onChange={onFileChange}
              key={imagePaths}
            />
            <s.imageUpload>
              {imagePaths ? (
                <>
                  <p className="changeImg" onClick={onImageUpload}>
                    사진 바꾸기
                  </p>
                  <Slider Images={imagePaths} />
                </>
              ) : (
                <div className="addImg" onClick={onImageUpload}>
                  <Icon name="plus" size="huge" />
                  <p>사진을 추가하세요.</p>
                </div>
              )}
            </s.imageUpload>
            <TextArea
              rows="5"
              value={text}
              placeholder="포스트 작성"
              onChange={onChangeText}
            />
            <s.Button
              color="pink"
              type="submit"
              content="작성하기"
              loading={addPostLoading}
            />
          </Form>
        </s.div>
      </AppLayout>
    </>
  );
};

const s = {};
s.div = styled.div`
  max-width: 640px;
  margin: 0 auto;
`;
s.imageUpload = styled.div`
  width: 100%;
  border: 1px solid #eee;
  margin: 0 auto;
  text-align: center;
  & p.changeImg {
    cursor: pointer;
    text-align: right;
    padding-right: 5px;
    font-size: 0.95rem;
  }
  & img {
    width: 100%;
  }
  & div.addImg {
    color: #999;
    padding: 40px;
    cursor: pointer;
  }
`;
s.Button = styled(Button)`
  width: 100%;
`;

PostForm.propTypes = {
  post: PropTypes.shape({
    id: PropTypes.number.isRequired,
    User: PropTypes.shape({
      id: PropTypes.number.isRequired,
      nickname: PropTypes.string.isRequired,
      avatar: PropTypes.string,
    }).isRequired,
    Images: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.number.isRequired,
        src: PropTypes.string.isRequired,
      }),
    ).isRequired,
    content: PropTypes.string.isRequired,
  }),
};
export default PostForm;
