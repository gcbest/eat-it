import React, { Fragment } from 'react';
import { Link } from "react-router-dom";
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import { setAccessToken } from "../lib/accessToken";
import { useLogoutMutation } from '../generated/graphql';
import { Me } from 'lib/interfaces';

const LoginLink = () => (<Nav.Link as={Link} to="/login">Login</Nav.Link>)
const LogoutLink = () => (<Nav.Link eventKey="1" as={Link} to="/login">Logout</Nav.Link>)
const RegisterLink = () => (<Nav.Link as={Link} to="/register">Register</Nav.Link>)

export const NavComponent: React.FC<Me> = ({ user, loading }) => {
  const [logout, { client }] = useLogoutMutation();
  const isLoggedIn = user && user.me ? true : false

  const handleLogout = async (eventKey: string) => {
    if (eventKey !== "1") return;
    await logout();
    setAccessToken("");
    await client!.resetStore();
  };

  return (
    <Fragment>
      <Navbar bg="primary" expand="lg">
        <Navbar.Brand as={Link} to="/">
          <img src="" alt="" />
          Eat It!
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" className="justify-content-end"/>
        <Navbar.Collapse id="basic-navbar-nav" className="justify-content-end">
          <Nav onSelect={handleLogout}>
            {!loading && isLoggedIn ? <Nav.Link as={Link} to="/profile">Profile</Nav.Link> : null}
            {!loading && isLoggedIn ? <Nav.Link as={Link} to="/discover">Discover</Nav.Link> : null}
            {!loading && isLoggedIn ? null : <RegisterLink />}
            {!loading && isLoggedIn ? <LogoutLink /> : <LoginLink />}
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    </Fragment>
  )
}

export default React.memo(NavComponent);
