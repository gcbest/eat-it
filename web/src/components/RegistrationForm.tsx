import React, { useState } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';
import { Redirect } from 'react-router-dom';
import nanoid from 'nanoid';
import { useRegisterMutation, useLoginMutation, MeQuery, MeDocument } from "../generated/graphql";
import useForm from 'lib/useForm';
import { getKeyByValue } from 'lib/utils';
import { Diet } from 'lib/enums';
import { Tag } from 'react-tag-autocomplete';


export const RegistrationForm: React.FC = () => {
    const { inputs, handleChange, resetForm, isRegistrationValid, confirmPasswordsMatch } = useForm({
        email: '',
        password: '',
        confirmPassword: '',
        exerciseLevel: '1',
        diets: []
    });
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const [showCompleteFormAlert, setShowCompleteFormAlert] = useState(false)
    const [register] = useRegisterMutation();
    const [login] = useLoginMutation();


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
        if (!isRegistrationValid()) {
            setShowCompleteFormAlert(true);
            setTimeout(() => setShowCompleteFormAlert(false), 2500)
            return;
        }

        console.log("form submitted");
        const { email, password, exerciseLevel, diets } = inputs
        const defaultTags: Tag[] = [{id: nanoid(8), name: 'high-protein'}, {id: nanoid(8), name: 'vegan'}]
        // e.g. (['keto', 'pescatarian']) => [{id: 123, name: 'keto'}, {id: 456, name: 'pescatarian'}]
        const convertDietTypesToTags = (dietsArr: number[]): Tag[] => dietsArr.map(dietNum => {
            const dietName = getKeyByValue(Diet, dietNum)!.toLowerCase()
            return {id: nanoid(8), name: dietName}
        })
        // convert string values of diet types to ints
        const dietsArr: number[] = diets.split(',').map((d: string) => parseInt(d)) // e.g. (['1', '4']) => [1,4]
        // create tags for the diet types
        const selectedDietTags: Tag[] = convertDietTypesToTags(dietsArr) // e.g. [{id: 123, name: 'keto'}, {id: 456, name: 'pescatarian'}]

        try {
            const response = await register({
                variables: {
                    email,
                    password,
                    exerciseLevel: parseInt(exerciseLevel),
                    diets,
                    tags: [...defaultTags, ...selectedDietTags]
                }
            });
            console.log(response);

            await login({
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
            })
                
            resetForm();
            setIsLoggedIn(true)
        } catch (error) {
            console.error(error)
        }
    }

    return (
        isLoggedIn ? 
        <Redirect to="/profile" push={true} /> 
        :
        <Form onSubmit={handleSubmit}>
            <Form.Group controlId="email">
                <Form.Label>Email address</Form.Label>
                <Form.Control type="email" name="email" placeholder="name@example.com" value={inputs.email} onChange={handleChange} />
            </Form.Group>
            <Form.Group controlId="password">
                <Form.Label>Password</Form.Label>
                <Form.Control type="password" name="password" placeholder="*********" value={inputs.password} onChange={handleChange} />
            </Form.Group>
            {(!confirmPasswordsMatch() && <Alert variant='danger'>Passwords do not match!</Alert>)}
            <Form.Group controlId="confirmPassword">
                <Form.Label>Confirm Password</Form.Label>
                <Form.Control type="password" name="confirmPassword" placeholder="*********" value={inputs.confirmPassword} onChange={handleChange} />
            </Form.Group>
            <Form.Group controlId="exampleForm.ControlSelect1">
                <Form.Label>Example select</Form.Label>
                <Form.Control as="select" name="exerciseLevel" value={inputs.exerciseLevel} onChange={handleChange}>
                    <option value="1">1 (Exercise? What's That?)</option>
                    <option value="2">2 </option>
                    <option value="3">3 (3+ days/week)</option>
                    <option value="4">4</option>
                    <option value="5">5 (High Intensity 5+ days/week)</option>
                </Form.Control>
            </Form.Group>
            <Form.Group controlId="exampleForm.ControlSelect2">
                <Form.Label>Example multiple select</Form.Label>
                <Form.Control as="select" multiple name="diets" value={inputs.diets} onChange={handleChange}>
                    <option value="1">Carnivore</option>
                    <option value="2">Mediterranean</option>
                    <option value="3">Pescatarian</option>
                    <option value="4">Vegetarian</option>
                    <option value="5">Vegan</option>
                </Form.Control>
            </Form.Group>
            {(showCompleteFormAlert && <Alert variant='warning'>Please answer all questions</Alert>)}
            {/* {(!confirmPasswordsMatch() && <Alert variant='danger'>Passwords do not match!</Alert>)} */}
            <Button variant="secondary" type="submit" disabled={showCompleteFormAlert || !confirmPasswordsMatch()} >Submit</Button>
        </Form>
    )
}