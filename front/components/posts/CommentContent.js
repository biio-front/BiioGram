import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { List } from 'semantic-ui-react';
import styled from 'styled-components';
import { removeCommentRequest } from '../../redux/post/postSlice';
import PropTypes from 'prop-types';
import Link from 'next/link';
import Avatar from '../common/Avatar';
import relativeTime from 'dayjs/plugin/relativeTime';
import dayjs from 'dayjs';
import 'dayjs/locale/ko';

dayjs.extend(relativeTime);
dayjs.locale('ko');
const CommentContent = ({
  nickname,
  avatar,
  content,
  userId,
  commentId,
  postId,
  createdAt,
}) => {
  const { me } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const onRemove = useCallback(
    () => dispatch(removeCommentRequest({ postId, commentId })),
    [],
  );

  return (
    <>
      <List.Item>
        <Link href={`/profile/${userId}`}>
          <sc.a>
            <Avatar src={avatar} size="28" />
          </sc.a>
        </Link>
        <sc.Content>
          <List.Header>
            {nickname}
            <sc.date>{dayjs().to(dayjs(createdAt))}</sc.date>
          </List.Header>
          <p>{content}</p>
          {userId === me.id && <sc.remove name="delete" color="red" onClick={onRemove} />}
        </sc.Content>
      </List.Item>
    </>
  );
};

export const sc = {};
sc.a = styled.a`
  float: left;
  margin-right: 10px;
`;
sc.date = styled.span`
  font-size: 0.85rem;
  font-weight: lighter;
  margin-left: 10px;
  margin-bottom: 0;
  color: #aaa;
`;
sc.Content = styled(List.Content)`
  position: relative;
  & p {
    margin-bottom: 0;
  }
`;
sc.remove = styled(List.Icon)`
  cursor: pointer;
  position: absolute;
  top: 0;
  right: 0;
`;
CommentContent.propTypes = {
  nickname: PropTypes.string.isRequired,
  avatar: PropTypes.string,
  content: PropTypes.string.isRequired,
  userId: PropTypes.number,
  commentId: PropTypes.number,
  postId: PropTypes.number.isRequired,
  createdAt: PropTypes.string,
};
export default CommentContent;
