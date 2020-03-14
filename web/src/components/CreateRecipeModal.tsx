import React, { useEffect, useState } from 'react'
import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form';
import Badge from 'react-bootstrap/Badge'
import { ModalCategory, MealCategory } from '../lib/enums'
import { Recipe, ModalInterface, User, AddRecipeInput } from 'lib/interfaces'
import useForm from 'lib/useForm';
import { useMeLocalQuery, useAddRecipeMutation } from 'generated/graphql';
import { getEnumNames } from 'lib/utils';
import { ADD_RECIPE, GET_ME_LOCAL } from 'graphql/queriesAndMutations';
import { useMutation } from '@apollo/react-hooks';
import cloneDeep from '@bit/lodash.lodash.clone-deep';
import ReactTags, {Tag} from 'react-tag-autocomplete'


interface Props extends ModalInterface {
    options: {
        header: string | any
    }
}

export const CreateRecipeModal: React.FC<Props> = ({ show, handleClose, options }) => {
    // const [createNewRecipe] = useCreateNewRecipeMutation()
    const [addRecipe] = useMutation(ADD_RECIPE)

    const { data: user, loading: loadingLocal } = useMeLocalQuery()
    const { header } = options

    const { inputs, handleChange, resetForm, isCreateRecipeValid } = useForm({
        title: '',
        readyInMinutes: 0,
        servings: 0,
        image: '',
        summary: '',
        sourceUrl: '',
        analyzedInstructions: '',
    });


    //REACT TAGS
    /////////////////////////////////// 
    const [tags, setTags] = useState<Tag[]>([{ id: '1', name: "Apples" },{ id: '2', name: "Pears" }])
    const [suggestions, setSuggestions] = useState<Tag[]>([{ id: '3', name: "Bananas" },
    { id: '4', name: "Mangos" },
    { id: '5', name: "Lemons" },
    { id: '6', name: "Apricots" }])

    const handleDelete = (indexToRmv: number) => {
        const updatedTags = tags.filter((_:any, index: number) => !(index === indexToRmv))
        setTags(updatedTags)
    }


    const handleAddition = (tag: Tag) => {
        const updatedTags = [...tags, tag]
        setTags(updatedTags)
    }

    /////////////////////////////////

    if (loadingLocal)
        console.log('loading local');

    if (user)
        console.log(user);

    const handleSubmit = async (e: any) => {
        e.preventDefault()

        if (!isCreateRecipeValid()) {
            console.log('fill out the mandatory fields');
            return
        }
        const recipe = { ...inputs, userId: user!.me!.id, mealType: parseFloat(MealCategory[header]) }
        console.log(recipe);
        const response = await addRecipe({
            variables: { recipe },
            update(cache, { data: { addRecipe } }) {
                // cloning to prevent any issues with not being able to update cache
                const { me }: any = cloneDeep(cache.readQuery({ query: GET_ME_LOCAL }))
                cache.writeQuery({ query: GET_ME_LOCAL, data: { me: addRecipe } })
            }
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
                    {/* EVENTUALLY ADD TAGS */}
                    <Form.Group controlId="exampleForm.ControlTextarea1">
                        <Form.Label>Summary</Form.Label>
                        <Form.Control name="summary" value={inputs.summary} onChange={handleChange} as="textarea" rows="3" />
                    </Form.Group>
                    <Button variant="secondary" type="submit">
                        Create Recipe
                    </Button>
                </Form>
                <div>
                <ReactTags
                        tags={tags}
                        suggestions={suggestions}
                        handleDelete={handleDelete}
                        handleAddition={handleAddition}
                        allowNew={true}
                        allowBackspace={false}
                        />
                

                </div>
            </Modal.Body>
            <Modal.Footer>

            </Modal.Footer>
        </Modal>
    )
}
