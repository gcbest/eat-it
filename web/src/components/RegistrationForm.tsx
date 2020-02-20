import React, { useState } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';
import { Redirect } from 'react-router-dom';
import { useRegisterMutation } from "../generated/graphql";
import useForm from 'lib/useForm';


export const RegistrationForm: React.FC = () => {
    const { inputs, handleChange, resetForm, isValid, confirmPasswordsMatch } = useForm({
        password: '',
        confirmPassword: ''
    });
    const [showCompleteFormAlert, setShowCompleteFormAlert] = useState(false)
    const [register] = useRegisterMutation();

    // const handleSubmit = event => {
    //     const form = event.currentTarget;
    //     if (form.checkValidity() === false) {
    //       event.preventDefault();
    //       event.stopPropagation();
    //     }

    //     setValidated(true);
    //   };


    const handleSubmit = async (e: any) => {
        e.preventDefault();
        if (!isValid()) {
            setShowCompleteFormAlert(true);
            setTimeout(() => setShowCompleteFormAlert(false), 2500)
            return;
        }

        console.log("form submitted");
        const { email, password, exerciseLevel, diets } = inputs;
        const response = await register({
            variables: {
                email,
                password,
                exerciseLevel,
                diets
            }
        });
        console.log(response);
        resetForm();
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
            {(!confirmPasswordsMatch() && <Alert variant='danger'>Passwords do not match!</Alert>)}
            <Form.Group controlId="exampleForm.ControlInput1">
                <Form.Label>Confirm Password</Form.Label>
                <Form.Control type="password" name="confirmPassword" placeholder="*********" value={inputs.confirmPassword} onChange={handleChange} />
            </Form.Group>
            <Form.Group controlId="exampleForm.ControlSelect1">
                <Form.Label>Example select</Form.Label>
                <Form.Control as="select" name="exerciseLevel" onChange={handleChange}>
                    <option value="1">1 (Exercise? What's That?)</option>
                    <option value="2">2 </option>
                    <option value="3">3 (3+ days/week)</option>
                    <option value="4">4</option>
                    <option value="5">5 (High Intensity 5+ days/week)</option>
                </Form.Control>
            </Form.Group>
            <Form.Group controlId="exampleForm.ControlSelect2">
                <Form.Label>Example multiple select</Form.Label>
                <Form.Control as="select" multiple name="diets" onChange={handleChange}>
                    <option value="1">Carnivore</option>
                    <option value="2">Mediterranean</option>
                    <option value="3">Pescatarian</option>
                    <option value="4">Vegetarian</option>
                    <option value="5">Vegan</option>
                </Form.Control>
            </Form.Group>
            <Form.Group controlId="exampleForm.ControlTextarea1">
                <Form.Label>Example textarea</Form.Label>
                <Form.Control as="textarea" rows="3" />
            </Form.Group>
            {(showCompleteFormAlert && <Alert variant='warning'>Please answer all questions</Alert>)}
            {/* {(!confirmPasswordsMatch() && <Alert variant='danger'>Passwords do not match!</Alert>)} */}
            <Button variant="secondary" type="submit" disabled={showCompleteFormAlert || !confirmPasswordsMatch()} >Submit</Button>
        </Form>
    )
}