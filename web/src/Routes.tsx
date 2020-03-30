import React, { lazy, Suspense } from "react";
import { BrowserRouter, Switch, Route, Redirect } from "react-router-dom";
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { Header } from "./components/Header";
import { SpinnerComponent } from './components/Spinner'


// const Home = lazy(() => import('./pages/Home'))
import Home from './pages/Home'
import { useMeLocalQuery } from "generated/graphql";
const Register = lazy(() => import('./pages/Register'))
const Login = lazy(() => import('./pages/Login'))
const Profile = lazy(() => import('./pages/Profile'))
const Discover = lazy(() => import('./pages/Discover'))

export const Routes: React.FC = () => {
  const { data: user, loading } = useMeLocalQuery()
  const loggedIn = user && user.me ? true : false

  return (
    <BrowserRouter>
      <Header user={user} loading={loading}  />
      {/* <Container> */}
        {/* <Row> */}
          {/* <Col> */}
            <Suspense fallback={<SpinnerComponent/>}>
              <Switch>
                <Route exact path="/"> {loggedIn ? <Redirect to="/profile" /> : <Home />} </Route>
                <Route exact path="/register" component={Register} />
                <Route exact path="/login" component={Login} />
                <Route exact path="/profile" component={Profile} />
                <Route exact path="/discover" component={Discover} />
              </Switch>
            </Suspense>
          {/* </Col> */}
        {/* </Row> */}
      {/* </Container> */}
    </BrowserRouter>
  );
};
