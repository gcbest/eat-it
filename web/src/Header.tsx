import React from "react";
import { Link } from "react-router-dom";
import { useMeQuery } from "./generated/graphql";
import { setAccessToken } from "./accessToken";
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';

interface Props {}

export const Header: React.FC<Props> = () => {
  const { data, loading } = useMeQuery();

  let body: any = null;

  if (loading) {
    body = null;
  } else if (data && data.me) {
    body = <div>you are logged in as: {data.me.email}</div>;
  } else {
    body = <div>not logged in</div>;
  }

  


  return (
    <header>
      
      {body}
    </header>
  );
};
