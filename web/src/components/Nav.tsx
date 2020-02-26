import React, { Fragment } from 'react';
import { Link } from "react-router-dom";
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import { setAccessToken } from "../accessToken";
import { useLogoutMutation, useMeQuery } from '../generated/graphql';



const LoginLink = () => (<Nav.Link as={Link} to="/login">Login</Nav.Link>)
const LogoutLink = () => (<Nav.Link eventKey="1" as={Link} to="/login">Logout</Nav.Link>)
const RegisterLink = () => (<Nav.Link as={Link} to="/register">Register</Nav.Link>)

interface Props { }

export const NavComponent: React.FC<Props> = () => {
  const [logout, { client }] = useLogoutMutation();
  const { data, loading } = useMeQuery();

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
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav onSelect={handleLogout}>
            <Nav.Link as={Link} to="/">Home</Nav.Link>
            {!loading && data && data.me ? null : <RegisterLink />}
            {!loading && data && data.me ? <LogoutLink /> : <LoginLink />}
            <Nav.Link as={Link} to="/profile">Profile</Nav.Link>
            <Nav.Link as={Link} to="/discover">Discover</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    </Fragment>
  )
}

export default NavComponent;
