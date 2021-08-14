import fetcher from '@utils/fetcher';
import axios from 'axios';
import React, { FC, useCallback } from 'react';
import { Redirect } from 'react-router';
import useSWR from 'swr';

//children을 쓰려면 FC로 반환 타입 지정해주기
const Workspace: FC = ({ children }) => {
  const { data: userData, error, revalidate } = useSWR('/api/users', fetcher);

  const onLogOut = useCallback(() => {
    axios
      .post('/api/users/logout', null, {
        withCredentials: true, // 쿠기 공유할 때 설정
      })
      .then(() => {
        revalidate();
      });
  }, []);

  if (!userData) {
    return <Redirect to="/login" />;
  }

  return (
    <div>
      <button onClick={onLogOut}>로그아웃</button>
      {children}
    </div>
  );
};

export default Workspace;
