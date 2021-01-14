import React, { useCallback, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { Button, Confirm, List } from 'semantic-ui-react';
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import { addFollowRequest, removeFollowRequest } from '../../redux/user/userSlice';

const UserList = ({ nickname, userId }) => {
  const {
    currentUser: { Followings },
  } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const [oepnConfirm, setOpenConfirm] = useState(false);
  const onConfirm = useCallback(() => setOpenConfirm(true), []);
  const onFollow = useCallback(
    () => dispatch(addFollowRequest({ userId, nickname })),
    [],
  );
  const onUnfollow = useCallback(() => dispatch(removeFollowRequest(userId)), []);
  const style = useMemo(() => ({ padding: '4px 8px' }));
  return (
    <>
      <List.Item>
        <List.Content verticalAlign="middle">
          <s.ListHeader>{nickname}</s.ListHeader>
          {Followings.find((v) => v.id === userId) ? (
            <Button
              color="teal"
              floated="right"
              size="tiny"
              style={style}
              onClick={onConfirm}
            >
              팔로잉
            </Button>
          ) : (
            <Button
              basic
              color="teal"
              floated="right"
              size="tiny"
              style={style}
              onClick={onFollow}
            >
              팔로우하기
            </Button>
          )}
          <Confirm
            open={oepnConfirm}
            content="팔로우를 취소 하시겠습니까?"
            onCancel={() => setOpenConfirm(false)}
            onConfirm={() => {
              onUnfollow();
              setOpenConfirm(false);
            }}
          />
        </List.Content>
      </List.Item>
    </>
  );
};

const s = {};
s.ListHeader = styled(List.Header)`
  float: left;
`;
UserList.propTypes = {
  nickname: PropTypes.string.isRequired,
  userId: PropTypes.number.isRequired,
};
export default UserList;
