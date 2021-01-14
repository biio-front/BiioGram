import React, { useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';
import { Header, Icon, Image } from 'semantic-ui-react';
import 'semantic-ui-css/semantic.min.css';
import styled from 'styled-components';
import NavMenu from './NavMenu';

const AppLayout = ({ children }) => {
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
            <Link href="/post/create">
              <a>
                <Icon name="plus" size="large" />
              </a>
            </Link>
            <Image
              src="https://react.semantic-ui.com/images/wireframe/square-image.png"
              avatar
              floated="right"
              onClick={onClick}
            />
          </div>
        </nav>
        {oepnMenu && <NavMenu />}
      </s.header>
      <section>{children}</section>
      <footer>&copy; 2020 biio All rights reserved</footer>
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
      }
    }
  }
`;

AppLayout.propTypes = {
  children: PropTypes.node.isRequired,
};
export default AppLayout;
