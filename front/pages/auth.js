import Link from 'next/link';
import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Form, Input } from 'semantic-ui-react';
import AuthCard from '../components/auth/AuthCard';
import AuthLinkCard from '../components/auth/AuthLinkCard';
import { loginRequest } from '../redux/user/userSlice';
import { useInput } from '../hooks/useInput';
import styled from 'styled-components';

const Auth = () => {
  const { loginLoading, loginError } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [email, onChangeEmail] = useInput('');
  const [password, onChangePassword] = useInput('');
  const onSubmit = useCallback(() => {
    dispatch(loginRequest({ email, password }));
  }, [email, password]);

  return (
    <>
      <AuthCard content="로그인">
        <Form onSubmit={onSubmit}>
          <Input
            icon="user"
            iconPosition="left"
            type="email"
            placeholder="email@gmail.com"
            onChange={onChangeEmail}
            autoFocus
            size="small"
          />
          <Input
            icon="lock"
            iconPosition="left"
            type="password"
            placeholder="비밀번호"
            onChange={onChangePassword}
            size="small"
          />
          <div>
            <s.Button size="small" content="로그인" color="teal" loading={loginLoading} />
          </div>
        </Form>
        {loginError && '이메일이나 비밀번호를 확인해주세요.'}
      </AuthCard>
      <AuthLinkCard query="계정이 없으신가요?">
        <Link href="/signUp">가입하기</Link>
      </AuthLinkCard>
    </>
  );
};

const s = {};
s.Button = styled(Button)`
  width: 100%;
`;
export default Auth;
