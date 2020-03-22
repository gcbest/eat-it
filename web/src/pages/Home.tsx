import React, { Fragment } from "react";
import { useUsersQuery } from "../generated/graphql";
import moduleStyles from '../styles/Home.module.css';
// import Button from 'react-bootstrap/Button'
import styled from 'styled-components';
import heroImg from '../assets/images/fruit-salads-in-plate-1640774.jpg';
import img1 from '../assets/images/pizza-on-plate-2271194.jpg';
import img2 from '../assets/images/close-up-cold-color-drop-372882.jpg';
import img3 from '../assets/images/asparagus-barbecue-cuisine-delicious-361184.jpg';
import StyledLink from "components/StyledLink";
import { SpinnerComponent } from 'components/Spinner'
import LazyLoadPic from "components/LazyLoadPic";


interface Props { }

const RegisterButton = styled.button`
  background: palevioletred;
  color: white;
  font-size: 3em;
  display: block;
  margin: auto;
  padding: 0.25em 1em;
  border: 2px solid palevioletred;
  border-radius: 3px;
`;


const Home: React.FC<Props> = () => {
  const { data } = useUsersQuery({ fetchPolicy: "network-only" });

  if (!data) {
    //TODO: add spinner Icon
    return <SpinnerComponent />
  }

  const image = {
    className: moduleStyles.heroImg,

    src: heroImg,
    alt: 'Fruit Salads'
  }

  return (
    <Fragment>
      <div className="hero" style={{ width: '100vw', height: '100vh' }}>
        {/* <img className={moduleStyles.heroImg} width="100vh" height="100%" src={heroImg} alt="Fruit Salads" /> */}
        <div className="wrapper" style={{overflowY: 'hidden', height: '100%'}}>
          <LazyLoadPic image={image} />
        </div>
        {/* <img className={moduleStyles.heroImg} src={heroImg} alt="Fruit Salads" /> */}
        {/* <Button className={moduleStyles.signUpBtn} variant="secondary">Sign Up Now!</Button> */}
      </div>
      <div>

        <StyledLink to="/register"><RegisterButton>Sign Up Now!</RegisterButton></StyledLink>
      </div>

      <div className={moduleStyles.benefits}>
        <div>
          <img src={img1} alt="Pizza" />
        </div>
        <div>
          <img src={img2} alt="Peppers" />
        </div>
        <div>
          <img src={img3} alt="Prep" />
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