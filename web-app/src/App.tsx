import React from 'react';
import { AuthProvider } from './components/auth/Auth';
import SignUp from './components/auth/SignUp';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Dashboard from './Pages/Dashboard';
import Profile from './components/Profile/Profile';
import Login from './components/auth/Login';
import PlantEncyclopedia from './Pages/PlantEncyclopedia';
import SpaceForm from './components/Organism-Forms/SpaceForm';
import PlantForm from './components/Organism-Forms/PlantForm';
import PrivateRoute from './components/auth/PrivateRoute';
import ForgotPassword from './components/auth/ForgotPassword';
import Layout from './components/Organism-UI/Layout';
import './Styles/App.css';
import SpaceDetails from './Pages/SpaceDetails';
import SpeciesForm from './components/Organism-Forms/SpeciesForm';
import DateFnsUtils from '@date-io/date-fns';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
          <Layout>
            <Switch>
              <PrivateRoute exact path='/' component={Dashboard} />
              <Route path='/signup' component={SignUp} />
              <Route path='/login' component={Login} />
              <Route path='/forgot-password' component={ForgotPassword} />
              <PrivateRoute path='/profile' component={Profile} />
              <Route path='/encyclopedia' component={PlantEncyclopedia} />
              <PrivateRoute path='/addSpecies' component={SpeciesForm} />
              <PrivateRoute path='/addSpace' component={SpaceForm} />
              <PrivateRoute path='/addPlant' component={PlantForm} />
              <PrivateRoute path='/space/:space_id' component={SpaceDetails} />
            </Switch>
          </Layout>
        </MuiPickersUtilsProvider>
      </AuthProvider>
    </Router>
  );
};

export default App;
