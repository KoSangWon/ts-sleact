import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';

import loadable from '@loadable/component'; // 코드 스플리팅

const LogIn = loadable(() => import('@pages/LogIn'));
const SignUp = loadable(() => import('@pages/SignUp'));
const Workspace = loadable(() => import('@layouts/Workspace'));

const App = () => {
  return (
    <Switch>
      <Redirect exact path="/" to="/login" />
      <Route path="/login" component={LogIn} />
      <Route path="/signup" component={SignUp} />
      <Route path="/workspace/:workspace/channel/:channel" component={Workspace} />
    </Switch>
  );
};

export default App;
