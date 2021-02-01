import Router from 'next/router';
import Link from 'next/link';
import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Form, Input } from 'semantic-ui-react';
import styled from 'styled-components';
import AuthCard from '../components/auth/AuthCard';
import AuthLinkCard from '../components/auth/AuthLinkCard';
import { getMyInfoRequest, resetSignUp, signUpRequest } from '../redux/user/userSlice';
import { useInput } from '../hooks/useInput';
import wrapper from '../store/configureStore';
import axios from 'axios';
import { END } from 'redux-saga';

const SignUp = () => {
  const { me, signUpLoading, signUpError, signUpDone } = useSelector(
    (state) => state.user,
  );
  const dispatch = useDispatch();

  const [email, onChangeEmail] = useInput('');
  const [nickname, onChangeNickname] = useInput('');
  const [password, onChangePassword] = useInput('');
  const [passwordCheck, onChangePasswordCheck] = useInput('');
  const [passwordError, setPasswordError] = useState(false);
  const [term, setTerm] = useState(false);
  const [termError, setTermError] = useState(false);

  useEffect(() => {
    me && Router.replace('/');
  }, [me]);

  useEffect(() => {
    if (signUpDone) {
      Router.replace('/');
    } else {
      dispatch(resetSignUp());
    }
  }, [signUpDone]);

  const onChangeTerm = useCallback((e) => {
    setTerm(e.target.checked);
    setTermError(false);
  }, []);

  const onSubmit = useCallback(() => {
    if (password !== passwordCheck) {
      return setPasswordError(true);
    } else {
      setPasswordError(false);
    }
    if (!term) {
      return setTermError(true);
    } else {
      setTermError(false);
    }
    dispatch(signUpRequest({ email, nickname, password }));
  }, [email, password, passwordCheck, term]);

  return (
    <>
      <AuthCard content="가입하기">
        <h4>이메일로 가입하기</h4>
        <Form onSubmit={onSubmit}>
          <Input type="email" placeholder={'이메일'} onChange={onChangeEmail} autoFocus />
          {signUpError && <s.Error>이미 사용중인 이메일입니다.</s.Error>}
          <Input
            type="text"
            placeholder={'사용자이름'}
            onChange={onChangeNickname}
            size="small"
          />
          <Input
            type="password"
            placeholder={'비밀번호'}
            onChange={onChangePassword}
            error={passwordError}
            size="small"
          />
          <Input
            type="password"
            placeholder={'비밀번호 확인'}
            onChange={onChangePasswordCheck}
            error={passwordError}
            size="small"
          />
          {passwordError && <s.Error>비밀번호가 일치하지 않습니다.</s.Error>}
          <s.agree>
            <input type="checkbox" onChange={onChangeTerm} /> <a>약관</a>에 동의하십니까?
            {termError && <s.Error>약관에 동의하지 않으셨습니다.</s.Error>}
          </s.agree>
          <div>
            <s.Button
              size="small"
              type="submit"
              content="가입하기"
              color="teal"
              loading={signUpLoading}
            />
          </div>
        </Form>
      </AuthCard>
      <AuthLinkCard question="계정이 있으신가요?">
        <Link href="/">로그인하기</Link>
      </AuthLinkCard>
    </>
  );
};

const s = {};
s.Error = styled.span`
  color: red;
`;
s.agree = styled.div`
  text-align: left;
  font-size: 0.9rem;
  & input {
    margin: 3px 3px 0 5px;
  }
`;
s.Button = styled(Button)`
  width: 100%;
`;

export const getServerSideProps = wrapper.getServerSideProps(async (context) => {
  axios.defaults.headers.Cookie = '';
  const cookie = context.req?.headers.cookie;
  if (cookie) {
    axios.defaults.headers.Cookie = cookie;
    context.store.dispatch(getMyInfoRequest());
  }
  context.store.dispatch(END);
  await context.store.sagaTask.toPromise();
});
export default SignUp;
