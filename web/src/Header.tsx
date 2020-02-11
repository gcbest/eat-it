import React from "react";
import { Link } from "react-router-dom";
import { useMeQuery, useLogoutMutation } from "./generated/graphql";
import { setAccessToken } from "./accessToken";
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';

interface Props {}

export const Header: React.FC<Props> = () => {
  const { data, loading } = useMeQuery();
  const [logout, { client }] = useLogoutMutation();

  let body: any = null;

  if (loading) {
    body = null;
  } else if (data && data.me) {
    body = <div>you are logged in as: {data.me.email}</div>;
  } else {
    body = <div>not logged in</div>;
  }

  const handleLogout = async (eventKey: string) => {
    if(eventKey !== "1") return;
    await logout();
    setAccessToken("");
    await client!.resetStore();
  };

  const LoginLink = () => (<Nav.Link as={Link} to="/login">Login</Nav.Link>)
  const LogoutLink = () => (<Nav.Link eventKey="1" as={Link} to="/login">Logout</Nav.Link>)
  const RegisterLink = () => (<Nav.Link as={Link} to="/register">Register</Nav.Link>)


  return (
    <header>
      <Navbar bg="light" expand="lg">
        <Navbar.Brand as={Link} to="/">
          <img src="" alt=""/>
            Eat It!
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav onSelect={handleLogout}>
            <Nav.Link as={Link} to="/">Home</Nav.Link>
            {!loading && data && data.me ? null : <RegisterLink/>}
            {!loading && data && data.me ? <LogoutLink/> : <LoginLink/>}
            <Nav.Link as={Link} to="/bye">Bye</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
      {body}
    </header>
  );
};
