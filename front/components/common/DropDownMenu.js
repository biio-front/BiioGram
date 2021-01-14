import React, { useMemo } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

const DropDownMenu = ({ children, top }) => {
  const style = useMemo(() => ({ top }), []);
  return (
    <s.list style={style}>
      {/* List.Item이 하위항목으로 들어가야함 */}
      {children}
    </s.list>
  );
};

const s = {};
s.list = styled.ul`
  width: 150px;
  padding: 0;
  margin: 0;
  border: 1px solid #eee;
  background: white;
  border-radius: 8px;
  position: absolute;
  right: 0;
  z-index: 500;
  box-shadow: -7px 7px 10px #00000013;
  & .item {
    padding: 15px 15px;
    & i {
      margin-right: 10px;
    }
  }
  & .item:hover {
    cursor: pointer;
    background-color: #f5f5f5;
  }
`;
DropDownMenu.propTypes = {
  children: PropTypes.node.isRequired,
  top: PropTypes.string.isRequired,
};
export default DropDownMenu;
