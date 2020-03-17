import React from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { Home } from "./pages/Home";
import { Login } from "./pages/Login";
import { Register } from "./pages/Register";
import { Profile } from "./pages/Profile";
import { Discover } from "pages/Discover";
import { Header } from "./components/Header";

export const Routes: React.FC = () => {
  return (
    <BrowserRouter>
        <Header />
        <Container>
            <Row>
                <Col>
                <Switch>
                  <Route exact path="/" component={Home} />
                  <Route exact path="/register" component={Register} />
                  <Route exact path="/login" component={Login} />
                  <Route exact path="/profile" component={Profile} />
                  <Route exact path="/discover" component={Discover} />
                </Switch>
                </Col>
            </Row>
        </Container>
    </BrowserRouter>
  );
};
