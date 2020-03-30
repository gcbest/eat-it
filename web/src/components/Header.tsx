import React from "react";
import Nav from "./Nav";
import { MeLocalQuery } from "../generated/graphql";

interface Props { 
  user: MeLocalQuery | undefined
  loading: boolean
};

export const Header: React.FC<Props> = ({user, loading}) => {
  let body: any = null;

  if (loading) {
    body = null;
  } else if (user && user.me) {
    body = <div>you are logged in as: {user.me.email}</div>;
  } else {
    body = <div>not logged in</div>;
  }

  return (
    <header>
      <Nav user={user} loading={loading}/>
      {body}
    </header>
  );
};
