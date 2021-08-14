import {
  Channels,
  Chats,
  Header,
  MenuScroll,
  ProfileImg,
  RightMenu,
  WorkspaceName,
  Workspaces,
  WorkspaceWrapper,
} from '@layouts/Workspace/styles';
import fetcher from '@utils/fetcher';
import axios from 'axios';
import React, { FC, useCallback } from 'react';
import { Redirect, Route, Switch } from 'react-router';
import useSWR from 'swr';
import gravatar from 'gravatar';
import Channel from '@pages/Channel';
import DirectMessage from '@pages/DirectMessage';

//children을 쓰려면 FC로 반환 타입 지정해주기
const Workspace = () => {
  const { data: userData, error, revalidate, mutate } = useSWR('/api/users', fetcher);

  const onLogOut = useCallback(() => {
    axios
      .post('/api/users/logout', null, {
        withCredentials: true, // 쿠기 공유할 때 설정
      })
      .then(() => {
        // revalidate();
        mutate(false);
      });
  }, []);

  if (!userData) {
    return <Redirect to="/login" />;
  }

  return (
    <div>
      <Header>Test</Header>
      <RightMenu>
        <span>
          <ProfileImg src={gravatar.url(userData.email, { s: '28px', d: 'retro' })} alt={userData.email} />
        </span>
      </RightMenu>
      <button onClick={onLogOut}>로그아웃</button>
      <WorkspaceWrapper>
        <Workspaces>test</Workspaces>
        <Channels>
          <WorkspaceName>Sleact</WorkspaceName>
          <MenuScroll>MenuScroll</MenuScroll>
        </Channels>
        <Chats>
          <Switch>
            <Route path="/workspace/channel" component={Channel} />
            <Route path="/workspace/dm" component={DirectMessage} />
          </Switch>
        </Chats>
      </WorkspaceWrapper>
    </div>
  );
};

export default Workspace;
