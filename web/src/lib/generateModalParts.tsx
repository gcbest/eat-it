import React, { Fragment, useContext } from 'react'
import { ModalInterface, User, RecipeSlim } from './interfaces'
import Modal from 'react-bootstrap/Modal'
import Form from 'react-bootstrap/Form'
import { getEnumNames, createMarkup } from './utils'
import { MealCategory, ModalCategory } from './enums'
import useForm from './useForm'
import Badge from 'react-bootstrap/Badge'
import { useDeleteRecipeByIdMutation, useAddRecipeMutation, EditRecipeInput, useUpdateRecipeByIdMutation } from 'generated/graphql'
import { GET_ME_LOCAL, GET_RECIPE_BY_ID } from 'graphql/queriesAndMutations'
import Button from 'react-bootstrap/Button'
import cloneDeep from '@bit/lodash.lodash.clone-deep'

interface Props<T> {
    params: T
    me?: User
    handleClose?: () => void
}

const EditRecipeContext = React.createContext<any>(undefined)
const EditRecipeHeader: React.FC<Props<ModalInterface>> = ({ params }) => {
    const { recipe } = params
    const { mealType } = recipe!

    const { inputs, handleChange } = useForm({
        mealType
    });

    return (
        <Fragment>
            <EditRecipeContext.Provider value={mealType}>
            <Modal.Title>Edit Recipe</Modal.Title>
            <Form>
                <Form.Group controlId="view-header">
                    <Form.Control as="select" name="mealType" value={inputs.mealType} onChange={handleChange}>
                        {getEnumNames(MealCategory).map((key: string | any) => <option key={key} value={MealCategory[key]}>{key}</option>)}
                    </Form.Control>
                </Form.Group>
            </Form>
            </EditRecipeContext.Provider>
        </Fragment>
    )
}

const EditRecipeBody: React.FC<Props<ModalInterface>> = ({ params, handleClose, me }) => {
    const { recipe, tags } = params
    const { id, title, readyInMinutes, servings, image, summary, sourceUrl, analyzedInstructions } = recipe!
    const [updateRecipe] = useUpdateRecipeByIdMutation()
    const mealType = useContext(EditRecipeContext)

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

    const handleSubmit = async () => {
        // e.preventDefault()
        console.log('submit edit');

        if (!isCreateRecipeValid()) {
            console.log('fill out all the mandatory fields');
            return
        }
        const updatedRecipe: EditRecipeInput = { ...inputs, id, tags, userId: me!.id, isStarred: recipe!.isStarred, __typename: 'Recipe' }
        console.log(updatedRecipe);
        const response = await updateRecipe({
            variables: { input: updatedRecipe },
            update(cache) {
                // const dataX: any = cache.readQuery({ query: GET_RECIPE_BY_ID, variables: { id: recipe!.id }}) //, data: { getRecipeById: { ...updatedRecipe } } })
                // const y  = { ...dataX.getRecipeById, ...updatedRecipe}
                debugger
                cache.writeQuery({ query: GET_RECIPE_BY_ID, variables: { id: recipe!.id }, data: { getRecipeById: {...updatedRecipe } } })
                // update recipes on me object
                const { me }: any = cloneDeep(cache.readQuery({ query: GET_ME_LOCAL }))
                me.recipes = me.recipes.map((r: RecipeSlim) => r.id === updatedRecipe.id ? updatedRecipe : r)
                cache.writeQuery({ query: GET_ME_LOCAL, data: { me } })
            }
        })

        console.log(response);
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

const EditRecipeFooter: React.FC = () => {
    return null
}



//TODO: FINISH EDIT RECIPE AND BREAK INTO OWN COMPONENTS EditModal etc



const CreateRecipeHeader: React.FC<Props<ModalInterface>> = ({ params }) => {
    const { header } = params

    return (
        <Modal.Title>Create New Recipe <Badge variant="secondary">{header}</Badge></Modal.Title>
    )
}

const CreateRecipeBody: React.FC<Props<ModalInterface>> = ({ params, handleClose, me }) => {
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
        const recipe = { ...inputs, tags, userId: me!.id, isStarred: false, mealType: parseFloat(MealCategory[header]) }
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
            <Button variant="secondary" type="submit">
                Create Recipe
                    </Button>
        </Form>
    )
}

const CreateRecipeFooter: React.FC<Props<ModalInterface>> = ({ params }) => {
    return null
}


const ViewRecipeHeader: React.FC<Props<ModalInterface>> = ({ params }) => {
    const { recipe, header } = params

    return (
        <Modal.Title>{recipe!.title} <Badge variant="secondary">{header}</Badge></Modal.Title>
    )
}

const ViewRecipeBody: React.FC<Props<ModalInterface>> = ({ params }) => {
    const { recipe } = params
    const { image, title, readyInMinutes, servings, summary } = recipe!

    return (
        <Fragment>
            {image &&
                <img src={image} alt={title} />}
            <h3>{title}</h3>
            <p>
                <span>Ready in: <strong>{readyInMinutes}</strong> mins</span><span style={{ marginLeft: '1rem' }}>Servings: {servings}</span>
            </p>
            {<p dangerouslySetInnerHTML={createMarkup(summary)}></p>}
        </Fragment>
    )
}

const ViewRecipeFooter: React.FC<Props<ModalInterface>> = ({ params, me }) => {
    const { recipe } = params
    const handleClose = () => null
    const { id } = recipe!

    const [deleteRecipeById] = useDeleteRecipeByIdMutation({
        variables: { recipeId: id!, userId: me!.id },
        update(cache, { data }) {
            // cloning to prevent any issues with not being able to update cache
            // const { me }: any = cloneDeep(cache.readQuery({ query: GET_ME_LOCAL }))
            if (data)
                cache.writeQuery({ query: GET_ME_LOCAL, data: { me: data.deleteRecipeById } })
        }
    })

    const deleteRecipe = () => {
        if (window.confirm('Are you sure you want to delete?')) {
            deleteRecipeById()
            handleClose()
        }
    }

    return (
        <Button variant="danger" onClick={deleteRecipe}>
            Delete
        </Button>
    )
}

export const useGenerateModalParts = (type: ModalCategory, params: ModalInterface, me: User, handleClose?: () => void) => {
    let ModalHeader: React.ReactElement | null = null
    let ModalBody: React.ReactElement | null = null
    let ModalFooter: React.ReactElement | null = null

    switch (type) {
        case ModalCategory.Create:
            ModalHeader = <CreateRecipeHeader params={params} />
            ModalBody = <CreateRecipeBody params={params} handleClose={handleClose} me={me} />
            ModalFooter = <CreateRecipeFooter params={params} />
            break
        case ModalCategory.View:
            ModalHeader = <ViewRecipeHeader params={params} />
            ModalBody = <ViewRecipeBody params={params} />
            ModalFooter = <ViewRecipeFooter params={params} me={me} />
            break
        case ModalCategory.Edit:
            ModalHeader = <EditRecipeHeader params={params} />
            ModalBody = <EditRecipeBody params={params} handleClose={handleClose} me={me}/>
            ModalFooter = <EditRecipeFooter/>
            break
        default:
        ModalHeader =null
        ModalBody = null
        ModalFooter =null
    }

    const getHeader = () => ModalHeader

    const getBody = () => ModalBody

    const getFooter = () => ModalFooter

    return { getHeader, getBody, getFooter }


}