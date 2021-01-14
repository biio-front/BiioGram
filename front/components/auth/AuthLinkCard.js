import React, { useMemo } from 'react';
import { Card } from 'semantic-ui-react';
import PropTypes from 'prop-types';

const AuthLinkCard = ({ query, children }) => {
  const cardStyle = useMemo(() => ({ width: 348, padding: 15, textAlign: 'center' }), []);
  return (
    <Card style={cardStyle} centered>
      <span>{query}</span>
      {children}
    </Card>
  );
};

AuthLinkCard.propTypes = {
  query: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
};
export default AuthLinkCard;
