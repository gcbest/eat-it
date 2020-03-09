import React, { Fragment, useState } from 'react'
import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form';
import { ModalCategory, MealCategory } from '../lib/enums'
import { Recipe, ModalInterface, User, AddRecipeInput } from 'lib/interfaces'
import useForm from 'lib/useForm';
import { useMeLocalQuery, useAddRecipeMutation, useUpdateRecipeByIdMutation } from 'generated/graphql';
import { getEnumNames } from 'lib/utils';


interface Props extends ModalInterface {
    options: {
        type: ModalCategory
    }
    recipe: Recipe | null
}

interface ModalContent { title: string, actionButton: string, body: any }

export const EditRecipeModal: React.FC<Props> = ({ show, handleClose, recipe, options }) => {
    const [isEditing, setIsEditing] = useState(false)
    const { type } = options
    const [updateRecipe] = useUpdateRecipeByIdMutation()
    const { data: user, loading: loadingLocal } = useMeLocalQuery()
    const { title, readyInMinutes, servings, image, summary, sourceUrl, analyzedInstructions, mealType } = recipe!

    const { inputs, handleChange, resetForm, isCreateRecipeValid } = useForm({
        title,
        readyInMinutes,
        servings,
        image,
        summary,
        sourceUrl,
        analyzedInstructions,
        mealType
    });

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

    const editRecipe = () => {
        // grab details from recipe
        // make graphql query to request them
    }

    const handleSave = (category: ModalCategory) => {
        // switch case to handle the different saving/updating options
        // switch (category) {
        //     case ModalCategory.NewDiscover:

        //         // add from discover
        //         addRecipeFromDiscover()
        //         break
        // case ModalCategory.Edit:
        // break
        // }
        // edit existing recipe

        editRecipe()
        handleClose()
    }

    const displayViewContent = (recipe: Recipe) => (

        <Fragment>
            {image &&
                <img src={image} alt={title} />}
            <h3>{title}</h3>
            <p>
                <span>Ready in: <strong>{readyInMinutes}</strong> mins</span><span style={{ marginLeft: '1rem' }}>Servings: {servings}</span>
            </p>


            <p>{summary}</p>
        </Fragment>
    )

    // const handleSubmit = async (e: any) => {
    const handleSubmit = async () => {
        // e.preventDefault()
        console.log('submit edit');

        if (!isCreateRecipeValid()) {
            console.log('fill out the mandatory fields');
            return
        }
        const recipe = { ...inputs, userId: user!.me!.id }
        console.log(recipe);
        const response = await updateRecipe({
            variables: { input: recipe }
        })

        console.log(response);
        handleClose()
    }

    const displayEditContent = (recipe: Recipe | null) => (
        recipe ?
            // <Form onSubmit={handleSubmit}>
            <Form>
                <Form.Group controlId="title">
                    <Form.Label>Title</Form.Label>
                    <Form.Control type="text" name="title" value={inputs.title} onChange={handleChange} />
                </Form.Group>
                <Form.Group controlId="sourceUrl">
                    <Form.Label>Link to recipe</Form.Label>
                    <Form.Control type="text" name="sourceUrl" placeholder="www.recipesRus.com/tastymisosoup" value={inputs.sourceUrl} onChange={handleChange} />
                </Form.Group>
                <Form.Group controlId="readyInMinutes">
                    <Form.Label>Prep + Cook Time</Form.Label>
                    <Form.Control type="number" name="readyInMinutes" placeholder="e.g. 45" value={inputs.readyInMinutes} onChange={handleChange} />
                </Form.Group>
                <Form.Group controlId="servings">
                    <Form.Label># of Servings</Form.Label>
                    <Form.Control type="number" name="servings" placeholder="e.g. 8" value={inputs.servings} onChange={handleChange} />
                </Form.Group>
                <Form.Group controlId="image">
                    <Form.Label>Image URL</Form.Label>
                    <Form.Control type="text" name="image" placeholder="" value={inputs.image} onChange={handleChange} />
                </Form.Group>
                <Form.Group controlId="exampleForm.ControlTextarea1">
                    <Form.Label>Summary</Form.Label>
                    <Form.Control name="summary" value={inputs.summary} onChange={handleChange} as="textarea" rows="3" />
                </Form.Group>
                {/* <Button variant="secondary" type="submit">
                    Edit Recipe
            </Button> */}
            </Form>
            :
            null
    )


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
                    displayEditContent(recipe)
                }
            </Modal.Body>
            <Modal.Footer>
                <Button variant="primary" onClick={() => handleSubmit()}>
                    {`Edit Recipe`}
                </Button>
            </Modal.Footer>
        </Modal>
    )
}
