import React from "react";
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
};

export default Register