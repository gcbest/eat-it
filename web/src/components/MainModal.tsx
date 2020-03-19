import React, { Fragment, useState, useEffect, useContext } from 'react'
import nanoid from 'nanoid'
import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'
import { ModalInterface, User } from 'lib/interfaces'
import { ModalCategory } from 'lib/enums'
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
    const { getHeader, getBody, getFooter } = useGenerateModalParts(modalType!, params, me, handleClose)

    // REACT TAGS
    /////////////////////////////////// 
    const [tags, setTags] = useState<Tag[]>([])
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

        tag = { ...tag, id: nanoid(8) }
        const updatedTags = [...tags, tag]
        setTags(updatedTags)
    }

    useEffect(() => {
        if (me && me.tags)
            setSuggestions(me.tags)
        if (recipe && recipe.tags)
            setTags(recipe.tags)
    }, [])
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
                        {modalType === ModalCategory.View ?
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
                    {/* <Button variant="secondary" onClick={() => handleSave(modalType)}>
                        {`${renderText(modalType)} Recipe`}
                    </Button>
                    <Button variant="primary" onClick={() => setIsEditing(true)}>
                        {`Edit Recipe`}
                    </Button> */}
                </Modal.Footer>
            </Modal>
        </div>
    )
}

export default MainModal
