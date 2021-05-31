import React from 'react';
import { Redirect, Route, RouteProps } from 'react-router-native';
import { useAuth } from './Auth';

type Props = {
  component: React.FC;
} & RouteProps;

const PrivateRoute: React.FC<Props> = ({ component: Component, ...rest }) => {
  const { currentUser } = useAuth();
  return (
    <Route
      {...rest}
      render={(props) =>
        currentUser ? <Component {...props} /> : <Redirect to='/login' />
      }></Route>
  );
};

export default PrivateRoute;
