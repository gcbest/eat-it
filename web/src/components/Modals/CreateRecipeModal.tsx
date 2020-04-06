import React from 'react'
import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form';
import Badge from 'react-bootstrap/Badge'
import { MealCategory } from '../../lib/enums'
import { ModalInterface, ModalProps } from 'lib/interfaces'
import useForm from 'lib/useForm';
import { useAddRecipeMutation } from 'generated/graphql';
import { GET_ME_LOCAL } from 'graphql/queriesAndMutations';
import cloneDeep from '@bit/lodash.lodash.clone-deep'
import placeholder from '../../assets/images/recipe_placeholder.jpg'
import { getKeyByValue } from 'lib/utils';
import RecipeTagsArea from 'components/RecipeTagsArea';


export const CreateRecipeHeader: React.FC<ModalProps<ModalInterface>> = ({ params: { mealType } }) => {
    const header = MealCategory[mealType!]
    
    return (
        <Modal.Title>Create New Recipe <Badge variant="secondary">{header}</Badge></Modal.Title>
    )
}

export const CreateRecipeBody: React.FC<ModalProps<ModalInterface>> = ({ params, handleClose, me }) => {
    const { tags } = params
    const { header }: any = params

    const { inputs, handleChange, resetForm, isCreateRecipeValid } = useForm({
        title: '',
        readyInMinutes: 0,
        servings: 0,
        image: '',
        summary: '',
        sourceUrl: '',
        analyzedInstructions: '',
    });
    const [addRecipe] = useAddRecipeMutation()

    const handleSubmit = async (e: any) => {
        e.preventDefault()

        if (!isCreateRecipeValid()) {
            console.log('fill out the mandatory fields');
            return
        }
        const recipe = {
            ...inputs,
            tags,
            userId: me!.id,
            isStarred: false,
            image: inputs.image ? inputs.image : placeholder,
            mealType: parseFloat(MealCategory[header])
        }
        console.log(recipe);
        const response = await addRecipe({
            variables: { recipe },
            update(cache, { data }) {
                // cloning to prevent any issues with not being able to update cache
                const { me }: any = cloneDeep(cache.readQuery({ query: GET_ME_LOCAL }))
                if (data && data.addRecipe)
                    cache.writeQuery({ query: GET_ME_LOCAL, data: { me: data.addRecipe } })
            }
        })

        console.log(response);

        resetForm()
        handleClose!()
    }

    return (
        <Form onSubmit={handleSubmit}>
            <Form.Group controlId="title">
                <Form.Label>Title</Form.Label>
                <Form.Control type="text" name="title" placeholder="Tasty Miso Soup" value={inputs.title} onChange={handleChange} />
            </Form.Group>
            <Form.Group controlId="sourceUrl">
                <Form.Label>Link to recipe</Form.Label>
                <Form.Control type="text" name="sourceUrl" placeholder="www.recipesRus.com/tastymisosoup" value={inputs.sourceUrl} onChange={handleChange} />
            </Form.Group>
            <Form.Group controlId="readyInMinutes">
                <Form.Label>Prep + Cook Time</Form.Label>
                <Form.Control type="number" min="0" name="readyInMinutes" placeholder="e.g. 45" value={inputs.readyInMinutes} onChange={handleChange} />
            </Form.Group>
            <Form.Group controlId="servings">
                <Form.Label># of Servings</Form.Label>
                <Form.Control type="number" min="0" name="servings" placeholder="e.g. 8" value={inputs.servings} onChange={handleChange} />
            </Form.Group>
            <Form.Group controlId="image">
                <Form.Label>Image URL</Form.Label>
                <Form.Control type="text" name="image" placeholder="" value={inputs.image} onChange={handleChange} />
            </Form.Group>
            <Form.Group controlId="exampleForm.ControlTextarea1">
                <Form.Label>Summary</Form.Label>
                <Form.Control name="summary" value={inputs.summary} onChange={handleChange} as="textarea" rows="3" />
            </Form.Group>
            <RecipeTagsArea params={params} me={me} />
            <Button variant="secondary" type="submit" style={{marginTop: '1.5rem'}}>
                Create Recipe
            </Button>
        </Form>
    )
}

export const CreateRecipeFooter: React.FC<ModalProps<ModalInterface>> = ({ params }) => {
    return null
}