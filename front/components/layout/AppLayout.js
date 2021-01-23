import React, { useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';
import { Header, Icon } from 'semantic-ui-react';
import 'semantic-ui-css/semantic.min.css';
import styled from 'styled-components';
import NavMenu from './NavMenu';
import Avatar from '../common/Avatar';
import { useSelector } from 'react-redux';
import { onNeedLogin } from '../common/onNeedLogin';

const AppLayout = ({ children }) => {
  const { me } = useSelector((state) => state.user);
  const [oepnMenu, setOpenMenu] = useState(false);

  const onClick = useCallback(() => {
    setOpenMenu((prev) => !prev);
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
          <div className="menu">
            <Link href={me?.id ? '/post/create' : '/auth'}>
              <a>
                <Icon
                  name="plus"
                  size="large"
                  onClick={!me?.id ? onNeedLogin : undefined}
                />
              </a>
            </Link>
            <span onClick={onClick}>
              <Avatar src={me?.avatar} size="45" />
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
