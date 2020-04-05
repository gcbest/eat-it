import React, { Fragment, useState, useEffect, useContext } from 'react'
import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form';
import { MealCategory } from '../lib/enums'
import { ModalInterface, AddRecipeInput } from 'lib/interfaces'
import useForm from 'lib/useForm';
import { useAddRecipeMutation } from 'generated/graphql';
import { getEnumNames, createMarkup } from 'lib/utils';
import ReactTags, { Tag } from 'react-tag-autocomplete'
import nanoid from 'nanoid';
import { DiscoverContext } from 'pages/Discover';
import { GET_ME_LOCAL } from 'graphql/queriesAndMutations';
import { FaHeart } from 'react-icons/fa'
import { useToasts } from 'react-toast-notifications'




// interface Props extends ModalInterface {
//     options: {
//         type: ModalCategory
//     }
//     recipe: Recipe | null | undefined
// }

interface Props<T> {
    params: T
    handleClose: () => void
}

// interface ModalContent { title: string, actionButton: string, body: any }

// const DiscoverRecipeModal: React.FC<Props> = ({ show, handleClose, recipe, options }) => {
const DiscoverRecipeModal: React.FC<Props<ModalInterface>> = ({ params, handleClose }) => {
    // const handleClose = () => null
    // const [isEditing, setIsEditing] = useState(false)

    const { addToast } = useToasts()

    const { show, recipe } = params

    const user = useContext(DiscoverContext)

    const [addRecipe] = useAddRecipeMutation()
    // const { type } = options
    const { title, readyInMinutes, servings, image, summary, sourceUrl, analyzedInstructions, extendedIngredients, dishTypes = [], mealType = 1 } = recipe!


    //REACT TAGS
    /////////////////////////////////// 
    const createTags = (tagNamesArr: string[]): Tag[] => tagNamesArr.map<Tag>(tagName => ({ id: nanoid(8), name: tagName }))

    const defaultTags = createTags(dishTypes)
    const [tags, setTags] = useState<Tag[]>(defaultTags)
    const [suggestions, setSuggestions] = useState<Tag[]>([])

    const handleDelete = (indexToRmv: number) => {
        const updatedTags = tags.filter((_: any, index: number) => !(index === indexToRmv))
        setTags(updatedTags)
    }

    const handleAddition = (tag: Tag) => {
        tag = { ...tag, id: nanoid(8) }
        const updatedTags = [...tags, tag]
        setTags(updatedTags)
    }


    useEffect(() => {
        if (user && user.me && user.me.tags)
            setSuggestions(user.me.tags)
    }, [])

    /////////////////////////////////

    const { inputs, handleChange, resetForm, isCreateRecipeValid } = useForm({
        title,
        readyInMinutes,
        servings,
        image,
        summary,
        sourceUrl,
        analyzedInstructions,
        extendedIngredients,
        mealType
    });


    if (user)
        console.log(user);

    const addRecipeFromDiscover = async () => {
        if (!recipe)
            throw new Error('recipe from discover not found')

        if (!inputs.mealType)
            throw new Error('need a meal type')

        const formattedRecipe: AddRecipeInput = {
            ...recipe,
            tags,
            userId: user!.me!.id,
            isStarred: false,
            mealType: parseFloat(inputs.mealType)
        }

        // remove properties not needed by mutation
        delete formattedRecipe.id
        delete formattedRecipe.dishTypes
        console.log('adding recipe');

        const {errors, data} = await addRecipe({
            variables: {
                recipe: formattedRecipe
            },
            update(cache, { data }) {
                console.log(data);

                const { me }: any = cache.readQuery({ query: GET_ME_LOCAL })
                if (data && data.addRecipe) {
                    cache.writeQuery({
                        query: GET_ME_LOCAL,
                        data: { me: { ...me, recipes: data.addRecipe.recipes } }
                    })
                }
            }
        })

        if(errors)
            addToast(errors[0].message, { appearance: 'error' })
        if(data)
            addToast('Recipe Saved to Profile', { appearance: 'success' })


    }


    const handleSave = () => {
        addRecipeFromDiscover()
        handleClose()
    }

    // const displayViewContent = (recipe: Recipe) => (

    //     <Fragment>
    //         {image &&
    //             <img src={image} alt={title} style={{ width: '100%' }} />}
    //         <h3>{title}</h3>
    //         <p>
    //             <span>Ready in: <strong>{readyInMinutes}</strong> mins</span><span style={{ marginLeft: '1rem' }}>Servings: {servings}</span>
    //         </p>
    //         {<p dangerouslySetInnerHTML={createMarkup(summary)}></p>}
    //     </Fragment>
    // )

    // const handleSubmit = async (e: any) => {
    //     e.preventDefault()
    //     console.log('submit edit');

    //     if (!isCreateRecipeValid()) {
    //         console.log('fill out the mandatory fields');
    //         return
    //     }
    //     const recipe = { ...inputs, userId: user!.me!.id }
    //     console.log(recipe);
    //     const response = await addRecipe({
    //         variables: { recipe }
    //     })

    //     console.log(response);

    //     resetForm()
    //     handleClose()
    // }

    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Form>
                    <Form.Group controlId="exampleForm.ControlSelect2">
                        <Form.Label>Select Meal Type</Form.Label>
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
                        {image &&
                            <img src={image} alt={title} style={{ width: '100%' }} />}
                        <h3>{title}</h3>
                        <p>
                            <span>Ready in: <strong>{readyInMinutes}</strong> mins</span><span style={{ marginLeft: '1rem' }}>Servings: {servings}</span>
                        </p>
                        {<p dangerouslySetInnerHTML={createMarkup(summary)}></p>}
                    </Fragment>
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
                    Add Recipe <FaHeart />
                </Button>
            </Modal.Footer>
        </Modal>
    )
}

export default React.memo(DiscoverRecipeModal)