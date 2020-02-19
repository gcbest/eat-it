import React from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';
import { RouteComponentProps, Redirect } from 'react-router-dom';
import { useRegisterMutation } from "../generated/graphql";
import useForm from 'lib/useForm';


export const RegistrationForm: React.FC = () => {
    const { inputs, handleChange, resetForm } = useForm({
        password: '',
        confirmPassword: ''
    });
    const [register] = useRegisterMutation();

    const confirmPasswordsMatch = (): boolean => {
        const { password, confirmPassword } = inputs;
        return password === confirmPassword;
    }

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        if (!confirmPasswordsMatch()) {
            alert('passwords do not match!');
            return;
        }

        console.log("form submitted");
        const { email, password } = inputs;
        const response = await register({
            variables: {
                email,
                password
            }
        });
        console.log(response);
        resetForm();
        // history.push('/');
        return <Redirect to="/" push={true} />
    }

    return (
        <Form onSubmit={handleSubmit}>
            <Form.Group controlId="exampleForm.ControlInput1">
                <Form.Label>Email address</Form.Label>
                <Form.Control type="email" name="email" placeholder="name@example.com" value={inputs.email} onChange={handleChange} />
            </Form.Group>
            <Form.Group controlId="exampleForm.ControlInput1">
                <Form.Label>Password</Form.Label>
                <Form.Control type="password" name="password" placeholder="*********" value={inputs.password} onChange={handleChange} />
            </Form.Group>
            <Form.Group controlId="exampleForm.ControlInput1">
                <Form.Label>Confirm Password</Form.Label>
                <Form.Control type="password" name="confirmPassword" placeholder="*********" value={inputs.confirmPassword} onChange={handleChange} />
            </Form.Group>
            <Form.Group controlId="exampleForm.ControlSelect1">
                <Form.Label>Example select</Form.Label>
                <Form.Control as="select">
                    <option>1</option>
                    <option>2</option>
                    <option>3</option>
                    <option>4</option>
                    <option>5</option>
                </Form.Control>
            </Form.Group>
            <Form.Group controlId="exampleForm.ControlSelect2">
                <Form.Label>Example multiple select</Form.Label>
                <Form.Control as="select" multiple name="diets" onChange={handleChange}>
                    <option>Carnivore</option>
                    <option>Mediterranean</option>
                    <option>Pescatarian</option>
                    <option>Vegetarian</option>
                    <option>Vegan</option>
                </Form.Control>
            </Form.Group>
            <Form.Group controlId="exampleForm.ControlTextarea1">
                <Form.Label>Example textarea</Form.Label>
                <Form.Control as="textarea" rows="3" />
            </Form.Group>
            <Button variant="secondary" type="submit">Submit</Button>

        </Form>
    )
}