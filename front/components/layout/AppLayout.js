import React, { useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';
import { Header, Icon } from 'semantic-ui-react';
import 'semantic-ui-css/semantic.min.css';
import styled from 'styled-components';
import NavMenu from './NavMenu';
import Avatar from '../common/Avatar';
import { useDispatch, useSelector } from 'react-redux';
import { logoutSuccess } from '../../redux/user/userSlice';

const AppLayout = ({ children }) => {
  const { avatar, id } = useSelector((state) => state.user.me);
  const [oepnMenu, setOpenMenu] = useState(false);
  const dispatch = useDispatch();

  const onClick = useCallback(() => {
    setOpenMenu((prev) => !prev);
  }, []);

  const onNeedLogin = useCallback(() => {
    window.alert('로그인이 필요한 서비스입니다. 로그인화면으로 이동합니다.');
    dispatch(logoutSuccess());
  }, []);
  return (
    <>
      <s.header>
        <nav>
          <Header as="h1" floated="left">
            <Link href="/">
              <a>BiioGram</a>
            </Link>
          </Header>
          <div className="menu" onClick={!id ? onNeedLogin : undefined}>
            <Link href="/post/create">
              <a>
                <Icon name="plus" size="large" />
              </a>
            </Link>
            <span onClick={onClick}>
              <Avatar src={avatar} size="45" />
            </span>
          </div>
        </nav>
        {oepnMenu && <NavMenu />}
      </s.header>
      <section>{children}</section>
      <footer>&copy; 2021 biio All rights reserved</footer>
    </>
  );
};

const s = {};
s.header = styled.header`
  padding: 20px;
  background-color: #fff;
  & > nav {
    width: 100%;
    height: 34px;
    & .menu {
      float: right;
      padding-top: 5px;
      & i {
        padding-top: 2px;
      }
      & img {
        cursor: pointer;
        float: right;
        transform: translate(0, -10px);
        margin-left: 15px;
      }
    }
  }
`;

AppLayout.propTypes = {
  children: PropTypes.node.isRequired,
};
export default AppLayout;
