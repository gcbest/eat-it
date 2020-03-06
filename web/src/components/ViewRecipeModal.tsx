import React, { Fragment } from 'react'
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

interface ModalContent { title: string, actionButton: string, body: any }

export const ViewRecipeModal: React.FC<Props> = ({ show, handleClose, recipe, options }) => {
    const { type } = options
    const [addRecipe] = useAddRecipeMutation()
    const { data: user, loading: loadingLocal } = useMeLocalQuery()

    const { inputs, handleChange } = useForm({ mealType: 1 });

    if (loadingLocal)
        console.log('loading local');

    if (user)
        console.log(user);

    const renderText = (category: ModalCategory): string => {
        // let text = {title: '', actionButton: ''}
        switch (category) {
            case ModalCategory.NewDiscover:
                return 'Save'
            case ModalCategory.NewCreate:
                return 'Create'
            case ModalCategory.Edit:
                return 'Edit'
        }
    }

    // const renderContent = (category: ModalCategory): ModalContent => {
    //     let content: ModalContent = { title: '', actionButton: '', body: undefined }
    //     switch (category) {
    //         case ModalCategory.NewDiscover:
    //             content.title = 'Save this recipe'
    //             content.actionButton = 'Save recipe'
    //             content.body = generateNewCreateBody()
    //             break
    //         case ModalCategory.NewCreate:
    //             content.title = 'Add this recipe'
    //             break
    //         case ModalCategory.Edit:
    //     }
    //     return content
    // }

    const addRecipeFromDiscover = () => {
        if (!recipe)
            throw new Error('recipe from discover not found')

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

    const createNewRecipe = () => {
        // grab details from inputs
        // make request to backend

    }

    const editRecipe = () => {
        // grab details from recipe
        // make graphql query to request them
    }

    const handleSave = (category: ModalCategory) => {
        // switch case to handle the different saving/updating options
        switch (category) {
            case ModalCategory.NewDiscover:

                // add from discover
                addRecipeFromDiscover()
                break
            case ModalCategory.NewCreate:
                createNewRecipe()
                break
            case ModalCategory.Edit:
                editRecipe()
                break
        }
        // edit existing recipe

        handleClose()
    }

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
                {
                    recipe &&
                    <Fragment>
                        {recipe.image &&
                            <img src={recipe.image} alt={recipe.title} />}
                        <h3>{recipe ? recipe.title : ''}</h3>
                        <p>{recipe ? recipe.summary : ''}</p>
                    </Fragment>
                }
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={() => handleSave(type)}>
                    {`${renderText(type)} Recipe`}
                </Button>
            </Modal.Footer>
        </Modal>
    )
}
