import React, { useEffect } from 'react'
import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form';
import Badge from 'react-bootstrap/Badge'
import { ModalCategory, MealCategory } from '../lib/enums'
import { Recipe, ModalInterface, User, AddRecipeInput } from 'lib/interfaces'
import useForm from 'lib/useForm';
import { useMeLocalQuery, useAddRecipeMutation, useCreateNewRecipeMutation } from 'generated/graphql';
import { getEnumNames } from 'lib/utils';


interface Props extends ModalInterface {
    options: {
        header: string | any
    }
}

export const CreateRecipeModal: React.FC<Props> = ({ show, handleClose, options }) => {
    const [createNewRecipe] = useCreateNewRecipeMutation()

    const { data: user, loading: loadingLocal } = useMeLocalQuery()
    const { header } = options

    const { inputs, handleChange, resetForm, isCreateRecipeValid } = useForm({
        title: '',
        sourceUrl: '',
        summary: '',
        image: '',
    });


    if (loadingLocal)
        console.log('loading local');

    if (user)
        console.log(user);

    const handleSubmit = async (e: any) => {
        e.preventDefault()
        console.log('submit it');

        if (!isCreateRecipeValid()) {
            console.log('fill out the mandatory fields');
            return
        }
        const { title, sourceUrl, summary, image, mealType, } = inputs
        const newRecipe = { ...inputs, userId: user!.me!.id, mealType: parseFloat(MealCategory[header]) }
        console.log(newRecipe);
        const response = await createNewRecipe({
            variables: { newRecipe }
        })

        console.log(response);



        resetForm()
        handleClose()
    }

    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Create New Recipe <Badge variant="secondary">{header}</Badge></Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={handleSubmit}>
                    <Form.Group controlId="title">
                        <Form.Label>Title</Form.Label>
                        <Form.Control type="text" name="title" placeholder="Tasty Miso Soup" value={inputs.title} onChange={handleChange} />
                    </Form.Group>
                    <Form.Group controlId="sourceUrl">
                        <Form.Label>Link to recipe</Form.Label>
                        <Form.Control type="text" name="sourceUrl" placeholder="www.recipesRus.com/tastymisosoup" value={inputs.sourceUrl} onChange={handleChange} />
                    </Form.Group>
                    <Form.Group controlId="image">
                        <Form.Label>Image URL</Form.Label>
                        <Form.Control type="text" name="image" placeholder="" value={inputs.image} onChange={handleChange} />
                    </Form.Group>
                    {/* EVENTUALLY ADD TAGS */}
                    <Form.Group controlId="exampleForm.ControlTextarea1">
                        <Form.Label>Summary</Form.Label>
                        <Form.Control name="summary" value={inputs.summary} onChange={handleChange} as="textarea" rows="3" />
                    </Form.Group>
                    <Button variant="secondary" type="submit">
                        Create Recipe
                </Button>
                </Form>
            </Modal.Body>
            <Modal.Footer>

            </Modal.Footer>
        </Modal>
    )
}
