import React from "react";
import { useByeQuery } from "../generated/graphql";
import { Redirect, RouteComponentProps, Link } from 'react-router-dom'
import { MealsArea } from "components/MealsArea";

export const Profile: React.FC<RouteComponentProps> = ({ history }) => {
  // TODO: createProfileQuery - get user with relations - https://typeorm.io/#/many-to-one-one-to-many-relations
  // const users = await userRepository.find({ relations: ["photos"] });

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


  return (<div>
    {data.bye}
    <MealsArea />
  </div>)
};

// TODOs:
// Connect tables (add recipe id to list of user recipes)
// Add tags to a recipe
// Add profile page components
// Use downshift just for general search
// Each section can filter by tags or recipe info
// can choose a random meal from your saved list

// Create CRUD app
// Able to hit spoonacular API and get search results or save a recipe URL
// can add tags to each recipe to sort them
// show lists of different bigger tags like breakfast, lunch, dinner, snack, dessert
// able to filter all at same time
