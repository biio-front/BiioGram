import Link from 'next/link';
import Router from 'next/router';
import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Icon, List, Loader } from 'semantic-ui-react';
import { logoutRequest, logoutSuccess } from '../../redux/user/userSlice';
import DropDownMenu from '../common/DropDownMenu';

const NavMenu = () => {
  const {
    logoutLoading,
    me: { id },
  } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const onLogout = useCallback(() => {
    if (id) {
      dispatch(logoutRequest());
    } else {
      dispatch(logoutSuccess());
    }
    Router.push('/');
  }, []);

  const onNeedLogin = useCallback(() => {
    window.alert('로그인이 필요한 서비스입니다. 로그인화면으로 이동합니다.');
    dispatch(logoutSuccess());
  }, []);

  return (
    <DropDownMenu top="64px">
      <List.Item onClick={!id ? onNeedLogin : undefined}>
        <Link href={id ? `/profile/${id}` : '/auth'}>
          <a>
            <Icon name="user circle" /> 프로필
          </a>
        </Link>
      </List.Item>
      <List.Item onClick={!id ? onNeedLogin : undefined}>
        <Link href={id ? '/profile/edit' : '/auth'}>
          <a>
            <Icon name="setting" /> 프로필 설정
          </a>
        </Link>
      </List.Item>
      <List.Item onClick={onLogout}>
        {logoutLoading ? (
          <Loader active inline="centered" />
        ) : id ? (
          '로그아웃'
        ) : (
          '로그인하기'
        )}
      </List.Item>
    </DropDownMenu>
  );
};

export default NavMenu;
