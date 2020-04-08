import React, { useState, useEffect } from 'react'
import Form from 'react-bootstrap/Form'
import { ModalCategory } from 'lib/enums'
import { RecipeTag } from './RecipeTag'
import ReactTags, { Tag } from 'react-tag-autocomplete'
import nanoid from 'nanoid'
import { Recipe, User, ModalInterface } from 'lib/interfaces'

interface Props {
    params: ModalInterface
    me?: User
    setUpdatedTags?: (tags: Tag[]) => void
}

const RecipeTagsArea: React.FC<Props> = ({ params, me, setUpdatedTags }) => {
    const { recipe, modalType } = params
    const [tags, setTags] = useState<Tag[]>([])


    // REACT TAGS
    /////////////////////////////////// 
    const [suggestions, setSuggestions] = useState<Tag[]>([])

    const handleDelete = (indexToRmv: number) => {
        if (modalType === ModalCategory.View)
            return // not allowed to edit tags in view mode

        const updatedTags = tags.filter((_: any, index: number) => !(index === indexToRmv))
        setTags(updatedTags)
        if(setUpdatedTags)
            setUpdatedTags(updatedTags)
    }

    const handleAddition = (tag: Tag) => {
        if (modalType === ModalCategory.View)
            return // not allowed to edit tags in view mode

        tag = { ...tag, id: nanoid(8), __typename: 'TagInput' }
        const updatedTags = [...tags, tag]
        setTags(updatedTags)
        if(setUpdatedTags)
            setUpdatedTags(updatedTags)
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
        <div style={{ width: '100%' }}>
            <Form.Label>Recipe Tags</Form.Label>
            <br />
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
    )
}

export default RecipeTagsArea
