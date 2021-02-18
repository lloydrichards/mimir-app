import React, { Suspense } from 'react';
import { AuthProvider } from './components/auth/Auth';
import SignUp from './components/auth/SignUp';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Login from './components/auth/Login';
import SpaceForm from './components/Organism-Forms/SpaceForm';
import PlantForm from './components/Organism-Forms/PlantForm';
import PrivateRoute from './components/auth/PrivateRoute';
import ForgotPassword from './components/auth/ForgotPassword';
import Layout from './components/Organism-UI/Layout';
import './Styles/App.css';
import SpeciesForm from './components/Organism-Forms/SpeciesForm';
import DateFnsUtils from '@date-io/date-fns';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import { lazy } from 'react';
import Loading from './components/Organism-UI/Loading';
import SpaceInvite from './Pages/SpaceInvite';

const Dashboard = lazy(() => import('./Pages/Dashboard'));
const SpaceDetails = lazy(() => import('./Pages/SpaceDetails'));
const PlantEncyclopedia = lazy(() => import('./Pages/PlantEncyclopedia'));

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
          <Layout>
            <Suspense fallback={Loading}>
              <Switch>
                <PrivateRoute exact path='/' component={Dashboard} />
                <Route path='/signup' component={SignUp} />
                <Route path='/login' component={Login} />
                <Route path='/forgot-password' component={ForgotPassword} />
                <Route path='/encyclopedia' component={PlantEncyclopedia} />
                <PrivateRoute path='/addSpecies' component={SpeciesForm} />
                <PrivateRoute path='/addSpace' component={SpaceForm} />
                <PrivateRoute path='/addPlant' component={PlantForm} />
                <PrivateRoute
                  exact
                  path='/space/:space_id'
                  component={SpaceDetails}
                />
                <Route path='/space/:space_id/invite' component={SpaceInvite} />
              </Switch>
            </Suspense>
          </Layout>
        </MuiPickersUtilsProvider>
      </AuthProvider>
    </Router>
  );
};

export default App;
