import React from "react";
import { useByeQuery } from "../generated/graphql";
import { Redirect, RouteComponentProps, Link } from 'react-router-dom'

export const Profile: React.FC<RouteComponentProps> = ({ history }) => {
  // TODO: createProfileQuery
  const { data, loading, error } = useByeQuery({
    fetchPolicy: "network-only" // TODO switch from network only in production
  });

  if (loading)
    return <div>loading...</div>;

  // TODO: set error name to check if not logged in
  // if (error && error.name === 'userNotFound') {
  if (error) {
    history.push('/register')
  }

  if (error) {
    console.error(error);
    return <div>Something went wrong!</div>;
  }

  if (!data)
    return <div>Profile not found.  <Link to="react-router-dom"> Sign up</Link> for an account today!</div>;


  return <div>{data.bye}</div>;
};
