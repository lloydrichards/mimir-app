import React from 'react';
import { AuthProvider } from './components/auth/Auth';
import SignOut from './components/auth/SignOut';
import SignUp from './components/auth/SignUp';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Dashboard from './Pages/Dashboard';
import Profile from './components/Profile/Profile';
import Login from './components/auth/Login';
import PlantEncyclopedia from './Pages/PlantEncyclopedia';

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <SignOut />
        <Switch>
          <Route exact path='/' component={Dashboard} />
          <Route path='/signup' component={SignUp} />
          <Route path='/login' component={Login} />
          <Route path='/profile' component={Profile} />
          <Route path='/encyclopedia' component={PlantEncyclopedia} />
        </Switch>
      </AuthProvider>
    </Router>
  );
};

export default App;
