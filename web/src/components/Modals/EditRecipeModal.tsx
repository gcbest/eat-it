import React, { Fragment, useState } from 'react'
import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form';
import { MealCategory } from '../../lib/enums'
import { ModalInterface, ModalProps } from '../../lib/interfaces'
import useForm from 'lib/useForm';
import { useUpdateRecipeByIdMutation, EditRecipeInput } from 'generated/graphql';
import { getEnumNames } from 'lib/utils';
import { GET_RECIPE_BY_ID } from 'graphql/queriesAndMutations';
import RecipeTagsArea from 'components/RecipeTagsArea';
import { useToasts } from "react-toast-notifications";

export const EditRecipeHeader: React.FC<ModalProps<ModalInterface>> = ({ params }) => {
    const { recipe, setMealType } = params
    const { mealType } = recipe!
    const [currentMealType, setCurrentMealType] = useState(mealType)

    const handleMealChange = (e: any) => {
        const newMealType = parseFloat(e.target.value)
        setMealType!(newMealType)
        setCurrentMealType(newMealType)
    }

    return (
        <Fragment>
            <Modal.Title>Edit Recipe
                <Form>
                    <Form.Group controlId="edit-header">
                        <Form.Control as="select" name="mealType" value={currentMealType.toString()} onChange={handleMealChange}>
                            {getEnumNames(MealCategory).map((key: string | any) => <option key={key} value={MealCategory[key]}>{key}</option>)}
                        </Form.Control>
                    </Form.Group>
                </Form>
            </Modal.Title>
        </Fragment>
    )
}

export const EditRecipeBody: React.FC<ModalProps<ModalInterface>> = ({ params, handleClose, me }) => {
    const { recipe, tags = [], mealType } = params
    const [updatedTags, setUpdatedTags] = useState(tags)
    const { id, title, readyInMinutes, servings, image, summary, sourceUrl, analyzedInstructions, extendedIngredients } = recipe!
    const [updateRecipe] = useUpdateRecipeByIdMutation()
    const { addToast } = useToasts()
    const { inputs, handleChange, isCreateRecipeValid } = useForm({
        title,
        readyInMinutes,
        servings,
        image,
        summary,
        sourceUrl,
        analyzedInstructions,
        extendedIngredients
    });

    const handleSubmit = async () => {
        if (!isCreateRecipeValid()) {
            addToast('Mandatory Fields Not Completed', { appearance: 'error' })
            return
        }
        const updatedRecipe: EditRecipeInput = {
            ...inputs,
            id,
            tags: updatedTags,
            mealType,
            userId: me!.id,
            __typename: 'Recipe',
            isStarred: recipe!.isStarred
        }
        await updateRecipe({
            variables: { input: updatedRecipe },
            update(cache) {
                console.log(updatedRecipe);
                cache.writeQuery({ query: GET_RECIPE_BY_ID, variables: { id: recipe!.id }, data: { getRecipeById: { ...updatedRecipe } } })
                const updated = cache.readQuery({ query: GET_RECIPE_BY_ID, variables: { id: recipe!.id } })
                console.log(updated);
            }
        })

        handleClose!()
    }

    return (
        <Form>
            <Form.Group controlId="title">
                <Form.Label>Title</Form.Label>
                <Form.Control type="text" name="title" value={inputs.title} onChange={handleChange} />
            </Form.Group>
            <Form.Group controlId="sourceUrl">
                <Form.Label>Link to recipe</Form.Label>
                <Form.Control type="text" name="sourceUrl" placeholder="e.g. www.recipesRus.com/tastymisosoup" value={inputs.sourceUrl} onChange={handleChange} />
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
            <RecipeTagsArea params={params} me={me} setUpdatedTags={setUpdatedTags} />
            <Button variant="primary" onClick={() => handleSubmit()} style={{ marginTop: '1.5rem' }}>
                Edit Recipe
            </Button>
        </Form>
    )
}

export const EditRecipeFooter: React.FC = () => {
    return null
}