import React, { useState } from 'react';
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';
// import { connect } from 'react-redux';
import Login from './components/admin/Login';
import Signup from './components/admin/Signup';
import Container from "./components/Container";
import AuthContext from './auth';
// import { store } from './index';

const PrivateRoute = ({ component: Component, ...rest }) => (
  <Route {...rest} render={(props) => (
    rest.needLogin === true ? <Redirect to='/login' /> : <Component {...props} />   )}
  />
)

const App = () => {
  const [fetchWithCSRF] = useState(() => fetch);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading] = useState(true)
  const authContextValue = {fetchWithCSRF, currentUser, setCurrentUser};

  return (
    <AuthContext.Provider value={authContextValue}>
      {loading ?
        <h1>Loading</h1>
      :
        <BrowserRouter>
          <Switch>
            <Route path="/login" component={Login} />
            <Route path="/signup" component={Signup} />
            <PrivateRoute path="/"
            // exact={true}
            needLogin={this.props.needLogin} component={Container} />
          </Switch>
        </BrowserRouter>
      }
    </AuthContext.Provider>
  );
}
// const msp = state => ({ currentUserId: state.authentication.id, needLogin: !state.authentication.id});
// export default connect(msp)(App);
export default App;
