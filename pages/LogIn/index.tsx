import useInput from '@hooks/useInput';
import { Button, Error, Form, Header, Input, Label, LinkContainer } from '@pages/SignUp/styles';
import fetcher from '@utils/fetcher';
import axios from 'axios';
import React, { useCallback, useState } from 'react';
import { Link, Redirect } from 'react-router-dom';
import useSWR from 'swr';

const LogIn = () => {
  //data가 존재하지 않으면 loading중임
  const { data: userData, error, revalidate, mutate } = useSWR('/api/users', fetcher);
  const [logInError, setLogInError] = useState(false);
  const [email, onChangeEmail] = useInput('');
  const [password, onChangePassword] = useInput('');
  const onSubmit = useCallback(
    (e) => {
      e.preventDefault();
      setLogInError(false);
      axios
        .post(
          '/api/users/login',
          { email, password },
          {
            withCredentials: true,
          },
        )
        .then((response) => {
          // revalidate(); // 서버에 요청 한번 더 보냄, mutate로 최적화시킬 수 있음
          mutate(response.data, false); // 서버에 요청 안보내고 데이터 수정할 수 있음. 두번재 인자에 false를 넣어야 진짜 요청이 안감. 서버에 가기도 전에 화면에 뭔가가 반영됨. 가끔 서버 에러가 터질때가 있어서 점검도 가끔한다. 그러면 인스타 좋아요를 바로 꺼버린다. 그것을 optimistic UI 라고 한다. 점검했는데 되면 그냥 넘어가고 안됐으면 눌린 하트 불꺼버리기. 성공한다고 가정하고 반영하는 것을 optimistic이라 하고, 서버에 요청이 성공하면 반영하는 것을 pessimistic UI라고 한다. 두번째 인자의 false는 서버에 요청 안보낸다. optimistic ui 하고 싶으면 true로 하면 된다.
        })
        .catch((error) => {
          setLogInError(error.response?.data?.statusCode === 401);
        });
    },
    [email, password],
  );

  if (userData === undefined) {
    return <div>로딩중...</div>;
  }

  if (!error && userData) {
    console.log('로그인됨', userData);
    return <Redirect to="/workspace/sleact/channel/일반" />;
  }

  return (
    <div id="container">
      <Header>Sleact</Header>
      <Form onSubmit={onSubmit}>
        <Label id="email-label">
          <span>이메일 주소</span>
          <div>
            <Input type="email" id="email" name="email" value={email} onChange={onChangeEmail} />
          </div>
        </Label>
        <Label id="password-label">
          <span>비밀번호</span>
          <div>
            <Input type="password" id="password" name="password" value={password} onChange={onChangePassword} />
          </div>
          {logInError && <Error>이메일과 비밀번호 조합이 일치하지 않습니다.</Error>}
        </Label>
        <Button type="submit">로그인</Button>
      </Form>
      <LinkContainer>
        아직 회원이 아니신가요?&nbsp;
        <Link to="/signup">회원가입 하러가기</Link>
      </LinkContainer>
    </div>
  );
};

export default LogIn;
