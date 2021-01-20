import React, { useMemo } from 'react';
import { Card } from 'semantic-ui-react';
import PropTypes from 'prop-types';

const AuthLinkCard = ({ question, children }) => {
  const cardStyle = useMemo(() => ({ width: 348, padding: 15, textAlign: 'center' }), []);
  return (
    <Card style={cardStyle} centered>
      <span>{question}</span>
      {children}
    </Card>
  );
};

AuthLinkCard.propTypes = {
  question: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
};
export default AuthLinkCard;
