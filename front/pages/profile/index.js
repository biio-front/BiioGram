import React from 'react';
import { useSelector } from 'react-redux';
import { Grid, List } from 'semantic-ui-react';
import styled from 'styled-components';
import AppLayout from '../../components/layout/AppLayout';
import PostImg from '../../components/profile/PostImg';
import ListModal from '../../components/common/ListModal';
import ProfileHead from '../../components/profile/profileHead';

const Profile = () => {
  const { nickname, Posts, Followers, Followings, desc, avatar } = useSelector(
    (state) => state.user.currentUser,
  );

  return (
    <>
      <AppLayout>
        <s.profile>
          <ProfileHead avatar={avatar} nickname={nickname} edit="수정하기">
            {/* 프로필 상단 오른쪽 */}
            <s.List horizontal>
              <List.Item>
                게시글 <span>{Posts.length}</span>
              </List.Item>
              <List.Item>
                <ListModal list={Followers} title="팔로워" />
              </List.Item>
              <List.Item>
                <ListModal list={Followings} title="팔로우" />
              </List.Item>
            </s.List>
            <p>{desc}</p>
          </ProfileHead>

          {/* 내가 쓴 게시글 보기 */}
          <s.article>
            <Grid columns={3}>
              <Grid.Row>
                {Posts.map((v, i) => (
                  <Grid.Column key={i}>
                    <PostImg
                      src={v.Images[0].src}
                      commentLen={v.Comments.length}
                      postId={v.id}
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
export default Profile;
