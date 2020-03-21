import React, { lazy, Suspense } from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { Header } from "./components/Header";
import { SpinnerComponent } from './components/Spinner'


const Home = lazy(() => import('./pages/Home'))
const Register = lazy(() => import('./pages/Register'))
const Login = lazy(() => import('./pages/Login'))
const Profile = lazy(() => import('./pages/Profile'))
const Discover = lazy(() => import('./pages/Discover'))

export const Routes: React.FC = () => {
  return (
    <BrowserRouter>
      <Header />
      {/* <Container> */}
        <Row>
          <Col>
            <Suspense fallback={<SpinnerComponent/>}>
              <Switch>
                <Route exact path="/" component={Home} />
                <Route exact path="/register" component={Register} />
                <Route exact path="/login" component={Login} />
                <Route exact path="/profile" component={Profile} />
                <Route exact path="/discover" component={Discover} />
              </Switch>
            </Suspense>
          </Col>
        </Row>
      {/* </Container> */}
    </BrowserRouter>
  );
};
