import React, { Fragment, useState, useEffect, useContext } from 'react'
import nanoid from 'nanoid'
import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'
import { ModalInterface } from 'lib/interfaces'
import { ModalCategory } from 'lib/enums'
import CreateRecipeModal from './CreateRecipeModal'
import { ViewRecipeModal } from './ViewRecipeModal'
import { EditRecipeModal } from './EditRecipeModal'
import ReactTags, { Tag } from 'react-tag-autocomplete'
import { ProfileContext } from 'pages/Profile'
import { useGenerateModalParts } from 'lib/generateModalParts'

interface Props<T>{
    params: T
}

const MainModal:React.FC<Props<ModalInterface>> = ({params}) => {
    const me = useContext(ProfileContext)
    const {show, handleClose, type, recipe} = params
    const {getHeader, getBody, getFooter } = useGenerateModalParts(type!, params, me)

    

    // REACT TAGS
    /////////////////////////////////// 
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
        if(me && me.tags) 
            setSuggestions(me.tags)
        if(recipe && recipe.tags)
            setTags(recipe.tags)
    }, [])
    /////////////////////////////////// 

    return (
        // <Fragment>
            <Modal show={show} onHide={handleClose}>
                {getHeader()}
                <Modal.Body>
                    {getBody()}
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
                    {getFooter()}
                    {/* <Button variant="secondary" onClick={() => handleSave(type)}>
                        {`${renderText(type)} Recipe`}
                    </Button>
                    <Button variant="primary" onClick={() => setIsEditing(true)}>
                        {`Edit Recipe`}
                    </Button> */}
                </Modal.Footer>
            </Modal>
        // </Fragment>
    )
}

export default MainModal
