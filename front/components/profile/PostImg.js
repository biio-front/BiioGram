import React, { useMemo } from 'react';
import { Icon } from 'semantic-ui-react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';

const PostImg = ({ src, commentLen, postId }) => {
  const { mainPosts } = useSelector((state) => state.post);
  const style = useMemo(
    () => ({
      background: `url(${src})`,
      backgroundPosition: 'center',
      backgroundSize: 'cover',
      backgroundRepeat: 'no-repeat',
    }),
    [],
  );
  return (
    <s.img style={style}>
      <s.container>
        <div>
          <div>
            <span>
              <Icon name="heart outline" />
              {mainPosts.find((v) => v.id === postId).Likers.length}
            </span>
            <span>
              <Icon name="comment outline" />
              {commentLen}
            </span>
          </div>
        </div>
      </s.container>
    </s.img>
  );
};

const s = {};
s.img = styled.div`
  -webkit-background-size: cover;
  -moz-background-size: cover;
  -o-background-size: cover;
  background-size: cover;
  width: 100%;
  height: calc(100vw / 3 - 32px);
  max-height: calc(800px / 3 - 32px);
  text-align: center;
  & :hover {
    & div {
      opacity: 1;
    }
  }
`;
s.container = styled.div`
  width: 100%;
  height: 100%;
  & > div {
    width: 100%;
    height: 100%;
    background-color: #00000033;
    opacity: 0;
    & > div {
      position: relative;
      top: 50%;
      transform: translate(0, -50%);
      color: #fff;
      opacity: 0;
      & span:first-child {
        margin-right: 5px;
      }
    }
  }
`;
PostImg.propTypes = {
  postId: PropTypes.number.isRequired,
  src: PropTypes.string.isRequired,
  commentLen: PropTypes.number.isRequired,
};
export default PostImg;
