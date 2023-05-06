import React from 'react';
import { Switch } from 'react-router-dom';

import Route from './Route';

import SignIn from '../pages/SignIn';
import SignUp from '../pages/SignUp';
import AcceptInvite from '../pages/AcceptInvite';
import ForgotPassword from '../pages/ForgotPassword';
import ResetPassword from '../pages/ResetPassword';

import Profile from '../pages/Profile';
import Dashboard from '../pages/Dashboard';
import Leads from '../pages/Leads';

const Routes: React.FC = () => (
  <Switch>
    <Route path="/signin" component={SignIn} />
    {/* <Route path="/signup" component={SignUp} /> */}
    <Route path="/accept-invite" component={AcceptInvite} />
    <Route path="/forgot-password" component={ForgotPassword} />
    <Route path="/reset-password" component={ResetPassword} />

    <Route path="/" exact component={Dashboard} isPrivate />
    <Route path="/profile" component={Profile} isPrivate />
    <Route path="/leads" component={Leads} isPrivate />
  </Switch>
);

export default Routes;
