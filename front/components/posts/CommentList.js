import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Image, List } from 'semantic-ui-react';
import styled from 'styled-components';
import { removeCommentRequest } from '../../redux/post/postSlice';
import PropTypes from 'prop-types';

const CommentList = ({ nickname, content, userId, commentId, postId }) => {
  const { me } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const onRemove = useCallback(
    () => dispatch(removeCommentRequest({ postId, commentId })),
    [],
  );
  const getTime = () => {
    const getToday = new Date();
    const year = getToday.getFullYear();
    const month = getToday.getMonth();
    const date = getToday.getDate();
    return `${year}년 ${month + 1}월 ${date}일`;
  };

  return (
    <>
      <List.Item>
        <Image
          src="https://react.semantic-ui.com/images/wireframe/square-image.png"
          avatar
        />
        <List.Content>
          <List.Header>
            {nickname}
            <s.date>{getTime()}</s.date>
          </List.Header>
          <p>{content}</p>
        </List.Content>
        {userId === me.id && (
          <s.remove floated="right" onClick={onRemove}>
            <List.Icon name="delete" color="red" />
          </s.remove>
        )}
      </List.Item>
    </>
  );
};

const s = {};
s.date = styled.span`
  font-size: 0.95rem;
  font-weight: lighter;
  margin-left: 5px;
  margin-bottom: 0;
  color: #aaa;
`;
s.remove = styled(List.Content)`
  cursor: pointer;
`;
CommentList.propTypes = {
  nickname: PropTypes.string.isRequired,
  content: PropTypes.string.isRequired,
  userId: PropTypes.number.isRequired,
  commentId: PropTypes.number.isRequired,
  postId: PropTypes.number.isRequired,
};
export default CommentList;
