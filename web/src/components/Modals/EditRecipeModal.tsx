import React, { Fragment, useState, useEffect } from 'react'
import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form';
import { MealCategory } from '../../lib/enums'
import { ModalInterface, ModalProps } from '../../lib/interfaces'
import useForm from 'lib/useForm';
import { useUpdateRecipeByIdMutation, EditRecipeInput } from 'generated/graphql';
import { getEnumNames } from 'lib/utils';
// import cloneDeep from '@bit/lodash.lodash.clone-deep';
import { GET_RECIPE_BY_ID } from 'graphql/queriesAndMutations';
// import ReactTags, { Tag } from 'react-tag-autocomplete';
// import nanoid from 'nanoid';

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
    const { recipe, tags, mealType } = params
    const { id, title, readyInMinutes, servings, image, summary, sourceUrl, analyzedInstructions } = recipe!
    const [updateRecipe] = useUpdateRecipeByIdMutation()
    const { inputs, handleChange, resetForm, isCreateRecipeValid } = useForm({
        title,
        readyInMinutes,
        servings,
        image,
        summary,
        sourceUrl,
        analyzedInstructions,
    });

    const handleSubmit = async () => {
        if (!isCreateRecipeValid()) {
            console.log('fill out all the mandatory fields');
            return
        }
        const updatedRecipe: EditRecipeInput = {
            ...inputs,
            id,
            tags,
            mealType,
            userId: me!.id,
            __typename: 'Recipe',
            isStarred: recipe!.isStarred
        }
        const response = await updateRecipe({
            variables: { input: updatedRecipe },
            update(cache) {
                cache.writeQuery({ query: GET_RECIPE_BY_ID, variables: { id: recipe!.id }, data: { getRecipeById: { ...updatedRecipe } } })
                const x = cache.readQuery({ query: GET_RECIPE_BY_ID, variables: { id: recipe!.id } })
                console.log(x);

                // update recipes on me object
                // const { me }: any = cloneDeep(cache.readQuery({ query: GET_ME_LOCAL }))
                // me.recipes = me.recipes.map((r: RecipeSlim) => r.id === updatedRecipe.id ? updatedRecipe : r)
                // cache.writeQuery({ query: GET_ME_LOCAL, data: { me } })
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
            <Button variant="primary" onClick={() => handleSubmit()}>
                Edit Recipe
            </Button>
        </Form>
    )
}

export const EditRecipeFooter: React.FC = () => {
    return null
}