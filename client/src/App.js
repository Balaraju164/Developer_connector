import React, { Fragment, useEffect } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import './App.css';
import Navbar from './components/layout/Navbar';
import Landing from './components/layout/Landing';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import { Provider } from 'react-redux';
import store from './store';
import Alert from './components/layout/Alert';
import setAuthToken from './utils/xAuthtoken';
import loadUser from './actions/loadUser';
import Dashboard from './components/dashboards/Dashboard'
import PrivateRouting from './components/routing/PrivateRouting'
import CreateProfile from './components/profile_forms/CreateProfile'
import EditProfile from './components/profile_forms/EditProfile'
import AddExperience from './components/profile_forms/AddExperience'
import AddEducation from './components/profile_forms/AddEducation'
import Profiles from './components/profiles/Profiles'
import Profile from './components/profile/Profile'

if (localStorage.token) {
  setAuthToken(localStorage.token);
}

const App = () => {
  useEffect(() => {
    store.dispatch(loadUser());
  }, []);

  return (
    <Provider store={store}>
      <Router>
        <Fragment>
          <Navbar />
          <Route exact path='/' component={Landing} />
          <section className='container'>
            <Alert />
            <Switch>
              <Route exact path='/login' component={Login} />
              <Route exact path='/register' component={Register} />
              <Route exact path='/profiles' component={Profiles} />
              <Route exact path='/profile/:id' component={Profile} />
              <PrivateRouting exact path='/dashboard' component={Dashboard} />
              <PrivateRouting exact path='/create_profile' component={CreateProfile} />
              <PrivateRouting exact path='/edit-profile' component={EditProfile} />
              <PrivateRouting exact path='/add-experience' component={AddExperience} />
              <PrivateRouting exact path='/add-education' component={AddEducation} />
            </Switch>
          </section>
        </Fragment>
      </Router>
    </Provider>
  );
};

export default App;
