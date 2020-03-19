import React, { useEffect, useState, useContext } from 'react'
import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form';
import Badge from 'react-bootstrap/Badge'
import { ModalCategory, MealCategory } from '../lib/enums'
import { Recipe, ModalInterface, User, AddRecipeInput } from 'lib/interfaces'
import useForm from 'lib/useForm';
import { useAddRecipeMutation } from 'generated/graphql';
import { getEnumNames } from 'lib/utils';
import { GET_ME_LOCAL } from 'graphql/queriesAndMutations';
import { useMutation } from '@apollo/react-hooks';
import cloneDeep from '@bit/lodash.lodash.clone-deep';
import ReactTags, {Tag} from 'react-tag-autocomplete'
import nanoid from 'nanoid';
import { ProfileContext } from 'pages/Profile';


// interface Props extends ModalInterface {
//     options: {
//         header: string | any
//     }
// }

interface Props<T>{
    params: T
}

const CreateRecipeModal: React.FC<Props<ModalInterface>> = ({params}) => {
    const user = useContext(ProfileContext)
    const { show } = params
    const handleClose = () => null
    
    const {header}: any = params // using any so that it can be use to find MealCategory enum value
    
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


   //REACT TAGS
    /////////////////////////////////// 
    // const createTags = (tagNamesArr: string[]): Tag[] => tagNamesArr.map<Tag>(tagName => ({id: nanoid(8), name: tagName}))

    // const defaultTags = createTags(dishTypes)
    const [tags, setTags] = useState<Tag[]>([])
    const [suggestions, setSuggestions] = useState<Tag[]>([])

    const handleDelete = (indexToRmv: number) => {
        const updatedTags = tags.filter((_:any, index: number) => !(index === indexToRmv))
        setTags(updatedTags)
    }

    const handleAddition = (tag: Tag) => {
        tag = {...tag, id: nanoid(8)}
        const updatedTags = [...tags, tag]
        setTags(updatedTags)
    }

    
    useEffect(() => {
        if(user && user.me && user.me.tags) 
            setSuggestions(user.me.tags)
    }, [])

    /////////////////////////////////

    // if (loadingLocal)
    //     console.log('loading local');

    if (user)
        console.log(user);

    const handleSubmit = async (e: any) => {
        e.preventDefault()

        if (!isCreateRecipeValid()) {
            console.log('fill out the mandatory fields');
            return
        }
        const recipe = { ...inputs, tags, userId: user!.me!.id, isStarred: false, mealType: parseFloat(MealCategory[header]) }
        console.log(recipe);
        const response = await addRecipe({
            variables: { recipe },
            update(cache, { data }) {
                // cloning to prevent any issues with not being able to update cache
                const { me }: any = cloneDeep(cache.readQuery({ query: GET_ME_LOCAL }))
                if(data && data.addRecipe)
                    cache.writeQuery({ query: GET_ME_LOCAL, data: { me: data.addRecipe } })
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

export default React.memo(CreateRecipeModal)