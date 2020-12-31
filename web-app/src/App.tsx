import React from 'react';
import { AuthProvider } from './components/auth/Auth';
import Login from './components/auth/Login';
import SignOut from './components/auth/SignOut';
import SignUp from './components/SignUp/SignUp';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Dashboard from './components/Dashboard/Dashboard';

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <Switch>
          <Route exact path='/' component={Dashboard} />
          <Route path='/signup' component={SignUp} />
        </Switch>
        <SignOut />
      </AuthProvider>
    </Router>
  );
};

export default App;
