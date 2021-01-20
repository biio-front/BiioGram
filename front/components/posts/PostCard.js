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

const PostCard = ({ user, content, Images, comments, postId, Likers }) => {
  const dispatch = useDispatch();
  const { id: myId } = useSelector((state) => state.user.me);

  const [toggleComment, setToggleComment] = useState(false);
  const [hearted, setHearted] = useState(Likers.find((v) => v.id === myId));

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
          onClick={onToggleHeart}
        />
        <Icon
          name="comment outline"
          size="large"
          onClick={() => setToggleComment((prev) => !prev)}
        />
        <ListModal title="좋아요" list={Likers} />
      </s.btn>

      {/* 포스트 내용 */}
      <PostCardContent nickname={user.nickname} content={content} />

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
PostCard.propTypes = {
  user: PropTypes.shape({
    id: PropTypes.number.isRequired,
    nickname: PropTypes.string.isRequired,
    avatar: PropTypes.string,
  }).isRequired,
  postId: PropTypes.number.isRequired,
  Images: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      src: PropTypes.string.isRequired,
    }),
  ).isRequired,
  content: PropTypes.string.isRequired,
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
