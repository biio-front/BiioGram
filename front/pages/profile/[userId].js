import React from 'react';
import { useSelector } from 'react-redux';
import { Grid, List } from 'semantic-ui-react';
import styled from 'styled-components';
import AppLayout from '../../components/layout/AppLayout';
import PostImg from '../../components/profile/PostImg';
import ListModal from '../../components/common/ListModal';
import ProfileHead from '../../components/profile/ProfileHead';
import { useRouter } from 'next/router';
import { END } from 'redux-saga';
import { getMyInfoRequest, getUserInfoRequest } from '../../redux/user/userSlice';
import axios from 'axios';
import wrapper from '../../store/configureStore';
import Head from 'next/head';
import { frontURL } from '../../config/config';

const Profile = () => {
  const router = useRouter();
  const { userId } = router.query;
  const { me, user } = useSelector((state) => state.user);

  return (
    <>
      <Head>
        <title>BiioGram | {user?.nickname}</title>
        <meta name="description" content={user?.desc} />
        <meta property="og:title" content={user?.nickname} />
        <meta property="og:description" content={user?.desc} />
        <meta property="og:image" content={user?.avatar || `${frontURL}/favicon.png`} />
        <meta property="og:url" content={`${frontURL}/profile/${userId}`} />
      </Head>
      <AppLayout>
        <s.profile>
          <ProfileHead
            avatar={me?.id === +userId ? me.avatar : user?.avatar}
            nickname={me?.id === +userId ? me.nickname : user?.nickname}
            edit={me?.id === +userId ? '수정하기' : null}
          >
            {/* 프로필 상단 오른쪽 */}
            <s.List horizontal>
              <List.Item>
                게시글 <span>{user?.Posts.length || 0}</span>
              </List.Item>
              <List.Item>
                <ListModal list={user?.Followers || []} title="팔로워" />
              </List.Item>
              <List.Item>
                <ListModal list={user?.Followings || []} title="팔로우" />
              </List.Item>
            </s.List>
            <p>{me?.id === +userId ? me.desc : user?.desc}</p>
          </ProfileHead>

          {/* 내가 쓴 게시글 보기 */}
          <s.article>
            <Grid columns={3}>
              <Grid.Row>
                {user?.Posts.map((v, i) => (
                  <Grid.Column key={i}>
                    <PostImg
                      src={v.Images[0].src}
                      commentLen={v.Comments.length}
                      likersLen={v.Likers.length}
                    />
                  </Grid.Column>
                ))}
              </Grid.Row>
            </Grid>
          </s.article>
        </s.profile>
      </AppLayout>
    </>
  );
};

const s = {};
s.profile = styled.div`
  max-width: 800px;
  margin: 0 auto;
`;
s.List = styled(List)`
  & .item {
    cursor: pointer;
  }
  & .item:first-child {
    cursor: auto;
  }
  & span {
    font-weight: bold;
  }
`;
s.article = styled.article`
  min-height: calc(100vh - 74px - 190px - 65px);
  margin-top: 20px;
`;

export const getServerSideProps = wrapper.getServerSideProps(async (context) => {
  const { userId } = context.params;
  context.store.dispatch(getUserInfoRequest(userId));
  const cookie = context.req?.headers.cookie;
  console.log(cookie);
  if (cookie) {
    axios.defaults.headers.Cookie = cookie;
    context.store.dispatch(getMyInfoRequest());
    axios.defaults.headers.Cookie = '';
  }
  context.store.dispatch(END);
  await context.store.sagaTask.toPromise();
});
export default Profile;
