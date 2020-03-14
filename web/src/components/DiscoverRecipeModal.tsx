import React, { Fragment, useState, useEffect } from 'react'
import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form';
import { ModalCategory, MealCategory } from '../lib/enums'
import { Recipe, ModalInterface, User, AddRecipeInput } from 'lib/interfaces'
import useForm from 'lib/useForm';
import { useMeLocalQuery, useAddRecipeMutation, useMeQuery, useMeLocalLazyQuery } from 'generated/graphql';
import { getEnumNames } from 'lib/utils';
import { useMutation } from '@apollo/react-hooks';
import ReactTags, {Tag} from 'react-tag-autocomplete'
import gql from 'graphql-tag';


interface Props extends ModalInterface {
    options: {
        type: ModalCategory
    }
    recipe: Recipe | null | undefined
}

interface ModalContent { title: string, actionButton: string, body: any }

export const DiscoverRecipeModal: React.FC<Props> = ({ show, handleClose, recipe, options }) => {
    const [isEditing, setIsEditing] = useState(false)
    const { type } = options
    const [addRecipe] = useAddRecipeMutation()
    const { data: user, loading: loadingLocal } = useMeLocalQuery()
    const { title, readyInMinutes, servings, image, summary, sourceUrl, analyzedInstructions, mealType = 1 } = recipe!

    //REACT TAGS
    /////////////////////////////////// 
    const [tags, setTags] = useState<Tag[]>([])
    const [suggestions, setSuggestions] = useState<Tag[]>([])

    const handleDelete = (indexToRmv: number) => {
        const updatedTags = tags.filter((_:any, index: number) => !(index === indexToRmv))
        setTags(updatedTags)
    }

    const handleAddition = (tag: Tag) => {
        const updatedTags = [...tags, tag]
        setTags(updatedTags)
    }

    // const createTag = (tagName: string): Tag => {id: tagName}

    // const {data, loading} = useMeLocalQuery()

    // useEffect(() => {
    //     // get me from context
        
    //     //add 
    //     if(data && data.me && data.me.tags)
    //     setSuggestions(data.me.tags)

    // }, [])

    useEffect(() => {
        if(user && user.me && user.me.tags) 
            setSuggestions(user.me.tags)
    }, [])

    /////////////////////////////////

    const ADD_RECIPE = gql`
        mutation AddRecipe($recipe: AddRecipeInput!) {
        addRecipe(input: $recipe) {
            id
            email
            recipes {
                id
                title
                image
                mealType
                }
            }
        }
    `

    const GET_ME = gql`
query Me {
  me {
    id
    email
    recipes {
      id
      title
      image
      mealType
    }
  }
}
`

    const GET_ME_LOCAL = gql`
query meLocal {
    me @client {
        id
        email
        recipes {
            id
            title
            image
            mealType
        }
    }
}
`

    const [addRecipeMutation] = useMutation(ADD_RECIPE, {
        update(cache, { data: { addRecipe } }) {
            debugger;
            console.log(addRecipe);

            const { me }: any = cache.readQuery({ query: GET_ME_LOCAL })

            cache.writeQuery({
                query: GET_ME_LOCAL,
                data: { me: { ...me, recipes: addRecipe.recipes } }
            })
            // const me2: User | null = cache.readQuery({ query: GET_ME_LOCAL })
            // console.log(me2);
        }
    })


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

    const addRecipeFromDiscover = () => {
        if (!recipe)
            throw new Error('recipe from discover not found')

        console.log(`mealType: ${inputs.mealType}`);
        if (!inputs.mealType)
            throw new Error('need a meal type')


        const tagsFormatted = tags.map((t: any) => {
            delete t.__typename
            return t
        })
        const formattedRecipe: AddRecipeInput = { ...recipe, tags: tagsFormatted, userId: user!.me!.id, mealType: parseFloat(inputs.mealType) }
        // remove properties not needed by mutation
        delete formattedRecipe.id
        delete formattedRecipe.__typename
        console.log('adding recipe');

        // addRecipe({
        //     variables: {
        //         recipe: formattedRecipe
        //     }
        // })

        addRecipeMutation({
            variables: {
                recipe: formattedRecipe
            }
        })
    }

    const editRecipe = () => {
        // grab details from recipe
        // make graphql query to request them
    }

    const handleSave = () => {
        // switch case to handle the different saving/updating options
        // switch (category) {
        //     case ModalCategory.NewDiscover:

        //         // add from discover
        //         addRecipeFromDiscover()
        //         break
        //     case ModalCategory.Edit:
        //         editRecipe()
        //         break
        // }
        // edit existing recipe

        addRecipeFromDiscover()
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

    const handleSubmit = async (e: any) => {
        e.preventDefault()
        console.log('submit edit');

        if (!isCreateRecipeValid()) {
            console.log('fill out the mandatory fields');
            return
        }
        const recipe = { ...inputs, userId: user!.me!.id }
        console.log(recipe);
        const response = await addRecipe({
            variables: { recipe }
        })

        console.log(response);

        resetForm()
        handleClose()
    }

    const displayEditContent = (recipe: Recipe | null | undefined) => (
        recipe ?
            <Form onSubmit={handleSubmit}>
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
                <Button variant="secondary" type="submit">
                    Edit Recipe
            </Button>
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
                    recipe && displayViewContent(recipe)
                }
            </Modal.Body>
            <Modal.Footer>
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
                <Button variant="secondary" onClick={() => handleSave()}>
                    {`Add Recipe`}
                </Button>
            </Modal.Footer>
        </Modal>
    )
}
