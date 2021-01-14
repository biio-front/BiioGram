import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

const Avatar = ({ src, size }) => {
  return (
    <s.Avatar
      src={src ? src : 'https://react.semantic-ui.com/images/wireframe/square-image.png'}
      alt={src ? src : '프로필사진 없음'}
      width={size}
      height={size}
    />
  );
};

const s = {};
s.Avatar = styled.img`
  border-radius: 50%;
  background-position: center;
  background-size: cover;
  background-repeat: no-repeat;
`;
Avatar.propTypes = {
  src: PropTypes.string.isRequired,
  size: PropTypes.string.isRequired,
};
export default Avatar;
