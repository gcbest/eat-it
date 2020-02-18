import React from "react";
import Nav from "./Nav";
import { useMeQuery } from "../generated/graphql";

interface Props { };

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
      <Nav />
      {body}
    </header>
  );
};
