import React, { Fragment, useState, useEffect, useContext } from 'react'
import nanoid from 'nanoid'
import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'
import { ModalInterface, User } from 'lib/interfaces'
import { ModalCategory, MealCategory } from 'lib/enums'
import CreateRecipeModal from './CreateRecipeModal'
import { ViewRecipeModal } from './ViewRecipeModal'
import { EditRecipeModal } from './EditRecipeModal'
import ReactTags, { Tag } from 'react-tag-autocomplete'
import { ProfileContext } from 'pages/Profile'
import { useGenerateModalParts } from 'lib/generateModalParts'
import './MainModal.css'
import { RecipeTag } from './RecipeTag'
interface Props<T> {
    params: T
    me: User
    handleClose: () => void
}

const MainModal: React.FC<Props<ModalInterface>> = ({ params, handleClose }) => {
    const { me } = useContext(ProfileContext)
    const { show, modalType, recipe } = params
    // const {recipe} = params!
    // const {mealType} = recipe!
    // if(recipe && recipe.mealType)
    const [tags, setTags] = useState<Tag[]>([])
    const [mealType, setMealType] = useState<MealCategory|undefined>(recipe && recipe.mealType) //since meal type is found in header and body contains rest of form 
    const { getHeader, getBody, getFooter } = useGenerateModalParts(modalType!, {...params, mealType, setMealType, tags}, me, handleClose)

    // REACT TAGS
    /////////////////////////////////// 
    const [suggestions, setSuggestions] = useState<Tag[]>([])

    const handleDelete = (indexToRmv: number) => {
        if (modalType === ModalCategory.View)
            return // not allowed to edit tags in view mode

        const updatedTags = tags.filter((_: any, index: number) => !(index === indexToRmv))
        setTags(updatedTags)
    }

    const handleAddition = (tag: Tag) => {
        if (modalType === ModalCategory.View)
            return // not allowed to edit tags in view mode

        tag = { ...tag, id: nanoid(8), __typename: 'TagInput'}
        const updatedTags = [...tags, tag]
        setTags(updatedTags)
    }

    useEffect(() => {
        if (me && me.tags)
            setSuggestions(me.tags)
        if (recipe && recipe.tags) {
            setTags(recipe.tags)
        }
    }, [recipe && recipe.tags])
    /////////////////////////////////// 

    return (
        <div>
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    {getHeader()}
                </Modal.Header>
                <Modal.Body>
                    {getBody()}
                </Modal.Body>
                <Modal.Footer>
                    <div style={{ width: '100%' }}>
                        {modalType === ModalCategory.View ? // replace editable tags with display badges
                            tags && tags.map(t => <RecipeTag key={t.id} text={t.name} />)
                            :
                            <ReactTags
                                tags={tags}
                                suggestions={suggestions}
                                handleDelete={handleDelete}
                                handleAddition={handleAddition}
                                allowNew={true}
                                allowBackspace={false}
                            />
                        }
                    </div>
                    {getFooter()}
                </Modal.Footer>
            </Modal>
        </div>
    )
}

export default MainModal
