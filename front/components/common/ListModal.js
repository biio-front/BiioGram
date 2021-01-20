import React, { useMemo, useState } from 'react';
import { List, Modal } from 'semantic-ui-react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import UserList from './UserList';

const ListModal = ({ list, title }) => {
  const [oepnList, setOpenList] = useState(false);

  const style = useMemo(() => ({ width: '300px' }), []);
  return (
    <s.Modal
      style={style}
      onClose={() => setOpenList(false)}
      onOpen={() => setOpenList(true)}
      open={oepnList}
      trigger={
        <p>
          {title} <span>{list.length}</span>
        </p>
      }
    >
      <h3>{title}</h3>
      {list && (
        <List selection verticalAlign="middle">
          {list.map((v, i) => (
            <UserList key={i} nickname={v.nickname} userId={v.id} avatar={v.avatar} />
          ))}
        </List>
      )}
    </s.Modal>
  );
};

const s = {};
s.Modal = styled(Modal)`
  padding: 5px 0;
  max-height: 80vh;
  overflow-y: scroll;
  & h3 {
    margin-left: 10px;
    padding-top: 5px;
  }
`;

ListModal.propTypes = {
  list: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      nickname: PropTypes.string.isRequired,
      avatar: PropTypes.string,
    }),
  ).isRequired,
  title: PropTypes.string.isRequired,
};
export default ListModal;
