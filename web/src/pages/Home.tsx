import React, { Fragment } from "react";
import { useUsersQuery } from "../generated/graphql";
import moduleStyles from '../styles/Home.module.css';
import styled from 'styled-components';
import heroImage from '../assets/images/fruit-salads-in-plate-1640774.jpg';
import img1 from '../assets/images/pizza-on-plate-2271194.jpg';
import img2 from '../assets/images/close-up-cold-color-drop-372882.jpg';
import img3 from '../assets/images/asparagus-barbecue-cuisine-delicious-361184.jpg';
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
  padding: 0.25em 1em;
  border: 2px solid palevioletred;
  border-radius: 7px;
`;

const MainText = styled.h1`
  text-shadow: 0 0 3px #FF0000;
  position: absolute;
    top: 43%;
    left: 24%;
`;

const Description = styled.h4`
  text-shadow: 0 0 3px #FF0000;
  position: absolute;
    top: 50%;
    left: 24%;
`;


const Home: React.FC<Props> = () => {
  const { data } = useUsersQuery({ fetchPolicy: "network-only" });

  if (!data) {
    //TODO: add spinner Icon
    return <SpinnerComponent />
  }

  const heroImg = {
    className: moduleStyles.heroImg,
    src: heroImage,
    alt: 'Fruit Salads'
  }

  const pizzaImg = {
    src: img1,
    alt: 'Pizza'
  }

  const peppersImg = {
    src: img2,
    alt: 'Peppers'
  }

  const prepImg = {
    src: img3,
    alt: 'Prep'
  }

  return (
    <Fragment>
      <div className="hero" style={{ overflowY: 'hidden', height: '100%', position: 'relative' }}>
        {/* <div className="wrapper" style={{ overflowY: 'hidden', height: '100%' }}> */}
          <LazyLoadPic image={heroImg} />
          <StyledLink to="/register"><RegisterButton>Sign Up Now!</RegisterButton></StyledLink>
          <MainText>Discover New Recipes, Track Your Grocery List</MainText>
          <Description>All in one place</Description>
        {/* </div> */}
      </div>
      <div className={moduleStyles.benefits}>
        <div>
          <LazyLoadPic image={pizzaImg} />
        </div>
        <div>
          <LazyLoadPic image={peppersImg} />
        </div>
        <div>
          <LazyLoadPic image={prepImg} />
          {/* <img src={img3} alt="Prep" /> */}
        </div>
      </div>
    </Fragment>
  );

  // return (
  //   <div>
  //     <div>users:</div>
  //     <ul>
  //       {data.users.map(x => (
  //         <li key={x.id}>
  //           {x.email}, {x.id}
  //         </li>
  //       ))}
  //     </ul>
  //   </div>
  // );
};

export default Home