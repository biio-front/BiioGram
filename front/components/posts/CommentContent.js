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
import { StyleDate } from '../common/style';

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
          <s.a>
            <Avatar src={avatar} size="28" />
          </s.a>
        </Link>
        <s.Content>
          <List.Header>
            {nickname}
            <StyleDate>{dayjs().to(dayjs(createdAt))}</StyleDate>
          </List.Header>
          <p>{content}</p>
          {userId === me.id && <s.remove name="delete" color="red" onClick={onRemove} />}
        </s.Content>
      </List.Item>
    </>
  );
};

const s = {};
s.a = styled.a`
  float: left;
  margin-right: 10px;
`;
s.Content = styled(List.Content)`
  position: relative;
  & p {
    margin-bottom: 0;
  }
`;
s.remove = styled(List.Icon)`
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
