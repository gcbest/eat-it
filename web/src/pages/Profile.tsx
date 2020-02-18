import React from "react";
import { useByeQuery } from "../generated/graphql";
import { Redirect } from 'react-router-dom'


interface Props { }

export const Profile: React.FC<Props> = () => {
  // TODO: createProfileQuery
  const { data, loading, error } = useByeQuery({
    fetchPolicy: "network-only"
  });

  if (loading)
    return <div>loading...</div>;


  // if (error && error.name === 'userNotFound') {
  if (error) {
    return <Redirect to="/register" push={true} />
  }

  if (error) {
    console.error(error);
    return <div>Something went wrong!</div>;
  }

  if (!data)
    return <div>no data</div>;


  return <div>{data.bye}</div>;
};
