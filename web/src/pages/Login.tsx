import React, { useState } from "react";
import { RouteComponentProps } from "react-router";
import { useLoginMutation, MeDocument, MeQuery } from "../generated/graphql";
import { setAccessToken } from "../lib/accessToken";
import Card from "react-bootstrap/Card";
import Form from "react-bootstrap/Form";
import loginStyles from '../styles/Login.module.css'
import Button from "react-bootstrap/Button";
import { useToasts } from "react-toast-notifications";

interface Props { }

const Login: React.FC<RouteComponentProps> = ({ history }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [login] = useLoginMutation({
    variables: {
      email,
      password,
    },
    update: (store, { data }) => {
      if (!data) {
        return null;
      }

      console.log('DATA from CACHE');
      console.log(data);

      store.writeQuery<MeQuery>({
        query: MeDocument,
        data: {
          me: data.login.user
        }
      });
    }
  });

  const { addToast } = useToasts()


  return (
    <div className={loginStyles.background}>
      <Card className={loginStyles.login}>
        <Form
          onSubmit={async (e: any) => {
            e.preventDefault();
            console.log("form submitted");
            const response = await login()
              .catch(error => { 
              addToast('Incorrect Login Information', { appearance: 'error' })
              console.error(error) 
            });

            console.log(response);
            if (response && response.data) {
              setAccessToken(response.data.login.accessToken);
              history.push("/");
            }
          }}
        >
          {/* <div>
          <input
            value={email}
            placeholder="email"
            onChange={e => {
              setEmail(e.target.value);
            }}
          />
        </div> */}
          <Form.Group controlId="email">
            <Form.Label className={loginStyles.labels}>Email</Form.Label>
            <Form.Control type="email" name="email" placeholder="name@example.com" value={email} onChange={(e: any) => {
              setEmail(e.target.value);
            }} />
          </Form.Group>
          {/* <div>
          <input
          type="password"
          value={password}
          placeholder="password"
          onChange={e => {
            setPassword(e.target.value);
          }}
          />
        </div> */}
          <Form.Group controlId="password">
            <Form.Label className={loginStyles.labels}>Password</Form.Label>
            <Form.Control type="password" name="password" placeholder="*********" value={password} onChange={(e: any) => {
              setPassword(e.target.value);
            }} />
          </Form.Group>
          <Button type="submit" variant='secondary'>login</Button>
        </Form>
      </Card>
    </div>
  );
};

export default Login