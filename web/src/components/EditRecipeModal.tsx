import React from 'react'
import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form';
import { ModalCategory, MealCategory } from '../lib/enums'
import { Recipe, ModalInterface, User, AddRecipeInput } from 'lib/interfaces'
import useForm from 'lib/useForm';
import { useMeLocalQuery, useAddRecipeMutation } from 'generated/graphql';
import { getEnumNames } from 'lib/utils';


interface Props extends ModalInterface {
    options: {
        type: ModalCategory
    }
    recipe: Recipe | null
}

export const EditRecipeModal: React.FC<Props> = ({ show, handleClose, recipe, options }) => {
    const { type } = options
    const [addRecipe] = useAddRecipeMutation()
    const { data: user, loading: loadingLocal } = useMeLocalQuery()

    if (loadingLocal)
        console.log('loading local');

    if (user)
        console.log(user);

    const renderText = (type: ModalCategory): string => {
        // let text = {title: '', actionButton: ''}
        switch (type) {
            case ModalCategory.New:
                return 'Add'
            case ModalCategory.Edit:
                return 'Edit'
        }
    }

    const handleSave = () => {
        if (recipe) {
            const formattedRecipe: AddRecipeInput = { ...recipe, userId: user!.me!.id, mealType: parseFloat(inputs.mealType) }
            // remove properties not needed by mutation
            delete formattedRecipe.id
            delete formattedRecipe.__typename
            console.log('adding recipe');

            addRecipe({
                variables: {
                    recipe: formattedRecipe
                }
            })
        }

        handleClose()
    }

    const { inputs, handleChange } = useForm({
        mealType: 1
    });

    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>{`${renderText(type)} This Recipe`}</Modal.Title>
                <Form>
                    <Form.Group controlId="exampleForm.ControlSelect2">
                        <Form.Label>Example multiple select</Form.Label>
                        <Form.Control as="select" name="mealType" value={inputs.mealType} onChange={handleChange}>
                            {getEnumNames(MealCategory).map((key: string | any) => <option key={key} value={MealCategory[key]}>{key}</option>)}
                        </Form.Control>
                    </Form.Group>
                </Form>
            </Modal.Header>
            <Modal.Body>
                <h3>{recipe ? recipe.title : ''}</h3>
                <p>{recipe ? recipe.summary : ''}</p>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleSave}>
                    {`${renderText(type)} Recipe`}
                </Button>
            </Modal.Footer>
        </Modal>
    )
}
