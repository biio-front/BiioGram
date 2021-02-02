import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { StyleAuthCard } from '../common/style';

const AuthCard = ({ children }) => {
  return (
    <s.div>
      <StyleAuthCard>
        <h1>BiioGram</h1>
        {children}
      </StyleAuthCard>
    </s.div>
  );
};

const s = {};
s.div = styled.div`
  margin-top: 45px;
`;
AuthCard.propTypes = {
  children: PropTypes.node.isRequired,
};
export default AuthCard;
