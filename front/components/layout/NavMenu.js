import Link from 'next/link';
import Router from 'next/router';
import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Icon, List, Loader } from 'semantic-ui-react';
import { logoutRequest, logoutSuccess } from '../../redux/user/userSlice';
import DropDownMenu from '../common/DropDownMenu';
import { onNeedLogin } from '../common/onNeedLogin';

const NavMenu = () => {
  const { logoutLoading, me } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const onLogout = useCallback(() => {
    if (me?.id) {
      dispatch(logoutRequest());
    } else {
      dispatch(logoutSuccess());
    }
    Router.push('/');
  }, []);

  return (
    <DropDownMenu top="64px">
      <Link href={me?.id ? `/profile/${me.id}` : '/'}>
        <a>
          <List.Item onClick={!me?.id ? onNeedLogin : undefined}>
            <Icon name="user circle" /> 프로필
          </List.Item>
        </a>
      </Link>
      <Link href={me?.id ? '/profile/edit' : '/'}>
        <a>
          <List.Item onClick={!me?.id ? onNeedLogin : undefined}>
            <Icon name="setting" /> 프로필 설정
          </List.Item>
        </a>
      </Link>
      <List.Item onClick={onLogout}>
        {logoutLoading ? (
          <Loader active inline="centered" />
        ) : me?.id ? (
          '로그아웃'
        ) : (
          '로그인하기'
        )}
      </List.Item>
    </DropDownMenu>
  );
};

export default NavMenu;
