import React, { lazy, Suspense, ReactNode } from "react";
import { BrowserRouter, Switch, Route, Redirect } from "react-router-dom";
// import Container from 'react-bootstrap/Container';
// import Row from 'react-bootstrap/Row';
// import Col from 'react-bootstrap/Col';
import { Header } from "./components/Header";
import { SpinnerComponent } from './components/Spinner'
import { ToastProvider } from 'react-toast-notifications'


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
      <ToastProvider autoDismissTimeout={2500} placement='bottom-right' autoDismiss={true}>
        <Header user={user} loading={loading} />
        <Suspense fallback={<SpinnerComponent />}>
          <Switch>
            <Route exact path="/"> {loggedIn ? <Redirect to="/profile" /> : <Home />} </Route>
            <Route exact path="/register" component={Register} />
            <Route exact path="/login" component={Login} />
            <Route exact path="/profile" component={Profile} />
            <Route exact path="/discover" component={Discover} />
          </Switch>
        </Suspense>
      </ToastProvider>
    </BrowserRouter>
  );
};
