import React, { Fragment } from "react";
import { useUsersQuery } from "../generated/graphql";
import moduleStyles from '../styles/Home.module.css';
import styled from 'styled-components';
import heroImage from '../assets/images/fruit-salads-in-plate-1640774.jpg';
// import img1 from '../assets/images/pizza-on-plate-2271194.jpg';
// import img3 from '../assets/images/asparagus-barbecue-cuisine-delicious-361184.jpg';
import StyledLink from "components/StyledLink";
import { SpinnerComponent } from 'components/Spinner'
import LazyLoadPic from "components/LazyLoadPic";
import './Home.css'

interface Props { }

const RegisterButton = styled.button`
  background: palevioletred;
  color: white;
  font-size: 1.5rem;
  display: block;
  margin: auto;
  padding: 0.25rem 1rem;
  border: 2px solid palevioletred;
  border-radius: 7px;
  :hover {
    font-size: 1.55rem;
    padding: 0.3rem 1.1rem;
  }
`;

const MainText = styled.h1`
  text-shadow: 0 0 3px #FF0000;
  width: max-content;
  position: absolute;
  top: 40%;
  left: 50%;
  transform: translate(-50%, -50%);
  @media only screen and (max-width: 500px) {
    font-size: 2rem;
  }
`;

const Description = styled.h3`
  text-shadow: 0 0 3px #FF0000;
  width: max-content;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
`;


const Home: React.FC<Props> = () => {
  const { data } = useUsersQuery({ fetchPolicy: "network-only" });

  if (!data) {
    return <SpinnerComponent />
  }

  const heroImg = {
    className: moduleStyles.heroImg,
    src: heroImage,
    alt: 'Fruit Salads'
  }

  // const pizzaImg = {
  //   src: img1,
  //   alt: 'Pizza'
  // }

  // const prepImg = {
  //   src: img3,
  //   alt: 'Prep'
  // }

  return (
    <Fragment>
      {/* <div className="hero" style={{ overflowY: 'hidden', height: '100%', position: 'relative' }}> */}
      <div className="hero">
        <LazyLoadPic image={heroImg} />
        <div className="content">

          <MainText>Discover New Recipes</MainText>
          <MainText style={{ top: '45%' }}>Track Your Grocery List</MainText>
          <Description>All in one place</Description>
          <StyledLink to="/register"><RegisterButton>Sign Up Now!</RegisterButton></StyledLink>
        </div>
      </div>
    </Fragment>
  );
};

export default Home