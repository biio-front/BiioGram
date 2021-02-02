import React from 'react';
import PropTypes from 'prop-types';
import { StyleAuthCard } from '../common/style';

const AuthLinkCard = ({ question, children }) => {
  return (
    <StyleAuthCard>
      <span>{question}</span>
      {children}
    </StyleAuthCard>
  );
};

AuthLinkCard.propTypes = {
  question: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
};
export default AuthLinkCard;
