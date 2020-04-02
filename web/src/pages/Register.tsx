import React, { useState } from "react";
import { useRegisterMutation } from "../generated/graphql";
import { RouteComponentProps } from "react-router-dom";
import { RegistrationForm } from "components/RegistrationForm";
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import registerStyles from '../styles/Register.module.css'

const Register: React.FC = () => {

  return (
    <div className={registerStyles.background}>
      <Container>
        <Row>
          <Col>
            <RegistrationForm />
          </Col>
        </Row>
      </Container>
    </div>
  )











  // return (
  //   <form
  //     onSubmit={async e => {
  //       e.preventDefault();
  //       console.log("form submitted");
  //       const response = await register({
  //         variables: {
  //           email,
  //           password
  //         }
  //       });

  //       console.log(response);

  //       history.push("/");
  //     }}
  //   >
  //     <div>
  //       <input
  //         value={email}
  //         placeholder="email"
  //         onChange={e => {
  //           setEmail(e.target.value);
  //         }}
  //       />
  //     </div>
  //     <div>
  //       <input
  //         type="password"
  //         value={password}
  //         placeholder="password"
  //         onChange={e => {
  //           setPassword(e.target.value);
  //         }}
  //       />
  //     </div>
  //     <button type="submit">register</button>
  //   </form>
  // );
};

export default Register