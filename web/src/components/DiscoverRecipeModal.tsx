import React, { Fragment, useState, useEffect, useContext } from 'react'
import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form';
import { MealCategory } from '../lib/enums'
import { ModalInterface, AddRecipeInput } from 'lib/interfaces'
import useForm from 'lib/useForm';
import { useAddRecipeMutation, Tag } from 'generated/graphql';
import { getEnumNames, createMarkup } from 'lib/utils';
import ReactTags, {Tag as ReactTag} from 'react-tag-autocomplete'
import nanoid from 'nanoid';
import { DiscoverContext } from 'pages/Discover';
import { GET_ME_LOCAL } from 'graphql/queriesAndMutations';
import { FaHeart } from 'react-icons/fa'
import { useToasts } from 'react-toast-notifications'

interface Props<T> {
    params: T
    handleClose: () => void
}

// interface newReactTag extends Omit<ReactTag, 'id'> {
//     id: string
// }


const DiscoverRecipeModal: React.FC<Props<ModalInterface>> = ({ params, handleClose }) => {
    const { addToast } = useToasts()

    const { show, recipe } = params

    const user = useContext(DiscoverContext)

    const [addRecipe] = useAddRecipeMutation()
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

    const handleAddition = (tag: ReactTag) => {
        const newTag: Tag = { ...tag, id: nanoid(8) } // convert to regular tag
        const updatedTags = [...tags, newTag]
        setTags(updatedTags)
    }


    useEffect(() => {
        if (user && user.me && user.me.tags)
            setSuggestions(user.me.tags)
    }, [user])

    /////////////////////////////////

    const { inputs, handleChange} = useForm({
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

        const {errors, data} = await addRecipe({
            variables: {
                recipe: formattedRecipe
            },
            update(cache, { data }) {
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