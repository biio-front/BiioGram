import Link from 'next/link';
import Router from 'next/router';
import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Icon, List, Loader } from 'semantic-ui-react';
import { logoutRequest } from '../../redux/user/userSlice';
import DropDownMenu from '../common/DropDownMenu';

const NavMenu = () => {
  const {
    logoutLoading,
    me: { id },
  } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const onLogout = useCallback(() => {
    dispatch(logoutRequest());
    Router.push('/');
  }, []);

  return (
    <DropDownMenu top="64px">
      <List.Item>
        <Link href={`/profile/${id}`}>
          <a>
            <Icon name="user circle" /> 프로필
          </a>
        </Link>
      </List.Item>
      <List.Item>
        <Link href="/profile/edit">
          <a>
            <Icon name="setting" /> 프로필 설정
          </a>
        </Link>
      </List.Item>
      <List.Item onClick={onLogout}>
        {logoutLoading ? <Loader active inline="centered" /> : '로그아웃'}
      </List.Item>
    </DropDownMenu>
  );
};

export default NavMenu;
