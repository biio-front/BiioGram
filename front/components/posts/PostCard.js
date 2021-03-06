import React, { useCallback, useState } from 'react';
import { Icon } from 'semantic-ui-react';
import styled from 'styled-components';
import Slider from './Slider';
import ListModal from '../common/ListModal';
import PostCardContent from './PostCardContent';
import Comment from './Comment';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { addLikersRequest, removeLikersRequest } from '../../redux/post/postSlice';
import PostCardHead from './PostCardHead';
import { onNeedLogin } from '../common/onNeedLogin';
import relativeTime from 'dayjs/plugin/relativeTime';
import dayjs from 'dayjs';
import 'dayjs/locale/ko';
import { StyleDate } from '../common/style';

dayjs.extend(relativeTime);
dayjs.locale('ko');

const PostCard = ({ user, content, Images, comments, postId, Likers, createdAt }) => {
  const dispatch = useDispatch();
  const { me } = useSelector((state) => state.user);

  const [toggleComment, setToggleComment] = useState(false);
  const [hearted, setHearted] = useState(Likers.find((v) => v.id === me?.id));

  const onToggleHeart = useCallback(() => {
    dispatch(hearted ? removeLikersRequest(postId) : addLikersRequest(postId));
    setHearted((prev) => !prev);
  }, [hearted]);

  return (
    <s.card>
      {/* 포스트 헤더 */}
      <PostCardHead
        userId={user.id}
        nickname={user.nickname}
        avatar={user.avatar}
        postId={postId}
      />

      {/* 포스트 이미지 */}
      <Slider Images={Images} />

      {/* 좋아요, 덧글 아이콘 및 좋아요 수 */}
      <s.btn>
        <Icon
          name={hearted ? 'heart' : 'heart outline'}
          size="large"
          color={hearted ? 'red' : 'black'}
          onClick={() => (me?.id ? onToggleHeart() : onNeedLogin())}
        />
        <Icon
          name="comment outline"
          size="large"
          onClick={() => setToggleComment((prev) => !prev)}
        />
        <s.like>
          <ListModal title="좋아요" list={Likers} />
        </s.like>
      </s.btn>

      {/* 포스트 내용 */}
      <PostCardContent nickname={user.nickname} content={content} />
      <StyleDate>{dayjs().to(dayjs(createdAt))}</StyleDate>

      {/* 덧글 */}
      <Comment
        postId={postId}
        comments={comments}
        toggleComment={toggleComment}
        onToggleComment={(bool) => setToggleComment(bool)}
      />
    </s.card>
  );
};

const s = {};
s.card = styled.article`
  max-width: 640px;
  border: 1px solid #eee;
  margin: 0 auto 20px;
  padding: 0 0 10px;
`;
s.btn = styled.div`
  margin: 10px;
  & i {
    margin-right: 10px;
    cursor: pointer;
  }
  & p {
    margin-top: 5px;
  }
`;
s.like = styled.div`
  width: 80px;
  cursor: pointer;
`;
PostCard.propTypes = {
  user: PropTypes.shape({
    id: PropTypes.number.isRequired,
    nickname: PropTypes.string.isRequired,
    avatar: PropTypes.string,
  }).isRequired,
  postId: PropTypes.number.isRequired,
  createdAt: PropTypes.string,
  content: PropTypes.string.isRequired,
  Images: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      src: PropTypes.string.isRequired,
    }),
  ).isRequired,
  Likers: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      nickname: PropTypes.string,
      avatar: PropTypes.string,
    }),
  ).isRequired,
  comments: PropTypes.arrayOf(
    PropTypes.shape({
      User: PropTypes.shape({
        nickname: PropTypes.string.isRequired,
        avatar: PropTypes.string,
      }).isRequired,
      content: PropTypes.string.isRequired,
    }),
  ).isRequired,
};
export default PostCard;
